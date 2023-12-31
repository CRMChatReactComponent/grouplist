import { FolderExpandedArrow } from "@/components/GroupItem/Indicator";
import styled from "styled-components";

//  dark 和 light 的颜色
const primaryColor = ["#e4e6eb", "#050505"];
const secondaryColor = ["#b0b3b8", "#65676B"];
const secondaryHoverBgColor = [
  "rgba(255, 255, 255, 0.1)",
  "rgba(0, 0, 0, 0.05)",
];

export const MessageSpan = styled.span`
  font-size: 12px;
  line-height: 1;
  flex: 1 1 auto;
  word-wrap: break-word;
  width: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
`;

export const SlotExtraInformationWrapper = styled.div`
  font-size: 12px;
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
  font-size: 14px;
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

export const TopRightCornerBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

export const TopRightCornerBoxVertButton = styled.div`
  opacity: 0;
  margin-left: 8px;

  button {
    outline: none;
    border: none;
    border-radius: 4px;
    padding: 1px 2px;
    background-color: transparent;
    cursor: pointer;
  }
`;

export const Wrapper = styled.section<{
  $bg: string;
  $bgHover: string;
  $isHaveMiddleInformation: boolean;
  $isDarkBg: boolean;
}>`
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    ".SFNSText-Regular",
    sans-serif;
  padding: 4px 8px;
  background-color: ${(p) => p.$bg};
  width: 100%;
  cursor: pointer;
  height: ${(p) => (p.$isHaveMiddleInformation ? 56 : 48)}px;
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

  ${TitleSpan} {
    color: ${(p) => (p.$isDarkBg ? primaryColor[0] : primaryColor[1])};
  }
  ${MessageSpan} {
    color: ${(p) => (p.$isDarkBg ? secondaryColor[0] : secondaryColor[1])};
  }
  ${SlotExtraInformationWrapper} {
    color: ${(p) => (p.$isDarkBg ? secondaryColor[0] : secondaryColor[1])};
  }
  ${TopRightCornerBoxVertButton} button {
    color: ${(p) => (p.$isDarkBg ? secondaryColor[0] : secondaryColor[1])};

    &:hover {
      background-color: ${(p) =>
        p.$isDarkBg ? secondaryHoverBgColor[0] : secondaryHoverBgColor[1]};
    }
  }
`;

export const Container = styled.div<{ $isDark: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  box-sizing: border-box;

  div,
  section {
    box-sizing: inherit;
  }

  ${FolderExpandedArrow} {
    color: ${(p) => (p.$isDark ? secondaryColor[0] : secondaryColor[1])};
  }
`;
