import { DISABLED_ITEM_INTERACTION_CLASS } from "@/components/GroupItem/const";

/**
 * 判断一个 item 是否要禁用 folder 展开操作
 */
export function isElDisableInteraction(el: HTMLDivElement) {
  if (el.closest(`.${DISABLED_ITEM_INTERACTION_CLASS}`)) return true;
  if (el.closest(`.ant-popover`)) return true;
  if (el.closest(`.ant-dropdown`)) return true;
  if (el.closest(`.ant-modal-root`)) return true;

  return false;
}
