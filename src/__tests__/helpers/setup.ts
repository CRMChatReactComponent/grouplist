// 为测试环境添加 ResizeObserver polyfill
// Ant Design 的 Popover 等组件需要 ResizeObserver API
if (typeof ResizeObserver === 'undefined') {
  global.ResizeObserver = class ResizeObserver {
    observe() {
      // 空实现
    }
    unobserve() {
      // 空实现
    }
    disconnect() {
      // 空实现
    }
  } as any;
}

