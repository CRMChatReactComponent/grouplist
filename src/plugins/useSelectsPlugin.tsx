import { Checkbox } from "antd";
import { pull, uniq, difference } from "lodash-es";
import { GroupItemType } from "@/components/GroupItem/type";
import { PluginType } from "@/types";
import styled from "styled-components";

type Props = {
  uniqueId: string;
  state: {
    ids: GroupItemType["id"][];
    setIds(ids: GroupItemType["id"][]): void;
  };
  //  选中 folder 时是否要自动选中所有子节点
  isAutoSelectChildren?: boolean;
  color?: string;
  //  处理 checkbox 样式
  getCheckboxProps?: (data: GroupItemType) => {
    disabled?: boolean;
    hidden?: boolean;
  };
  //  当选中时，进行判断是否可以选中
  allowToCheck?: (data: GroupItemType) => boolean;
} & Pick<PluginType, "priority">;

const CheckboxColorWrapper = styled.div<{ $color: string }>`
  margin-left: 4px;

  .ant-checkbox-checked,
  .ant-checkbox-checked:not(.ant-checkbox-disabled):hover {
    .ant-checkbox-inner {
      border-color: ${(p) => p.$color} !important;
      background-color: ${(p) => p.$color} !important;
    }
  }

  .ant-checkbox:not(.ant-checkbox-disabled):hover .ant-checkbox-inner {
    border-color: ${(p) => p.$color} !important;
  }

  .ant-checkbox-indeterminate .ant-checkbox-inner:after {
    background-color: ${(p) => p.$color} !important;
  }
`;

export function useSelectsPlugin(props: Props) {
  const {
    uniqueId,
    state,
    priority = 999,
    color = "#1677ff",
    isAutoSelectChildren = true,
    getCheckboxProps = () => ({ disabled: false, hidden: false }),
    allowToCheck = () => true,
  } = props;

  return {
    plugin: {
      name: `use-selects-plugin-${uniqueId}`,
      priority,

      resolveProps(props) {
        const PrevSlot = props.SlotBottomRightArea;

        props.SlotBottomRightArea = function SelectsPluginSlot(_props) {
          const { hidden = false, disabled = false } = getCheckboxProps(
            _props.data,
          );

          function handleSelectId(id: GroupItemType["id"]) {
            const needAddIds: GroupItemType["id"][] = [id];
            if (isAutoSelectChildren) {
              const ids = getChildrenIdsById(id);
              ids.push(id);
              needAddIds.push(...ids);
            }

            state.ids.push(...needAddIds);
            state.setIds([...uniq(state.ids)]);
          }

          function handleUnSelect(id: GroupItemType["id"]) {
            const ids = [id];
            if (isAutoSelectChildren) {
              ids.push(...getChildrenIdsById(id));
            }
            state.setIds([...pull(state.ids, ...ids)]);
          }

          /**
           * 获取一个 id 下面的所有 children id
           * @param id
           * @param idsArr
           */
          function getChildrenIdsById(
            id: GroupItemType["id"],
            idsArr: GroupItemType["id"][] = [],
          ) {
            if (props.data[id] && props.data[id].isFolder) {
              const children = props.data[id].children;
              if (children) {
                for (const id of children) {
                  idsArr.push(id as GroupItemType["id"]);
                  idsArr.push(...getChildrenIdsById(id as GroupItemType["id"]));
                }
              }
            }

            return idsArr;
          }

          return (
            <>
              {PrevSlot && <PrevSlot {..._props} />}
              {!hidden && (
                <CheckboxColorWrapper $color={color}>
                  <Checkbox
                    disabled={disabled}
                    checked={state.ids.includes(_props.data.id)}
                    onChange={(ev) => {
                      const isChecked = ev.target.checked;
                      if (isChecked && !allowToCheck(_props.data)) return;
                      isChecked
                        ? handleSelectId(_props.data.id)
                        : handleUnSelect(_props.data.id);
                    }}
                  />
                </CheckboxColorWrapper>
              )}
            </>
          );
        };

        return props;
      },
    } as PluginType,
  };
}
