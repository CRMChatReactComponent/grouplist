import { Dispatch, SetStateAction } from "react";
import { GroupItemType } from "@/components/GroupItem/type";
import { GroupListDataType, ViewStateType } from "@/components/GroupList";
import { isInFolder } from "@/components/GroupList/helpers/dataOperation";
import { UseDataReturnType } from "@/components/GroupList/hooks/useData";
import { insertBefore } from "@/components/GroupList/utils";
import { produce } from "immer";

export type UseDataModifyAPIReturnType = {
  /**
   * unFocus 一个 item
   * @param id
   */
  unFocusItem(id: GroupItemType["id"]): void;
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
  } & UseDataReturnType,
): UseDataModifyAPIReturnType {
  const { data, listItemsIds, parentIdMap, onDataChange, setViewStates } =
    props;

  const unFocusItem: UseDataModifyAPIReturnType["unFocusItem"] = (id) => {
    setViewStates(
      produce((draft) => {
        draft.focused = "";
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

    onDataChange({ ...data });
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

    onDataChange({ ...data });
  };

  return {
    unFocusItem,
    focusItem,
    toggleFolderExpanded,
    expandFolder,
    expandAll,
    collapseAll,
    collapseFolder,
    _moveItemToIndex,
    _moveItemToFolder,
  };
}
