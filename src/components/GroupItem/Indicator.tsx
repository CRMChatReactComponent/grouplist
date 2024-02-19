import { FC } from "react";
import { GroupItemHeight } from "@/components/GroupItem/const";
import { GroupItemPropsType } from "@/components/GroupItem/index";
import { GroupItemTypeEnum } from "@/enums";
import styled from "styled-components";

type Props = {
  type: GroupItemTypeEnum;
} & Required<
  Pick<GroupItemPropsType, "isExpanded" | "isFocused" | "isSelected">
>;

export const FolderExpandedArrow = styled.span<{ $isExpanded: boolean }>`
  margin-left: 8px;
  position: relative;
  display: block;
  width: 12px;
  left: -5px;
  top: 30px;
  opacity: 0.65;
  cursor: pointer;
  transform: translateY(${({ $isExpanded }) => ($isExpanded ? -5 : 0)}px);
  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 6px;
    height: 2px;
    background-color: currentColor;
    border-radius: 6px;
    transform: rotate(${({ $isExpanded }) => ($isExpanded ? -45 : 45)}deg)
      translateX(-3px);
  }
  &::after {
    transform: rotate(${({ $isExpanded }) => ($isExpanded ? 45 : -45)}deg)
      translateX(3px);
  }
`;

const IndicatorWrapper = styled.div`
  width: 14px;
  height: ${GroupItemHeight}px;
  flex-shrink: 0;
  position: relative;

  .ant-badge {
    transform: translateY(12px);
  }
`;

const SelectedDiv = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #1877ff;
`;

const FocusedDiv = styled.div`
  position: absolute;
  right: 2px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #1877ff;
`;

const Indicator: FC<Props> = ({ isExpanded, isFocused, isSelected, type }) => {
  return (
    <IndicatorWrapper>
      {type === GroupItemTypeEnum.GROUP ? (
        <FolderExpandedArrow $isExpanded={isExpanded} />
      ) : isFocused ? (
        <FocusedDiv />
      ) : null}

      {isSelected && <SelectedDiv />}
    </IndicatorWrapper>
  );
};

export default Indicator;
