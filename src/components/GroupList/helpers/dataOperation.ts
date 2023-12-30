import { GroupItemType } from "@/components/GroupItem/type";
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
