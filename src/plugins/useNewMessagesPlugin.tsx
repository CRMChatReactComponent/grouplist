import { GroupItemType } from "@/components/GroupItem/type";
import { GroupItemTypeEnum } from "@/enums";
import { PluginType } from "@/types";
import styled from "styled-components";

const NewMessageBox = styled.div<{ $size: Props["size"] }>`
  position: absolute;
  right: 0px;
  top: -10px;
  font-size: 12px;
  background: #f20;
  color: #fff;
  padding: ${(p) => (p.$size === "small" ? "0 2px" : "2px 6px")};
  border-radius: 10px;
  line-height: 1em;
  text-align: center;
  transform: translateX(100%);
`;

const DotDiv = styled.div`
  position: absolute;
  top: -7px;
  right: -6px;
  border-radius: 50%;
  transform: translateX(100%);
  width: 6px;
  height: 6px;
  background: #f20;
`;

const Wrapper = styled.div`
  position: relative;
`;

type Props = {
  state: {
    map: Record<GroupItemType["id"], number>;
    setMap(map: Record<GroupItemType["id"], number>): void;
  };
  isCleanNewMessageOnFocus?: boolean;
  size?: "small" | "default";
  dot?: boolean;
};

export function useNewMessagesPlugin(props: Props) {
  const {
    size = "default",
    dot = false,
    state,
    isCleanNewMessageOnFocus = false,
  } = props ?? {};

  function getMessageCount(id: GroupItemType["id"]): string {
    const count = state.map[id] ?? 0;
    return count > 99 ? "99+" : String(Math.ceil(count));
  }

  return {
    plugin: {
      name: "use-new-message-plugin",
      priority: 999,
      resolveProps(props) {
        //  代理 onItemFocused 事件
        //  判断 focus 是否清空数据
        const _onItemFocused = props.onItemFocused;
        props.onItemFocused = (data) => {
          if (isCleanNewMessageOnFocus) {
            delete state.map[data.id];
            state.setMap({
              ...state.map,
            });
          }
          _onItemFocused?.(data);
        };

        const PrevSlot = props.SlotTopRightAreaRight;
        props.SlotTopRightAreaRight = function NewMessageSlot(_props) {
          if (
            _props.data.type === GroupItemTypeEnum.GROUP ||
            getMessageCount(_props.data.id) === "0"
          ) {
            return PrevSlot ? <PrevSlot {..._props} /> : null;
          }

          return (
            <Wrapper>
              {dot ? (
                <DotDiv />
              ) : getMessageCount(_props.data.id) !== "0" ? (
                <NewMessageBox $size={size}>
                  <bdi>{getMessageCount(_props.data.id)}</bdi>
                </NewMessageBox>
              ) : (
                <></>
              )}
              {PrevSlot && <PrevSlot {..._props} />}
            </Wrapper>
          );
        };
        return props;
      },
    } as PluginType,
  };
}
