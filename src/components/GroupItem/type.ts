import { ReactElement } from "react";
import { GroupItemPropsType } from "@/components/GroupItem/index";
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

export type DefaultSlotType = (
  props: Required<
    Pick<GroupItemPropsType, "isFocused" | "isExpanded" | "isSelected">
  > & {
    data: GroupItemType;
  },
) => ReactElement | null;
