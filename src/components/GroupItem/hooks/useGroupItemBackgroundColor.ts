import { useMemo } from "react";
import { theme } from "antd";
import { GroupItemType } from "@/components/GroupItem/type";
import { useIsDark } from "@/hooks/useIsDark";
import Color from "color";

export function useGroupItemBackgroundColor(
  backgroundColor: GroupItemType["backgroundColor"],
) {
  const { token } = theme.useToken();
  const isDark = useIsDark();

  const colorInstance = useMemo(() => {
    if (!backgroundColor) {
      try {
        return Color(token.colorBgElevated);
      } catch (e) {}
    } else {
      let colorInstance: Color | null = null;
      try {
        colorInstance = Color(backgroundColor);
      } catch (e) {}
      return colorInstance;
    }
  }, [backgroundColor, isDark]);

  if (backgroundColor) {
    return {
      bg: backgroundColor,
      isDarkBgColor: colorInstance?.isDark() ?? isDark,
      hoverBg: colorInstance
        ? colorInstance.darken(0.15).hex()
        : backgroundColor,
    };
  }

  const hoverBg = isDark
    ? colorInstance?.lighten(0.45)?.hex()
    : colorInstance?.darken(0.15)?.hex();

  return {
    bg: colorInstance?.hex() ?? token.colorBgElevated,
    isDarkBgColor: isDark,
    hoverBg: hoverBg ?? token.colorBgElevated,
  };
}
