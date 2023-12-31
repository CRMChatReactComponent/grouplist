import { theme } from "antd";
import { GroupItemDataType } from "@/components/GroupItem/type";
import Color from "color";

export function useGroupItemBackgroundColor(
  backgroundColor: GroupItemDataType["backgroundColor"],
) {
  const { token } = theme.useToken();

  if (backgroundColor) {
    let colorInstance: Color | null = null;
    try {
      colorInstance = Color(backgroundColor);
    } catch (e) {}

    return {
      bg: backgroundColor,
      hoverBg: colorInstance
        ? colorInstance.darken(0.25).hex()
        : backgroundColor,
    };
  }

  return {
    bg: token.colorBgElevated,
    hoverBg: token.colorBgTextHover,
  };
}
