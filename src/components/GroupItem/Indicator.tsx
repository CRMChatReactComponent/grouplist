import { FC } from "react";
import { Badge } from "antd";
import { GroupItemPropsType } from "@/components/GroupItem/index";
import { GroupItemTypeEnum } from "@/enums";
import styled from "styled-components";

type Props = {
  type: GroupItemTypeEnum;
} & Required<Pick<GroupItemPropsType, "isExpanded" | "isFocused">>;

export const FolderExpandedArrow = styled.span<{ $isExpanded: boolean }>`
  margin-left: 8px;
  position: relative;
  display: block;
  width: 12px;
  left: -10px;
  top: 22px;
  opacity: 0.65;
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
  height: 42px;
  flex-shrink: 0;

  .ant-badge {
    transform: translateY(12px);
  }
`;

const Indicator: FC<Props> = ({ isExpanded, isFocused, type }) => {
  return (
    <IndicatorWrapper>
      {type === GroupItemTypeEnum.GROUP ? (
        <FolderExpandedArrow $isExpanded={isExpanded} />
      ) : isFocused ? (
        <Badge status={"processing"} />
      ) : null}
    </IndicatorWrapper>
  );
};

export default Indicator;
