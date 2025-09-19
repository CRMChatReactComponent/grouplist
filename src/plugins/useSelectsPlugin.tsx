import { useEffect, useRef } from "react";
import { Checkbox } from "antd";
import { pull, uniq, difference } from "lodash-es";
import { GroupItemType } from "@/components/GroupItem/type";
import { PluginType } from "@/types";
import styled from "styled-components";

type Props = {
  /**
   * 由于可能会存在多个 selects，所以需要为每个插件指定一个唯一 ID
   */
  uniqueId: string;
  /**
   * 状态参数
   */
  state: {
    /**
     * 当前选中的 ids
     */
    ids: GroupItemType["id"][];
    /**
     * 选中 ids 更新时回调
     * @param ids
     */
    setIds(ids: GroupItemType["id"][]): void;
  };
  /**
   * 选中 folder 时是否要自动选中所有子节点
   */
  isAutoSelectChildren?: boolean;
  /**
   * 选择框颜色
   */
  color?: string;
  /**
   * 选择框 props 回调
   * 每次渲染 checkbox 时都会执行这个，你可以通过这个参数来控制
   * 节点上的 checkbox 的 disabled 或者 hidden
   * @param data
   */
  getCheckboxProps?: (data: GroupItemType) => {
    disabled?: boolean;
    hidden?: boolean;
  };
  /**
   * 当选中时，进行判断是否可以选中
   * 如果返回 false 将不会被选中
   * @param data
   */
  allowToCheck?: (data: GroupItemType) => boolean;
} & Pick<PluginType, "priority">;

const DRAG_TO_SELECT_GLOBAL_KEY = "jklvhzhqekws";
const DRAG_TO_SELECT_ACTION_GLOBAL_KEY = "jklvh2zhqekws";

const CheckboxColorWrapper = styled.div<{ $color: string }>`
  margin-left: 12px;

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

  .ant-checkbox-inner{
    transform: scale(1.4);
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

          const warpperRef = useRef<HTMLDivElement>(null);

          useEffect(() => {
            // 递归查找包含 data-id 属性的父元素
            let parent = getGroupItemParent();

            if (parent) {
              parent.addEventListener("mouseover", handleMouseOver);
            }

            return () => {
              let parent = getGroupItemParent();
              if (parent) {
                parent.removeEventListener("mouseover", handleMouseOver);
              }
            };
          }, []);

          function getGroupItemParent() {
            if (!warpperRef.current) return null;
            let parent = warpperRef.current.parentElement;
            while (parent) {
              if (parent.hasAttribute("data-id")) {
                break;
              }
              parent = parent.parentElement;
              if (parent === null) {
                break;
              }
            }
            return parent;
          }

          function handleMouseOver(ev: MouseEvent) {
            // 获取事件目标元素的位置和尺寸信息
            const rect = (ev.target as HTMLElement).getBoundingClientRect();
            const mouseY = ev.clientY;

            // 计算元素的垂直中心区域范围(上下各留8px边缘)
            const centerTop = rect.top + 8;
            const centerBottom = rect.bottom - 8;

            // 如果鼠标不在中心区域内,直接返回不触发
            if (mouseY < centerTop || mouseY > centerBottom) {
              return;
            }
            if (window[DRAG_TO_SELECT_GLOBAL_KEY]) {
              if (!allowToCheck(_props.data)) return;
              if (window[DRAG_TO_SELECT_ACTION_GLOBAL_KEY] === "select") {
                handleSelectId(_props.data.id);
              } else {
                handleUnSelect(_props.data.id);
              }
            }
          }

          function handleCheckboxMouseDown(ev: React.MouseEvent) {
            document.addEventListener("mouseup", handleGlobalMouseUp);

            // 防止拖拽选择时选中文字
            document.body.style.userSelect = "none";

            window[DRAG_TO_SELECT_GLOBAL_KEY] = true;
            window[DRAG_TO_SELECT_ACTION_GLOBAL_KEY] = state.ids.includes(
              _props.data.id,
            )
              ? "unselect"
              : "select";

            if (!allowToCheck(_props.data)) return;
            if (window[DRAG_TO_SELECT_ACTION_GLOBAL_KEY] === "select") {
              handleSelectId(_props.data.id);
            } else {
              handleUnSelect(_props.data.id);
            }
          }

          function handleGlobalMouseUp() {
            document.body.style.userSelect = "";
            window[DRAG_TO_SELECT_GLOBAL_KEY] = false;

            document.removeEventListener("mouseup", handleGlobalMouseUp);
          }

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
                <CheckboxColorWrapper
                  $color={color}
                  ref={warpperRef}
                  onMouseDown={handleCheckboxMouseDown}
                >
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
