import { GroupItemType } from "@/components/GroupItem/type";
import { useData } from "@/components/GroupList/hooks/useData";
import { GroupListDataType } from "@/components/GroupList/types";

/**
 * 从 items 中递归删除 needToDeleteData
 * @param items
 * @param needToDeleteDataId
 */
export function deleteDataFromItems(
  items: GroupListDataType,
  needToDeleteDataId: GroupItemType["id"],
): GroupListDataType {
  deleteData(needToDeleteDataId);

  return deleteNonExistingGroupItem(items);

  function deleteData(id: GroupItemType["id"]) {
    const groupItem = items[id];
    if (groupItem) {
      if (groupItem.isFolder && groupItem.children) {
        for (const childId of groupItem.children) {
          deleteData(childId as string);
        }
      }

      delete items[id];
    }
  }
}

/**
 * 清理数据中不存在的 children 数据
 * 比如 一个节点删除后， root.children 中还存在这个节点
 * 这些数据需要清理下
 * @param items
 */
export function deleteNonExistingGroupItem(
  items: GroupListDataType,
): GroupListDataType {
  for (const id in items) {
    if (items[id].children) {
      items[id].children = (items[id].children ?? []).filter(
        (id) => !!items[id],
      );
    }
  }

  return items;
}

/**
 * 根据 groupItem ID 判断 depth
 * @param id
 * @param parentIdMap
 */
export function getDepthById(
  id: GroupItemType["id"],
  parentIdMap: ReturnType<typeof useData>["parentIdMap"],
): number {
  if (!parentIdMap[id]) return 0;
  if (id === "root") return 0;
  if (parentIdMap[id] === "root") return 0;

  return 1 + getDepthById(parentIdMap[id], parentIdMap);
}

/**
 * 判断一个 id 是否在某个文件夹下面（递归）
 * @param childId
 * @param parentId
 * @param parentIdMap
 */
export function isInFolder(
  childId: GroupItemType["id"],
  parentId: GroupItemType["id"],
  parentIdMap: ReturnType<typeof useData>["parentIdMap"],
): boolean {
  const childParentId = parentIdMap[childId];
  if (!childParentId) return false;
  if (childParentId === parentId) return true;

  return isInFolder(childParentId, parentId, parentIdMap);
}
