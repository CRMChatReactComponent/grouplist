import styled from "styled-components";

export const MessageSpan = styled.span`
  font-size: 12px;
  line-height: 1;
  flex: 1 1 auto;
  word-wrap: break-word;
  width: 1px;
`;

export const CenterBottomBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const TitleSpan = styled.span`
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: auto;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CenterTopBox = styled.div<{ $marginTop: number }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: ${(p) => p.$marginTop}px;
`;

export const CenterBox = styled.div<{ $space: number }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: calc(100% - ${(p) => p.$space}px);
`;

export const TopRightCornerBoxVertButton = styled.div`
  opacity: 0;
  margin-left: 8px;
`;

export const FolderExpandedArrow = styled.span<{ $isExpanded: boolean }>`
  margin-left: 8px;
  position: relative;
  display: block;
  width: 12px;
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

export const Wrapper = styled.section<{
  $bg: string;
  $bgHover: string;
  $isHaveMiddleInformation: boolean;
  $isDark: boolean;
}>`
  padding: 4px 8px;
  background-color: ${(p) => p.$bg};
  width: 100%;
  cursor: pointer;
  height: ${(p) => (p.$isHaveMiddleInformation ? 60 : 42)}px;
  line-height: 1em;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  &:hover {
    background: ${(p) => p.$bgHover};
  }

  &:hover ${TopRightCornerBoxVertButton} {
    opacity: 1;
  }
`;
