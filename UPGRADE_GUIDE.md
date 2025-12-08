# 依赖升级知识库 - Storybook 10 + React 19 迁移指南

## 📋 升级概览

本文档记录了将项目从旧版本升级到以下版本时遇到的所有问题和解决方案：

- **Storybook**: 8.6.14 → 10.1.4
- **React**: 18.x → 19.2.1
- **react-window**: 1.x → 2.2.3
- **react-beautiful-dnd**: 13.1.1 (兼容性修复)

---

## 🔧 问题 1: Storybook 版本不匹配错误

### 错误信息
```
No matching export in "global-externals:storybook/internal/components" for import "Icons"
SB_CORE-SERVER_0004 (NoMatchingExportError)
```

### 原因
Storybook 10 要求所有相关包版本一致，但项目中存在混合版本：
- `storybook`: 10.1.4
- 部分 addon: 8.6.14

### 解决方案

#### 1. 移除已合并到核心的包
从 Storybook 9 开始，以下包已合并到核心，无需单独安装：
- `@storybook/addon-essentials`
- `@storybook/addon-interactions`
- `@storybook/addon-links`
- `@storybook/blocks`
- `@storybook/manager-api`
- `@storybook/test`
- `@storybook/theming`
- `@storybook/types`

**package.json 修改：**
```json
{
  "devDependencies": {
    // ❌ 移除这些包
    // "@storybook/addon-essentials": "^8.6.14",
    // "@storybook/addon-interactions": "^8.6.14",
    // "@storybook/addon-links": "^8.6.14",
    // "@storybook/blocks": "^8.6.14",
    
    // ✅ 保留核心包
    "@storybook/addon-docs": "^10.1.4",
    "@storybook/react": "^10.1.4",
    "@storybook/react-vite": "^10.1.4",
    "storybook": "^10.1.4"
  }
}
```

#### 2. 更新配置文件中的 addon 声明

**`.storybook/main.ts` 修改：**
```typescript
const config: StorybookConfig = {
  addons: [
    // ✅ Storybook 10 需要显式添加 addon-docs 才能使用 Markdown 等组件
    "@storybook/addon-docs",
    
    // ❌ 这些已内置，可以移除或注释
    // "@storybook/addon-links",
    // "@storybook/addon-essentials",
    // "@storybook/addon-interactions",
  ],
};
```

---

## 🔧 问题 2: Storybook 10 导入路径变更

### 错误信息
```
Could not resolve "@storybook/manager-api"
Could not resolve "@storybook/theming"
```

### 原因
Storybook 10 采用 ESM-only 包分发，导入路径从 `@storybook/xxx` 改为 `storybook/xxx`

### 解决方案

#### 更新所有导入路径

**`.storybook/manager.ts` 修改：**
```typescript
// ❌ 旧的导入方式
import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming";

// ✅ 新的导入方式
import { addons } from "storybook/manager-api";
import { create } from "storybook/theming/create";
```

**`.storybook/preview.ts` 修改：**
```typescript
// ❌ 旧的导入方式
import { themes } from "@storybook/theming";

// ✅ 新的导入方式
import { themes } from "storybook/theming";
```

**MDX 文件修改（如 `Docs.mdx`）：**
```typescript
// ❌ 旧的导入方式
import { Canvas, Meta, Markdown } from "@storybook/blocks";

// ✅ 新的导入方式
import { Canvas, Meta, Markdown } from "@storybook/addon-docs/blocks";
```

---

## 🔧 问题 3: Storybook 10 Actions API 变更

### 错误信息
```
SB_PREVIEW_API_0002 (ImplicitActionsDuringRendering): 
We detected that you use an implicit action arg while rendering of your story.
```

### 原因
Storybook 10 不再支持隐式 action，必须使用 `(fn)()` 显式创建 spy

### 解决方案

#### 在所有 stories 文件中使用 `fn()`

**示例修改：**
```typescript
// ✅ 导入 fn
import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "YourComponent",
  component: YourComponent,
  
  // ❌ 旧方式：使用 argTypes.action
  // argTypes: {
  //   onSelect: { action: {} },
  // },
  
  // ✅ 新方式：在 args 中使用 fn()
  args: {
    onSelect: fn(),
    onDelete: fn(),
    onChange: fn(),
    // ... 所有回调函数都需要用 fn() 包装
  },
} satisfies Meta<typeof YourComponent>;
```

#### 常见需要修复的回调函数

在以下文件类型中查找并修复：
- `onDataChange`
- `onDelete` / `onDeleted`
- `onItemFocused`
- `onSelect`
- `onChange`
- `onOpenChange`
- `onSearch`
- `onEmojiChange`
- 所有 `on*` 开头的回调函数

---

## 🔧 问题 4: react-window 2.x API 重大变更

### 错误信息
```
Type 'NamedExoticComponent<...>' is not assignable to type '(props: ...) => ReactElement'
```

### 原因
react-window 2.x 完全重写了 API：
- 移除了 `FixedSizeList`, `VariableSizeList` 等命名导出
- 改用统一的 `List` 和 `Grid` 组件
- 改变了渲染方式：从 `children` 函数改为 `rowComponent` + `rowProps`

### 解决方案

#### 1. 更新导入

```typescript
// ❌ 旧的导入方式
import {
  FixedSizeList as List,
  areEqual,
  ListChildComponentProps,
} from "react-window";

// ✅ 新的导入方式
import {
  List,
  type RowComponentProps,
} from "react-window";
```

#### 2. 更新组件 API

**旧的渲染方式：**
```typescript
// ❌ 旧版本使用 children 函数
<List
  height={height}
  width={width}
  itemCount={items.length}
  itemSize={50}
  itemData={{ items, otherData }}
>
  {({ index, style, data }) => (
    <div style={style}>{data.items[index]}</div>
  )}
</List>
```

**新的渲染方式：**
```typescript
// ✅ 新版本使用 rowComponent + rowProps
// 1. 定义 Row 组件
function RowComponent({ 
  index, 
  style, 
  items,  // 从 rowProps 解构
  otherData 
}: RowComponentProps<{
  items: string[];
  otherData: any;
}>) {
  return (
    <div style={style}>{items[index]}</div>
  );
}

// 2. 使用 List 组件
<List
  rowComponent={RowComponent}
  rowCount={items.length}
  rowHeight={50}
  rowProps={{ items, otherData }}  // 传递给 rowComponent
  style={{ height, width }}  // 使用实际像素值
/>
```

#### 3. 重要 API 变更对照表

| 旧 API | 新 API | 说明 |
|--------|--------|------|
| `itemCount` | `rowCount` | 行数 |
| `itemSize` | `rowHeight` | 行高 |
| `itemData` | `rowProps` | 传递给行组件的数据 |
| `children` | `rowComponent` | 行渲染组件 |
| `outerRef` | （移除） | 不再需要 |
| `width`, `height` | `style={{ width, height }}` | 通过 style 传递 |
| `layout` | （移除） | 不再需要 |
| `ListChildComponentProps` | `RowComponentProps` | 类型名称 |

#### 4. 移除 memo 和 areEqual

```typescript
// ❌ 旧版本使用 memo 和 areEqual
const RowRenderer = memo<ListChildComponentProps<Props>>(
  ({ index, style, data }) => { ... },
  areEqual
);

// ✅ 新版本直接定义函数
function RowRenderer({ index, style, ...props }: RowComponentProps<Props>) {
  return <div style={style}>...</div>;
}
```

#### 5. 与 react-beautiful-dnd 集成修复

```typescript
// ✅ 必须添加包装 div
<Droppable droppableId="droppable" mode="virtual">
  {(provided) => (
    // 必须将 innerRef 和 droppableProps 传递给 div
    <div 
      ref={provided.innerRef} 
      {...provided.droppableProps}
      style={{ height, width }}  // 使用实际像素值
    >
      <List
        rowComponent={RowComponent}
        rowCount={items.length}
        rowHeight={50}
        rowProps={{ ... }}
        style={{ height, width }}
      />
    </div>
  )}
</Droppable>
```

---

## 🔧 问题 5: react-beautiful-dnd 严格类型检查

### 错误信息
```
Invariant failed: isDropDisabled must be a boolean
Invariant failed: ignoreContainerClipping must be a boolean
Invariant failed: provided.innerRef has not been provided with a HTMLElement
```

### 原因
react-beautiful-dnd 13.1.1 对某些可选属性进行了更严格的类型检查

### 解决方案

#### 显式设置布尔值属性

```typescript
<Droppable
  droppableId="droppable"
  mode="virtual"
  renderClone={RenderClone}
  isCombineEnabled={true}
  
  // ✅ 必须显式设置这些布尔值，不能依赖默认值
  isDropDisabled={false}
  ignoreContainerClipping={false}
  
  getContainerForClone={() => document.body}
  direction="vertical"
>
  {(provided) => (
    // ✅ 必须提供 innerRef 和 droppableProps
    <div ref={provided.innerRef} {...provided.droppableProps}>
      {/* 内容 */}
    </div>
  )}
</Droppable>
```

---

## 🔧 问题 6: TypeScript moduleResolution 配置

### 错误信息
```
Cannot find module 'storybook/test' or its corresponding type declarations.
Consider updating to 'node16', 'nodenext', or 'bundler'.
```

### 原因
Storybook 10 使用 ESM 包，需要更现代的模块解析策略

### 解决方案

**`tsconfig.json` 修改：**
```json
{
  "compilerOptions": {
    // ❌ 旧配置
    // "moduleResolution": "node",
    
    // ✅ 新配置
    "moduleResolution": "bundler",
    
    // 其他配置保持不变
    "module": "esnext",
    "target": "esnext"
  }
}
```

---

## 🔧 问题 7: Color 类型错误

### 错误信息
```
'Color' refers to a value, but is being used as a type here. 
Did you mean 'typeof Color'?
```

### 原因
`color` 包导出的 `Color` 是一个函数值，不是类型

### 解决方案

```typescript
import Color from "color";

// ❌ 错误用法
let colorInstance: Color | null = null;

// ✅ 正确用法
let colorInstance: ReturnType<typeof Color> | null = null;
```

---

## 🔧 问题 8: MDX 文件中的 Markdown 导入

### 错误信息
```
Failed to parse source for import analysis because the content contains invalid JS syntax
Failed to fetch dynamically imported module: Docs.mdx
```

### 原因
Vite 无法正确处理 MDX 文件中的 `?raw` 导入

### 解决方案（两种方案）

#### 方案 1：添加自定义 Vite 插件

**`.storybook/main.ts` 修改：**
```typescript
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  async viteFinal(config) {
    config?.plugins?.push({
      name: "vite-plugin-raw-md",
      enforce: "pre",
      resolveId(id) {
        if (id.endsWith(".md?raw")) {
          return id;
        }
      },
      async load(id) {
        if (id.endsWith(".md?raw")) {
          const fs = await import("fs");
          const filePath = id.replace("?raw", "");
          const content = fs.readFileSync(filePath, "utf-8");
          return `export default ${JSON.stringify(content)};`;
        }
      },
    });
    return config;
  },
};
```

#### 方案 2：移除 Markdown 组件（推荐）

```mdx
<!-- ❌ 可能有问题的方式 -->
import Readme from "./docs.md?raw";
import { Markdown } from "@storybook/addon-docs/blocks";

<Markdown>{Readme}</Markdown>

<!-- ✅ 简化方式 -->
详细使用文档请参考 [docs.md](./docs.md) 文件。
```

---

## 🔧 问题 9: useEffect 依赖项警告

### 错误信息
在组件中调用 action 回调时触发 implicit action 警告

### 原因
useEffect 缺少回调函数依赖项

### 解决方案

```typescript
// ❌ 缺少依赖项
useEffect(() => {
  onOpenChange(open);
}, [open]);

// ✅ 添加完整依赖项
useEffect(() => {
  onOpenChange(open);
}, [open, onOpenChange]);
```

---

## 📝 完整迁移检查清单

### 1. package.json 更新
```bash
# 检查并更新这些包到 10.1.4
- [ ] storybook
- [ ] @storybook/react
- [ ] @storybook/react-vite
- [ ] @storybook/addon-docs

# 移除这些包
- [ ] @storybook/addon-essentials
- [ ] @storybook/addon-interactions
- [ ] @storybook/addon-links
- [ ] @storybook/blocks
- [ ] @storybook/manager-api
- [ ] @storybook/test
- [ ] @storybook/theming
- [ ] @storybook/types
- [ ] @storybook/addon-storysource (不兼容 Storybook 10)
```

### 2. Storybook 配置文件

**`.storybook/main.ts`:**
```typescript
- [ ] 添加 "@storybook/addon-docs" 到 addons
- [ ] 移除或注释内置的 addon 字符串
- [ ] 检查 viteFinal 配置
```

**`.storybook/manager.ts`:**
```typescript
- [ ] 更新 import { addons } from "storybook/manager-api"
- [ ] 更新 import { create } from "storybook/theming/create"
```

**`.storybook/preview.ts`:**
```typescript
- [ ] 更新 import { themes } from "storybook/theming"
```

### 3. Stories 文件更新

检查所有 `*.stories.tsx` 文件：
```typescript
- [ ] 导入 fn: import { fn } from "storybook/test"
- [ ] 移除 argTypes 中的 action 配置
- [ ] 在 args 中使用 fn() 为所有回调函数创建 spy
```

### 4. MDX 文件更新
```typescript
- [ ] 更新导入: @storybook/blocks → @storybook/addon-docs/blocks
- [ ] 处理 ?raw 导入问题
```

### 5. react-window 2.x 代码更新

检查所有使用 react-window 的文件：
```typescript
- [ ] 更新导入
- [ ] 修改 List API: children → rowComponent + rowProps
- [ ] 更新类型: ListChildComponentProps → RowComponentProps
- [ ] 移除 memo 和 areEqual
- [ ] 修改 props: itemCount → rowCount, itemSize → rowHeight
- [ ] 使用 style 传递高度和宽度
```

### 6. react-beautiful-dnd 兼容性

```typescript
- [ ] 添加 isDropDisabled={false}
- [ ] 添加 ignoreContainerClipping={false}
- [ ] 确保 provided.innerRef 传递给 HTML 元素
- [ ] 在虚拟列表中添加包装 div
```

### 7. TypeScript 配置
```json
- [ ] 更新 moduleResolution 为 "bundler"
- [ ] 清理缓存: rm -rf node_modules/.vite
```

### 8. 类型错误修复
```typescript
- [ ] Color 类型: Color → ReturnType<typeof Color>
- [ ] 检查所有 useEffect 依赖项
```

---

## 🚀 迁移步骤（推荐顺序）

### Step 1: 备份和准备
```bash
# 1. 创建新分支
git checkout -b upgrade/storybook-10

# 2. 备份 package.json
cp package.json package.json.backup

# 3. 提交当前更改
git add -A
git commit -m "backup before upgrade"
```

### Step 2: 更新 package.json
```bash
# 1. 手动编辑 package.json，按照上面的指南更新版本
# 2. 安装依赖
pnpm install
```

### Step 3: 更新 Storybook 配置
```bash
# 按顺序更新这些文件：
1. .storybook/main.ts
2. .storybook/manager.ts
3. .storybook/preview.ts
```

### Step 4: 更新 Stories 文件
```bash
# 按优先级更新：
1. 简单的 stories (SearchInput, EmojiPickerWrapper)
2. 复杂的 stories (GroupItem, GroupList)
3. MDX 文档文件
```

### Step 5: 更新组件代码
```bash
# 重点检查：
1. react-window 的使用
2. react-beautiful-dnd 的配置
3. useEffect 依赖项
4. 类型定义
```

### Step 6: 测试和验证
```bash
# 1. 清理缓存
rm -rf node_modules/.vite

# 2. 启动 Storybook
pnpm run serve

# 3. 访问 http://localhost:6006
# 4. 逐个测试每个 story
# 5. 检查控制台是否有错误
```

---

## 🐛 常见问题和解决方案

### Q1: Storybook 启动失败，提示版本不匹配
**A:** 确保所有 `@storybook/*` 包版本一致，使用 `pnpm list | grep @storybook` 检查

### Q2: List 组件不显示内容
**A:** 检查 `style` 属性是否传递了实际像素值（number），而不是百分比字符串

### Q3: TypeScript 提示找不到模块
**A:** 
1. 检查 `tsconfig.json` 中的 `moduleResolution` 是否为 `bundler`
2. 重启 TypeScript 服务器
3. 清理 Vite 缓存

### Q4: Droppable 报错 "must be a boolean"
**A:** 显式设置所有布尔值属性，不要依赖默认值：
```typescript
isDropDisabled={false}
ignoreContainerClipping={false}
isCombineEnabled={true}
```

### Q5: Actions 面板没有显示事件
**A:** 确保在 meta.args 中使用 `fn()` 而不是在 argTypes 中配置 action

---

## 📚 参考资源

### 官方文档
- [Storybook 10 迁移指南](https://storybook.js.org/docs/releases/migration-guide)
- [react-window GitHub](https://github.com/bvaughn/react-window)
- [react-beautiful-dnd 文档](https://github.com/atlassian/react-beautiful-dnd)

### 使用 Context7 MCP 查询文档
```bash
# 查询 Storybook 文档
Context7: /storybookjs/storybook

# 查询 react-window 文档
Context7: /bvaughn/react-window

# 查询 react-beautiful-dnd 文档
Context7: /hello-pangea/dnd
```

---

## ⚠️ 注意事项

1. **Context7 文档可能不完全准确**：始终以项目中实际安装的包的类型定义为准
2. **分步测试**：每修改一个组件就测试一次，不要一次性修改所有文件
3. **保留注释**：在修改配置时保留原有注释，便于回溯
4. **版本兼容性**：某些 addon 可能不支持 Storybook 10，需要寻找替代方案
5. **清理缓存**：遇到奇怪问题时，优先清理 `node_modules/.vite` 缓存

---

## 📊 本次升级统计

| 项目 | 修改文件数 | 主要变更 |
|------|-----------|---------|
| Storybook 配置 | 3 | 导入路径、addon 配置 |
| Stories 文件 | 5 | fn() actions |
| 组件代码 | 2 | react-window API、类型修复 |
| TypeScript 配置 | 1 | moduleResolution |
| 依赖包 | 1 | 版本统一 |

**总计：12 个文件**

---

## 🎯 快速参考卡片

### Storybook 10 导入速查
```typescript
// Manager/Preview
"storybook/manager-api"
"storybook/theming"
"storybook/theming/create"
"storybook/test"  // fn()

// MDX/Docs
"@storybook/addon-docs/blocks"  // Canvas, Meta, Markdown

// Types
"@storybook/react"  // Meta, StoryObj
```

### react-window 2.x 速查
```typescript
import { List, type RowComponentProps } from "react-window";

<List
  rowComponent={RowComponent}  // 组件
  rowCount={number}            // 行数
  rowHeight={number}           // 行高（像素）
  rowProps={object}            // 传递给行组件的 props
  style={{ height, width }}   // 容器样式（像素值）
/>
```

### Actions 速查
```typescript
import { fn } from "storybook/test";

const meta = {
  component: MyComponent,
  args: {
    onClick: fn(),
    onChange: fn(),
    onCustomEvent: fn(),
  },
};
```

---

*文档创建时间：2025-12-08*  
*适用版本：Storybook 10.1.4, React 19.2.1, react-window 2.2.3*

