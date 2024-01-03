import { TreeItem } from "react-complex-tree";
import { GroupItemType } from "@/components/GroupItem/type";

export type GroupListDataItemType = TreeItem<GroupItemType>;

export type GroupListDataType = Record<
  GroupItemType["id"],
  GroupListDataItemType
>;
