import { GroupItemType } from "@/components/GroupItem/type";

export type TreeItem<T> = {
  index: string;
  children: Array<string>;
  isFolder: boolean;
  data: T;
};

export type GroupListDataItemType = TreeItem<GroupItemType>;

export type GroupListDataType = Record<
  GroupItemType["id"],
  GroupListDataItemType
>;
