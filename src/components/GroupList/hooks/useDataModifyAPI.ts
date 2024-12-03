import { Dispatch, SetStateAction } from "react";
import { uniq } from "lodash-es";
import { GroupItemType } from "@/components/GroupItem/type";
import { GroupListDataType, ViewStateType } from "@/components/GroupList";
import { isInFolder } from "@/components/GroupList/helpers/dataOperation";
import { UseDataReturnType } from "@/components/GroupList/hooks/useData";
import { insertBefore } from "@/components/GroupList/utils";
import { GroupItemTypeEnum } from "@/enums";
import { produce } from "immer";

export type UseDataModifyAPIReturnType = {
  /**
   * unFocus 一个 item
   * @param id
   */
  unFocusItem(id?: GroupItemType["id"]): void;
  /**
   * focus 一个 item
   * 注意：folder 无法 focus
   * @param id
   */
  focusItem(id: GroupItemType["id"]): void;
  /**
   * 展开或收起一个文件夹
   * @param id
   */
  toggleFolderExpanded(id: GroupItemType["id"]): void;
  /**
   * 展开一个文件夹
   * @param id
   */
  expandFolder(id: GroupItemType["id"]): void;
  /**
   * 展开所有文件夹
   */
  expandAll(): void;
  /**
   * 收起一个文件夹
   * @param id
   */
  collapseFolder(id: GroupItemType["id"]): void;
  /**
   * 收起所有文件夹
   */
  collapseAll(): void;
  /**
   * 删除一个 item，如果是数组同时删除数组里面的所有内容
   * @param id
   */
  deleteItem(id: GroupItemType["id"]): void;
  /**
   * 删除多个 items
   * @param ids
   */
  deleteItems(ids: GroupItemType["id"][]): void;
  /**
   * 将用户添加到文件夹
   * 如果用户已经在其他文件夹中将会移动到 groupID 指定的文件夹
   * 如果用户不存在，则会新建
   * @param folderId
   * @param items
   */
  addItemsToFolder(folderId: GroupItemType["id"], items: GroupItemType[]): void;
  /**
   * 将 items 添加到指定文件夹中，通过 ids
   * 如果 item 不存在将不会添加
   * @param folderId
   * @param itemIds
   */
  addItemsToFolderByIds(
    folderId: GroupItemType["id"],
    itemIds: GroupItemType["id"][],
  ): void;
  /**
   * 将 items 从指定文件夹中删除，通过 ids
   * @param folderId
   * @param itemIds
   */
  removeItemsFromFolderByIds(
    folderId: GroupItemType["id"],
    itemIds: GroupItemType["id"][],
  ): void;
  /**
   * 添加一个分组
   * @param payload
   */
  addAFolder(payload: { name: string; id: string; parentId?: string }): void;
  /**
   * 递归获取一个文件夹下面所有的节点 id（不包含子文件夹 ids）
   * @param folderId
   * @param _ids 不需要传入
   */
  getAllItemsFromFolder(
    folderId: GroupItemType["id"],
    _ids?: GroupItemType["id"][],
  ): GroupItemType["id"][];

  /**
   * 将一个 item/folder 移动到指定的 index 位置
   * 主要用于拖拽排序
   * @param targetId
   * @param destIndex
   */
  _moveItemToIndex(targetId: GroupItemType["id"], destIndex: number): void;
  /**
   * 将一个 item/folder 移动到指定文件夹的最前面
   * @param targetId
   * @param destFolderId
   */
  _moveItemToFolder(
    targetId: GroupItemType["id"],
    destFolderId: GroupItemType["id"],
  ): void;
};

export function useDataModifyAPI(
  props: {
    data: GroupListDataType;
    viewStates: ViewStateType;
    onDataChange(data: GroupListDataType): void;
    setViewStates: Dispatch<SetStateAction<ViewStateType>>;
    alwaysMakeFolderTop: boolean;
  } & UseDataReturnType,
): UseDataModifyAPIReturnType {
  const {
    data,
    listItemsIds,
    parentIdMap,
    alwaysMakeFolderTop,
    onDataChange,
    setViewStates,
  } = props;

  const getAllItemsFromFolder: UseDataModifyAPIReturnType["getAllItemsFromFolder"] =
    (folderId, ids = []) => {
      if (!data[folderId]?.isFolder) return [];
      const target = data[folderId];
      const children = target.children;
      if (!children) return [];

      for (const child of children) {
        if (!data[child].isFolder) {
          ids.push(data[child].data.id);
        } else {
          getAllItemsFromFolder(child, ids);
        }
      }

      return ids;
    };

  const addAFolder: UseDataModifyAPIReturnType["addAFolder"] = ({
    id,
    parentId = "root",
    name,
  }) => {
    if (!data[parentId]?.isFolder) return;
    const parentChildren = data[parentId].children;
    parentChildren && parentChildren.unshift(id);
    data[id] = {
      isFolder: true,
      index: id,
      children: [],
      data: {
        id: id,
        type: GroupItemTypeEnum.GROUP,
        title: name,
        emoji: undefined,
        message: "",
        avatar: undefined,
        backgroundColor: undefined,
        readonly: false,
      },
    };

    _onDataChange({ ...data });
  };

  const removeItemsFromFolderByIds: UseDataModifyAPIReturnType["removeItemsFromFolderByIds"] =
    (folderId, itemIds) => {
      if (!data[folderId]?.isFolder) return;

      //  移除 viewStates 上的数据
      setViewStates(
        produce((draft) => {
          for (const id of itemIds) {
            if (data[folderId].children.includes(id)) {
              delete data[id];

              draft.expanded = draft.expanded.filter((_id) => _id !== id);
              draft.selected = draft.selected.filter((_id) => _id !== id);
              if (draft.focused === id) {
                draft.focused = "";
              }
            }
          }
        }),
      );

      data[folderId].children = data[folderId].children.filter(
        (id) => !itemIds.includes(id),
      );

      _onDataChange({ ...data });
    };

  const addItemsToFolder: UseDataModifyAPIReturnType["addItemsToFolder"] = (
    folderId,
    items,
  ) => {
    if (!data[folderId]?.isFolder) return;

    for (const item of items) {
      data[folderId].children.unshift(item.id);

      //  如果用户已经存在，需要从 parent 里面删除下
      if (data[item.id]) {
        const parentId = parentIdMap[item.id];
        if (parentId !== folderId) {
          data[parentId].children = data[parentId].children.filter(
            (id) => id !== item.id,
          );
        }
      } else {
        data[item.id] = {
          isFolder: false,
          index: item.id,
          children: [],
          data: item,
        };
      }

      data[folderId].children = uniq(data[folderId].children);
    }

    _onDataChange({ ...data });
  };

  const addItemsToFolderByIds: UseDataModifyAPIReturnType["addItemsToFolderByIds"] =
    (folderId, itemIds) => {
      const items = itemIds
        .map((id) => data[id]?.data)
        .filter((data) => !!data) as GroupItemType[];

      addItemsToFolder(folderId, items);
    };

  const unFocusItem: UseDataModifyAPIReturnType["unFocusItem"] = (id) => {
    setViewStates(
      produce((draft) => {
        if (id) {
          draft.focused = draft.focused === id ? "" : draft.focused;
        } else {
          draft.focused = "";
        }
      }),
    );
    return;
  };

  const focusItem: UseDataModifyAPIReturnType["focusItem"] = (id) => {
    if (!data[id]) {
      setViewStates(
        produce((draft) => {
          draft.focused = "";
        }),
      );
      return;
    }

    setViewStates(
      produce((draft) => {
        if (!data[id]) {
          draft.focused = "";
        } else if (draft.focused === id) {
          draft.focused = id;
        } else {
          draft.focused = id;
        }
      }),
    );
  };

  const toggleFolderExpanded: UseDataModifyAPIReturnType["toggleFolderExpanded"] =
    (id) => {
      if (!data[id]?.isFolder) return;
      setViewStates(
        produce((draft) => {
          if (draft.expanded.includes(id)) {
            draft.expanded = draft.expanded.filter((_id) => _id !== id);
          } else {
            draft.expanded.push(id);
          }
        }),
      );
    };

  const collapseFolder: UseDataModifyAPIReturnType["collapseFolder"] = (id) => {
    if (!data[id]?.isFolder) return;
    setViewStates(
      produce((draft) => {
        draft.expanded = draft.expanded.filter((_id) => _id !== id);
      }),
    );
  };

  const expandAll: UseDataModifyAPIReturnType["expandAll"] = () => {
    const folderIDs: string[] = [];
    for (const key in data) {
      if (data[key].isFolder) {
        folderIDs.push(key);
      }
    }

    setViewStates(
      produce((draft) => {
        draft.expanded = folderIDs;
      }),
    );
  };

  const collapseAll: UseDataModifyAPIReturnType["collapseAll"] = () => {
    setViewStates(
      produce((draft) => {
        draft.expanded = [];
      }),
    );
  };

  const expandFolder: UseDataModifyAPIReturnType["expandFolder"] = (id) => {
    if (!data[id]?.isFolder) return;
    setViewStates(
      produce((draft) => {
        if (!draft.expanded.includes(id)) {
          draft.expanded.push(id);
        }
      }),
    );
  };

  const deleteItems: UseDataModifyAPIReturnType["deleteItems"] = (ids) => {
    const deletedIds = ids.map((id) => _deleteFolder(id)).flat();
    _cleanUpItems(deletedIds);
    _onDataChange({ ...data });
  };

  const deleteItem: UseDataModifyAPIReturnType["deleteItem"] = (id) => {
    const deletedIds = _deleteFolder(id);
    _cleanUpItems(deletedIds);
    _onDataChange({ ...data });
  };

  const _moveItemToFolder: UseDataModifyAPIReturnType["_moveItemToFolder"] = (
    targetId,
    destFolderId,
  ) => {
    if (!data[destFolderId]?.isFolder) return;

    const targetParentId = parentIdMap[targetId];

    //  首先之前的父节点的 children 中删除
    if (targetParentId && data[targetParentId]) {
      data[targetParentId].children = (
        data[targetParentId].children ?? []
      ).filter((id) => id !== targetId);
    }

    const parentChildren = data[destFolderId]?.children ?? [];
    parentChildren.unshift(targetId);

    _onDataChange({ ...data });
  };

  const _moveItemToIndex: UseDataModifyAPIReturnType["_moveItemToIndex"] = (
    targetId,
    destIndex,
  ) => {
    const currentIndex = listItemsIds.findIndex((id) => id === targetId);
    const isFolder = data[targetId].isFolder;
    const offset = destIndex > currentIndex ? 1 : 0;
    const nextIndexId = listItemsIds[destIndex + offset] ?? null;
    const nextItemParentId = parentIdMap[nextIndexId];
    const targetParentId = parentIdMap[targetId];

    //  自己拖拽自己，然后放到自己的位置，相当于没动
    if (targetId === listItemsIds[destIndex]) return;

    if (isFolder) {
      //  如果将文件夹拖拽到了自己的子级
      if (nextItemParentId === targetId) return;
      //  判断是不是递归子节点
      if (isInFolder(nextIndexId, targetId, parentIdMap)) return;
    }

    //  首先之前的父节点的 children 中删除
    if (
      targetParentId !== nextItemParentId &&
      targetParentId &&
      data[targetParentId]
    ) {
      data[targetParentId].children = (
        data[targetParentId].children ?? []
      ).filter((id) => id !== targetId);
    }

    //  如果是拖拽到最后边
    if (!nextItemParentId) {
      const lastItemId = listItemsIds[destIndex];
      const nextItemParentId = parentIdMap[lastItemId];

      data[nextItemParentId]?.children?.push(targetId);
    } else {
      //  添加到新的父节点 children 中
      const parentChildren = data[nextItemParentId]?.children ?? [];
      data[nextItemParentId].children = insertBefore(
        parentChildren,
        targetId,
        nextIndexId,
      );
    }

    _onDataChange({ ...data });
  };

  function _deleteFolder(folderId, deletedId: string[] = []) {
    if (!data[folderId]) return [];
    const target = data[folderId];

    if (target.isFolder) {
      const children = target.children ?? [];
      for (const child of children) {
        _deleteFolder(child, deletedId);
      }
    }

    delete data[folderId];
    deletedId.push(folderId);

    return deletedId;
  }

  //  清理删除后的数据通过 ids
  function _cleanUpItems(deletedIds: GroupItemType["id"][]) {
    //  从 children 中移除所有被删除的 ids
    //  清除所有群组中包含这些 peersId 的 children
    for (const key in data) {
      const children = data[key].children;
      if (data[key].isFolder && children) {
        data[key].children = children.filter(
          (id) => !deletedIds.includes(id as string),
        );
      }
    }

    //  移除 viewStates 上的数据
    setViewStates(
      produce((draft) => {
        draft.expanded = draft.expanded.filter(
          (id) => !deletedIds.includes(id),
        );
        draft.selected = draft.selected.filter(
          (id) => !deletedIds.includes(id),
        );
        if (deletedIds.includes(draft.focused)) {
          draft.focused = "";
        }
      }),
    );
  }

  function _onDataChange(data: GroupListDataType) {
    if (alwaysMakeFolderTop) {
      sortFolderStructure(data);
    }
    onDataChange(data);
  }

  function sortFolderStructure(data: GroupListDataType): GroupListDataType {
    // Helper function to sort children of a folder
    const sortChildren = (children: string[]): string[] => {
      return children.sort((a, b) => {
        const itemA = data[a];
        const itemB = data[b];

        // If both are folders or both are not folders, maintain original order
        if (itemA.isFolder === itemB.isFolder) {
          return 0;
        }

        // If itemA is a folder and itemB is not, itemA should come first
        return itemA.isFolder ? -1 : 1;
      });
    };

    // Process each item in the structure
    const processItem = (itemId: string) => {
      const item = data[itemId];

      if (item.isFolder && item.children.length > 0) {
        // Sort immediate children
        item.children = sortChildren(item.children);

        // Recursively process each child
        item.children.forEach((childId) => {
          processItem(childId);
        });
      }
    };

    // Start processing from root
    if (data.root) {
      processItem("root");
    } else {
      // If there's no root, process all top-level items
      Object.keys(data).forEach((itemId) => {
        processItem(itemId);
      });
    }

    return data;
  }

  return {
    getAllItemsFromFolder,
    unFocusItem,
    focusItem,
    toggleFolderExpanded,
    expandFolder,
    expandAll,
    collapseAll,
    collapseFolder,
    deleteItem,
    deleteItems,
    addItemsToFolder,
    addItemsToFolderByIds,
    removeItemsFromFolderByIds,
    addAFolder,
    _moveItemToIndex,
    _moveItemToFolder,
  };
}
