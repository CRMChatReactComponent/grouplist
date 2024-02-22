import { GroupItemType } from "@/components/GroupItem/type";

export type TreeItem<T> = {
  /**
   * id
   */
  index: string;
  /**
   * 子节点的 ids 数组
   * 只有在 isFolder 为 true 时才生效
   */
  children: Array<string>;
  /**
   * 是否是文件夹
   */
  isFolder: boolean;
  /**
   * 数据载体
   */
  data: T;
};

export type GroupListDataItemType = TreeItem<GroupItemType>;

export type GroupListDataType = Record<
  GroupItemType["id"],
  GroupListDataItemType
>;
