import { GroupItemTypeEnum } from "@/enums";

export interface GroupItemType {
  id: string;
  title: string;
  message: string;
  backgroundColor: string | undefined;
  emoji: string | undefined;
  avatar: string | undefined;
  readonly: boolean;
  type: GroupItemTypeEnum;
}
