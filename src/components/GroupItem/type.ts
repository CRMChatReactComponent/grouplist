import { GroupItemTypeEnum } from "@/enums";

interface BaseGroupItem {
  title: string;
  message: string;
  backgroundColor: string | undefined;
  emoji: string | undefined;
  avatar: string | undefined;
  readonly: boolean;
  order: number;
}

interface UserGroupItem extends BaseGroupItem {
  type: GroupItemTypeEnum.USER;
}

interface NestedGroupItem extends BaseGroupItem {
  type: GroupItemTypeEnum.FOLDER;
  expanded: boolean;
  children: GroupItemDataType[];
}

export type GroupItemDataType = NestedGroupItem | UserGroupItem;
