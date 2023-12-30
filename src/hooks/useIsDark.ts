import { useContext, useMemo } from "react";
import { ConfigProvider, theme } from "antd";

export function useIsDark() {
  const { theme: currentTheme } = useContext(ConfigProvider.ConfigContext);
  const isDark = useMemo(() => {
    return currentTheme?.algorithm === theme.darkAlgorithm;
  }, [currentTheme]);

  return isDark;
}
