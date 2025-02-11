import {
  resetIntersectionMocking,
  setupIntersectionMocking,
} from "react-intersection-observer/test-utils";
import GroupItem from "@/components/GroupItem";
import { GroupItemTypeEnum } from "@/enums";
import { AntdApiContextProviderCmp } from "../context/AntdApiContext";
import { render, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  setupIntersectionMocking(vi.fn);
});

afterEach(() => {
  resetIntersectionMocking();
});

describe("GroupItem component", () => {
  const onDropdownCallback = vi.fn();

  const { getByTestId, getByText } = render(
    <AntdApiContextProviderCmp>
      <GroupItem
        data={{
          id: "2",
          type: GroupItemTypeEnum.GROUP,
          title: "我是标题",
          emoji: undefined,
          message: "我是消息",
          avatar: "https://avatars.githubusercontent.com/u/24644246?v=4",
          backgroundColor: undefined,
          readonly: false,
        }}
        actionDropdownMenu={{
          items: [
            {
              label: "foo",
              key: "bar",
            },
          ],
          onClick(ev) {
            onDropdownCallback(ev.key);
          },
        }}
        SlotTopRightAreaLeft={() => (
          <div data-testid={"SlotTopRightAreaLeft"}>SlotTopRightAreaLeft</div>
        )}
        SlotBottomRightArea={() => (
          <div data-testid={"SlotBottomRightArea"}>SlotBottomRightArea</div>
        )}
      />
    </AntdApiContextProviderCmp>,
  );

  it("renders correctly", () => {
    const title = getByText("我是标题");
    expect(title).toBeTruthy();
  });

  it("displays all passed props correctly", () => {
    const message = getByText("我是消息");
    expect(message).toBeTruthy();
  });

  it("SlotTopRightAreaLeft render correctly", () => {
    const slot = getByTestId("SlotTopRightAreaLeft");
    expect(slot).toBeTruthy();
  });

  it("SlotBottomRightArea render correctly", () => {
    const slot = getByTestId("SlotBottomRightArea");
    expect(slot).toBeTruthy();
  });
});
