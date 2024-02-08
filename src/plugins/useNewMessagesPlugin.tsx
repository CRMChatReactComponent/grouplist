import { GroupItemType } from "@/components/GroupItem/type";
import { GroupItemTypeEnum } from "@/enums";
import { PluginType } from "@/types";
import styled from "styled-components";

const NewMessageBox = styled.div<{ $size: Props["size"] }>`
  position: absolute;
  right: 16px;
  top: -6px;
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
  top: 0;
  right: 0;
  border-radius: 50%;
  width: 6px;
  height: 6px;
  background: #f20;
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
    return getCountStr(count);
  }

  function getCountStr(count: number) {
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

        const PrevSlot = props.SlotAvatarExtra;
        props.SlotAvatarExtra = function NewMessageSlot(_props) {
          let countStr = getMessageCount(_props.data.id);

          //  如果是小组的话，需要统计所有子节点的 count
          //  只统计一级
          if (_props.data.type === GroupItemTypeEnum.GROUP) {
            const children = props.data[_props.data.id].children ?? [];
            const totalCount = children.reduce<number>((prev, current) => {
              prev += state.map[current] ?? 0;
              return prev;
            }, 0);
            countStr = getCountStr(totalCount);
          }

          if (countStr === "0") {
            return PrevSlot ? <PrevSlot {..._props} /> : null;
          }

          return (
            <>
              {dot ? (
                <DotDiv />
              ) : countStr !== "0" ? (
                <NewMessageBox $size={size}>
                  <bdi>{countStr}</bdi>
                </NewMessageBox>
              ) : (
                <></>
              )}
              {PrevSlot && <PrevSlot {..._props} />}
            </>
          );
        };
        return props;
      },
    } as PluginType,
  };
}
