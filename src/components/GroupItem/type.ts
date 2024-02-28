import { ReactElement } from "react";
import { GroupItemPropsType } from "@/components/GroupItem/index";
import { GroupItemTypeEnum } from "@/enums";

export interface GroupItemType {
  id: string;
  /**
   * 标题
   */
  title: string;
  /**
   * 标题下方的消息内容
   */
  message: string;
  /**
   * 背景颜色
   */
  backgroundColor: string | undefined;
  /**
   * emoji，只有在 type 为 folder 时才使用
   */
  emoji: string | undefined;
  /**
   * 头像地址 uri
   */
  avatar: string | undefined;
  /**
   * 是否处于只读状态
   * 只读状态下无法删除和切换 emoji，backgroundColor
   */
  readonly: boolean;
  /**
   * 类型，USER or FOLDER
   */
  type: GroupItemTypeEnum;

  [key: string]: any;
}

export type DefaultSlotType = (
  props: Required<
    Pick<GroupItemPropsType, "isFocused" | "isExpanded" | "isSelected">
  > & {
    data: GroupItemType;
  },
) => ReactElement | null;
