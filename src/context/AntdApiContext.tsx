//  https://github.com/ant-design/ant-design/issues/21119#issuecomment-1660182144
//  处理 antd 调用 message 和 modal.confirm 这类 API 时，
//  无法收到 ConfigProvider 的影响，导致已经设置了暗色主题或者没有动画，依然会显示动画的问题
import { createContext, ReactNode } from "react";
import { message, Modal } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import type { HookAPI } from "antd/es/modal/useModal";

export type AntdApiContextType = {
  messageApi: MessageInstance;
  modalApi: HookAPI;
};

export const AntdApiContext = createContext<AntdApiContextType | null>(null);

export function AntdApiContextProviderCmp(props: { children: ReactNode }) {
  const [messageApi, messageContext] = message.useMessage();
  const [modalApi, modalContext] = Modal.useModal();

  return (
    <AntdApiContext.Provider
      value={{
        messageApi,
        modalApi,
      }}
    >
      {messageContext}
      {modalContext}
      {props.children}
    </AntdApiContext.Provider>
  );
}
