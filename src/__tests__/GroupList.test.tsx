import {
  resetIntersectionMocking,
  setupIntersectionMocking,
} from "react-intersection-observer/test-utils";
import { GroupListTest } from "@/__tests__/components/GroupListTest";
import { fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  setupIntersectionMocking(vi.fn);
});

afterEach(() => {
  resetIntersectionMocking();
});

describe("GroupList component", () => {
  const onDropdownCallback = vi.fn();
  // const GroupListRef = createRef<ElementRef<typeof GroupList>>();

  const { getByTestId, getByText, queryByText, queryByTestId } = render(
    <GroupListTest onDropdownClick={onDropdownCallback} />,
  );

  it("renders correctly", async () => {
    await vi.waitUntil(() => !!queryByText("用户1"), {
      timeout: 4000,
    });

    const user1 = getByText("用户1");
    expect(user1).toBeTruthy();
  });

  it("displays all passed props correctly", () => {
    const folder1 = queryByText("folder-1");
    expect(folder1).toBeTruthy();
  });

  it("folder expand correctly", async () => {
    const folder1 = getByText("folder-1");
    fireEvent.click(folder1);

    await vi.waitUntil(() => !!queryByText("user-2"), {
      timeout: 4000,
    });

    expect(queryByText("user-2")).toBeDefined();
  });

  it("folder collapse correctly", async () => {
    const folder1 = getByText("folder-1");
    fireEvent.click(folder1);

    await vi.waitUntil(() => !queryByText("user-2"), {
      timeout: 4000,
    });

    expect(queryByText("user-2")).toBeNull();
  });

  it("SlotHeader render correctly", () => {
    const slot = getByTestId("SlotHeader");
    expect(slot).toBeTruthy();
  });

  it("SlotFooter render correctly", () => {
    const slot = getByTestId("SlotFooter");
    expect(slot).toBeTruthy();
  });

  it("SlotExtraInformation render correctly", () => {
    const slot = getByTestId("SlotExtraInformation-user-1");
    expect(slot).toBeTruthy();
  });

  it("useNewMessagesPlugin works correctly", () => {
    const updateBtn = getByTestId("updateMessage");
    fireEvent.click(updateBtn);

    vi.waitUntil(() => !!queryByText("98"), {
      timeout: 4000,
    });

    expect(queryByText("98")).toBeDefined();

    const deleteBtn = getByTestId("deleteMessage");
    fireEvent.click(deleteBtn);

    vi.waitUntil(() => !queryByText("98"));
    expect(queryByText("98")).toBeNull();
  });

  it("useSelectsPlugin works correctly", async () => {
    const checkBtn = document.querySelector(
      ".ant-checkbox-input",
    ) as HTMLInputElement;
    expect(checkBtn).toBeDefined();
    fireEvent.click(checkBtn);
    expect(checkBtn.checked).toBeTruthy();

    // 函数用于检查所有checkbox的状态
    const areAllCheckboxesChecked = (checked: boolean) =>
      Array.from(
        document.querySelectorAll(
          ".ant-checkbox-input",
        ) as NodeListOf<HTMLInputElement>,
      ).every((input) => input.checked === checked);

    // 检查全选是否正常
    const selectAll = getByTestId("selectAll");
    fireEvent.click(selectAll);
    await expect(areAllCheckboxesChecked(true)).toBeTruthy();

    // 检查取消全选是否正常
    const unSelectAll = getByTestId("unSelectAll");
    fireEvent.click(unSelectAll);
    await expect(areAllCheckboxesChecked(false)).toBeTruthy();
  });
});
