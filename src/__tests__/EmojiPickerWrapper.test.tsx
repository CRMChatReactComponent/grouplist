import {
  resetIntersectionMocking,
  setupIntersectionMocking,
  mockAllIsIntersecting,
} from "react-intersection-observer/test-utils";
import { Button } from "antd";
import EmojiPickerWrapper from "@/components/EmojiPickerWrapper";
import { render, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

beforeEach(() => {
  setupIntersectionMocking(vi.fn);
});

afterEach(() => {
  resetIntersectionMocking();
  cleanup();
});

describe("EmojiPickerWrapper component", () => {
  it("should render", () => {
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
    expect(button).toBeTruthy();
  });

  it("should popup a emoji-selector after click", async () => {
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
    const emojiPickerElBefore = document.querySelector(
      ".EmojiPickerReact",
    ) as HTMLDivElement;
    expect(emojiPickerElBefore).toBeFalsy();

    fireEvent.click(button);
    mockAllIsIntersecting(true);

    await vi.waitUntil(() => document.querySelector(".EmojiPickerReact"), {
      timeout: 4000,
    });
    expect(document.querySelector(".EmojiPickerReact")).toBeTruthy();
  });

  it("should able to select an emoji", async () => {
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
    fireEvent.click(button);
    mockAllIsIntersecting(true);

    await vi.waitUntil(() => document.querySelector(".EmojiPickerReact"), {
      timeout: 4000,
    });

    // 等待 emoji 按钮渲染完成
    const emojiPickerEl = document.querySelector(
      ".EmojiPickerReact",
    ) as HTMLDivElement;
    
    const icon = await waitFor(
      () => {
        const foundIcon = emojiPickerEl?.querySelector(
          `[data-unified="1f617"]`,
        ) as HTMLButtonElement;
        if (!foundIcon) {
          throw new Error("Emoji button not found");
        }
        return foundIcon;
      },
      { timeout: 4000 },
    );

    fireEvent.click(icon);

    expect(onSelectCallback).toHaveBeenCalledWith("1f617");
  });

  it("should able to delete current emoji", async () => {
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
