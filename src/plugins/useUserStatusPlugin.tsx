import { GroupItemType } from "@/components/GroupItem/type";
import { GroupItemTypeEnum } from "@/enums";
import { PluginType } from "@/types";
import styled from "styled-components";

export enum UserOnlineStatusEnum {
  INVISIBLE,
  ACTIVE,
  AWAY,
  DO_NOT_DISTURB,
}

const statusColorMap: Record<UserOnlineStatusEnum, string> = {
  [UserOnlineStatusEnum.INVISIBLE]: "#888d91",
  [UserOnlineStatusEnum.ACTIVE]: "#77d673",
  [UserOnlineStatusEnum.AWAY]: "#f5bd4e",
  [UserOnlineStatusEnum.DO_NOT_DISTURB]: "#e15241",
};

const StatusDot = styled.div<{ $color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${(p) => p.$color};
  position: absolute;
  right: 0;
  bottom: 0;
`;

type Props = {
  state: {
    map: Record<GroupItemType["id"], UserOnlineStatusEnum | undefined>;
    setMap(
      map: Record<GroupItemType["id"], UserOnlineStatusEnum | undefined>,
    ): void;
  };
};

export function useUserStatusPlugin(props: Props) {
  const { state } = props;

  return {
    plugin: {
      name: "use-user-status-plugin",
      priority: 999,
      resolveProps(props) {
        const PrevSlot = props.SlotAvatarExtra;
        props.SlotAvatarExtra = function NewMessageSlot(_props) {
          const status = state.map[_props.data.id];
          if (
            _props.data.type === GroupItemTypeEnum.GROUP ||
            status === undefined
          ) {
            return PrevSlot ? <PrevSlot {..._props} /> : null;
          }

          return (
            <>
              <StatusDot $color={statusColorMap[status]} />
              {PrevSlot && <PrevSlot {..._props} />}
            </>
          );
        };
        return props;
      },
    } as PluginType,
  };
}
