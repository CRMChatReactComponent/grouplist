import styled from "styled-components";

export const Wrapper = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const GroupListWrapper = styled.div<{ $isDark: boolean }>`
  padding-right: 8px;
  padding-left: 12px;
  height: 100%;
  overflow: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: ${(p) => (p.$isDark ? "#555" : "#ccc")};
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${(p) => (p.$isDark ? "#888" : "#999")};
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export const HeaderWrapper = styled.div`
  margin-bottom: 8px;
  padding-left: 12px;
`;

export const FooterWrapper = styled.div`
  margin-top: 8px;
  padding-left: 12px;
`;

export const ItemWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;
