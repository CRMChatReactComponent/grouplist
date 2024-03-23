import { useMemo } from "react";
import { GroupItemType } from "@/components/GroupItem/type";
import { GroupListDataType } from "@/components/GroupList";

type ParentId = GroupItemType["id"] | "root";
export type ParentIdMapType = Record<GroupItemType["id"], ParentId>;
export type UseDataReturnType = {
  listItemsIds: GroupItemType["id"][];

  //  用于缓存每个 groupList 的 parent 关系
  parentIdMap: ParentIdMapType;
};

export function useData(
  data: GroupListDataType,
  expandedIds: GroupItemType["id"][],
): UseDataReturnType {
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
  };
}
