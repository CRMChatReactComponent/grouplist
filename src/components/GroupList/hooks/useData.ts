import { useMemo } from "react";
import { GroupItemType } from "@/components/GroupItem/type";
import { GroupListDataType } from "@/components/GroupList";

type ParentId = GroupItemType["id"] | "root";
export type ParentIdMapType = Record<GroupItemType["id"], ParentId>;
export type UseDataReturnType = {
  listItemsIds: GroupItemType["id"][];

  //  用于缓存每个 groupList 的 parent 关系
  parentIdMap: ParentIdMapType;

  searchFilteredData: GroupListDataType;
};

export function useData(
  data: GroupListDataType,
  expandedIds: GroupItemType["id"][],
  searchValue: string,
): UseDataReturnType {
  const searchFilteredData = useMemo(() => {
    return Object.entries(data)
      .filter(([key, item]) => {
        return (
          item.data.title.toLowerCase().includes(searchValue.toLowerCase()) &&
          !item.isFolder
        );
      })
      .reduce(
        (prev, [key, item]) => {
          prev[key] = item;
          prev.root.children.push(key);
          return prev;
        },
        {
          root: {
            isFolder: true,
            index: "root",
            children: [] as string[],
            data: {
              id: "root",
              type: 1,
              title: "root group",
              message: "",
              readonly: false,
              backgroundColor: "",
              emoji: "",
              avatar: "",
            },
          },
        } as GroupListDataType,
      );
  }, [data, searchValue]);

  const listItemsIds = useMemo(() => {
    const ids: string[] = [];
    const rootListIds = data["root"].children as string[];

    for (const id of rootListIds) {
      ids.push(id);
      if (data[id].isFolder) {
        getExpandedChildren(id, ids);
      }
    }

    return ids;
  }, [data, expandedIds]);

  const parentIdMap = useMemo(() => {
    const map: Record<GroupItemType["id"], ParentId> = {};
    for (const key in data) {
      if (key === "root") continue;
      const item = data[key];
      if (item.isFolder && item.children) {
        item.children.map((childId) => {
          map[childId] = data[key].data.id;
        });
      }

      if (!map[item.data.id]) {
        map[item.data.id] = "root";
      }
    }

    return map;
  }, [data]);

  //  递归获取展开的节点 children ids
  function getExpandedChildren(groupListItemId: string, sourceIds: string[]) {
    if (!data[groupListItemId]?.isFolder) return;

    //  如果没有展开
    if (!expandedIds.includes(groupListItemId)) return;

    const children = data[groupListItemId].children ?? [];

    for (const id of children) {
      sourceIds.push(id as string);
      if (data[id].isFolder) {
        getExpandedChildren(id as string, sourceIds);
      }
    }
  }

  return {
    listItemsIds,
    parentIdMap,
    searchFilteredData,
  };
}
