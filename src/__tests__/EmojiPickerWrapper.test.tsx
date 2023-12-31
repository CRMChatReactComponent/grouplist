import {
  resetIntersectionMocking,
  setupIntersectionMocking,
  mockAllIsIntersecting,
} from "react-intersection-observer/test-utils";
import { Button } from "antd";
import EmojiPickerWrapper from "@/components/EmojiPickerWrapper";
import { render, fireEvent } from "@testing-library/react";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

beforeEach(() => {
  setupIntersectionMocking(vi.fn);
});

afterEach(() => {
  resetIntersectionMocking();
});

describe("EmojiPickerWrapper component", () => {
  const onSelectCallback = vi.fn();
  const onDeleteCallback = vi.fn();

  const { getByText } = render(
    <EmojiPickerWrapper
      allowDelete={true}
      onSelect={onSelectCallback}
      onDelete={onDeleteCallback}
    >
      <Button>选择图标</Button>
    </EmojiPickerWrapper>,
  );

  const button = getByText("选择图标");

  it("should render", () => {
    expect(button).toBeTruthy();
  });

  let emojiPickerEl = document.querySelector(
    ".EmojiPickerReact",
  ) as HTMLDivElement;

  it("should popup a emoji-selector after click", async () => {
    expect(emojiPickerEl).toBeFalsy();
    fireEvent.click(button);
    mockAllIsIntersecting(true);

    await vi.waitUntil(() => document.querySelector(".EmojiPickerReact"), {
      timeout: 4000,
    });
    expect(document.querySelector(".EmojiPickerReact")).toBeTruthy();

    emojiPickerEl = document.querySelector(
      ".EmojiPickerReact",
    ) as HTMLDivElement;
  });

  it("should able to select an emoji", async () => {
    const icon = emojiPickerEl.querySelector(
      `[data-unified="1f617"]`,
    ) as HTMLButtonElement;
    fireEvent.click(icon);

    expect(onSelectCallback).toHaveBeenCalledWith("1f617");
  });

  it("should able to delete current emoji", async () => {
    fireEvent.click(button);
    mockAllIsIntersecting(true);
    await vi.waitUntil(() => document.querySelector(".EmojiPickerReact"), {
      timeout: 4000,
    });

    const deleteIcon = document.querySelector(
      ".ant-btn-dangerous",
    ) as HTMLButtonElement;
    fireEvent.click(deleteIcon);

    expect(onDeleteCallback).toHaveBeenCalled();
  });
});
