import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ConfigProvider,
  theme,
  Space,
  Flex,
  Typography,
  Select,
  Button,
  Switch,
  SelectProps,
  Empty,
} from "antd";
import { AntdApiContextProviderCmp } from "../../src/context/AntdApiContext";
import { I18nContextCmp } from "../../src/context/I18nContext";
import { GenI18nEnum } from "../../src/i18n/genI18nEnum";
import { TranslationOutlined } from "@ant-design/icons";
import { Decorator } from "@storybook/react";
import styled from "styled-components";

const { Title } = Typography;

const StoryBox = styled.section`
  padding: 1rem;
`;

const MethodPanel = styled.section<{
  $isDark: boolean;
}>`
  width: 320px;
  flex-shrink: 0;
  border-left: 1px solid
    ${(p) => (p.$isDark ? "rgba(255,255,255,.1)" : "rgb(228, 230, 235)")};
  height: 100vh;
  padding: 12px;
  box-sizing: border-box;
  background: ${(p) => (p.$isDark ? "#222525" : "#fff")};
`;

const MethodsBox = styled.section`
  height: calc(100% - 52px);
  overflow: auto;
  overflow-x: hidden;
  padding-top: 1rem;
`;

const withCanvasDecorators: Decorator = (Story) => {
  const [methodsPanel, setMethodsPanel] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(true);

  return (
    <I18nContextCmp>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: isDarkTheme ? "#18191A" : "#efefef",
        }}
      >
        <ConfigProvider
          theme={{
            algorithm: isDarkTheme
              ? theme.darkAlgorithm
              : theme.defaultAlgorithm,
          }}
        >
          <AntdApiContextProviderCmp>
            <Flex justify={"space-between"}>
              <StoryBox>
                <Story setMethodsPanel={setMethodsPanel} />
              </StoryBox>
              <MethodPanel $isDark={isDarkTheme}>
                <Flex
                  vertical={true}
                  justify={"flex-start"}
                  style={{ height: "100%" }}
                >
                  <Title level={4} style={{ marginTop: 0, marginBottom: 0 }}>
                    Methods
                  </Title>
                  <MethodsBox>
                    {methodsPanel ? (
                      methodsPanel
                    ) : (
                      <Empty description={"没有任何方法"} />
                    )}
                  </MethodsBox>
                  <Flex justify={"space-between"}>
                    <SwitchLang />
                    <SwitchDarkMode
                      isDarkTheme={isDarkTheme}
                      setIsDarkTheme={setIsDarkTheme}
                    />
                  </Flex>
                </Flex>
              </MethodPanel>
            </Flex>
          </AntdApiContextProviderCmp>
        </ConfigProvider>
      </div>
    </I18nContextCmp>
  );
};

function SwitchDarkMode(props: {
  isDarkTheme: boolean;
  setIsDarkTheme(bool: boolean): void;
}) {
  return (
    <Switch
      value={props.isDarkTheme}
      checkedChildren="Dark"
      unCheckedChildren="Light"
      onChange={(val) => {
        props.setIsDarkTheme(val);
      }}
    />
  );
}

function SwitchLang() {
  const { i18n } = useTranslation();
  const { token } = theme.useToken();

  const options = useMemo<SelectProps["options"]>(() => {
    return Object.entries(GenI18nEnum).map((lang) => {
      return {
        value: lang[1],
        label: lang[1],
      };
    });
  }, [GenI18nEnum]);

  function handleChangeLang(lang) {
    i18n.changeLanguage(lang);
  }

  return (
    <Space size={4}>
      <TranslationOutlined style={{ color: token.colorTextSecondary }} />
      <Select
        size={"small"}
        style={{ width: 100 }}
        value={i18n.language}
        options={options}
        onChange={handleChangeLang}
      />
    </Space>
  );
}

export default withCanvasDecorators;
