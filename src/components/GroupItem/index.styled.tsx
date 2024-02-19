import { FolderExpandedArrow } from "@/components/GroupItem/Indicator";
import { GroupItemHeight } from "@/components/GroupItem/const";
import styled from "styled-components";

//  dark 和 light 的颜色
const primaryColor = ["#e4e6eb", "#050505"];
const secondaryColor = ["#e8e9ea", "#35373b"];
const secondaryHoverBgColor = [
  "rgba(255, 255, 255, 0.1)",
  "rgba(0, 0, 0, 0.05)",
];

export const SlotBottomRightAreaContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const MessageSpan = styled.span`
  font-size: 13px;
  line-height: 1;
  flex: 1 1 auto;
  word-wrap: break-word;
  width: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 12px;
  opacity: 0.6;
  user-select: none;
`;

export const SlotExtraInformationWrapper = styled.div`
  line-height: 1em;
  font-size: 12px;

  span,
  div,
  p {
    line-height: 1em;
  }
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
  font-size: 15px;
`;

export const CenterTopBox = styled.div<{ $marginTop: number }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: ${(p) => p.$marginTop}px;
`;

export const CenterBox = styled.div<{ $space: number; $gap: number }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${(p) => p.$gap}px;
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
  $isOnDropOver: boolean;
}>`
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    ".SFNSText-Regular",
    sans-serif;
  padding: 4px 8px;
  width: calc(100% - 14px);
  cursor: pointer;
  height: ${GroupItemHeight}px;
  line-height: 1em;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-radius: 4px;
  background-color: ${(p) => (p.$isOnDropOver ? p.$bgHover : p.$bg)};
  &:hover {
    background: ${(p) => p.$bgHover};
  }

  .hover-shows {
    opacity: 0;
  }
  &:hover {
    ${TopRightCornerBoxVertButton}, .hover-shows {
      opacity: 1;
    }
  }

  ${TitleSpan} {
    color: ${(p) => (p.$isDarkBg ? primaryColor[0] : primaryColor[1])};
  }
  ${MessageSpan},
  ${TopRightCornerBox},
  ${SlotBottomRightAreaContainer},
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

export const AvatarWrapper = styled.div`
  margin-right: 18px;
  position: relative;
`;
