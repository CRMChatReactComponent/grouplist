# 使用

## 安装

```shell
pnpm install @crmchatreactcomponent/grouplist -D
```

## 使用

```tsx
import {
  AntdApiContextProviderCmp,
  GroupList,
  I18nContextCmp,
  GroupListDataType,
  GroupItemTypeEnum,
} from "@crmchatreactcomponent/grouplist";

//  数据结构（下文会讲到具体的内容结构）
const listData: GroupListDataType = {
  root: {
    isFolder: true,
    index: "root",
    children: ["ungrouped"],
    data: {
      id: "root",
      type: GroupItemTypeEnum.GROUP,
      title: "root group",
      emoji: undefined,
      message: "",
      avatar: undefined,
      backgroundColor: undefined,
      readonly: false,
    },
  },
  ungrouped: {
    isFolder: true,
    index: "ungrouped",
    children: [],
    data: {
      id: "ungrouped",
      type: GroupItemTypeEnum.GROUP,
      title: "未分类",
      emoji: undefined,
      message: "",
      avatar: undefined,
      backgroundColor: undefined,
      readonly: false,
    },
  },
};

const GroupListWrapper = function () {
  const [data, setData] = useState(listData);

  return (
    <AntdApiContextProviderCmp>
      <I18nContextCmp>
        <GroupList data={data} onDataChange={setData} />
      </I18nContextCmp>
    </AntdApiContextProviderCmp>
  );
};
```

该组件使用 `i8next` 和 `antd` 来分别处理多语言和主题切换功能，因此在调用 `<GroupList/>` 时需要将其包裹在 `AntdApiContextProviderCmp` 和 `I18nContextCmp` 中，以保证逻辑代码正常运行。

> 只需要包裹下即可，不需要进行任何配置

# 参数

## data 必传

列表数据，类型为 `GroupListDataType`. 先看下面几个类型定义

```typescript
export interface GroupItemType {
  id: string;
  /**
   * 标题
   */
  title: string;
  /**
   * 标题下方的消息内容
   */
  message: string;
  /**
   * 背景颜色
   */
  backgroundColor: string | undefined;
  /**
   * emoji，只有在 type 为 folder 时才使用
   */
  emoji: string | undefined;
  /**
   * 头像地址 uri
   */
  avatar: string | undefined;
  /**
   * 是否处于只读状态
   * 只读状态下无法删除和切换 emoji，backgroundColor
   */
  readonly: boolean;
  /**
   * 类型，USER or FOLDER
   */
  type: GroupItemTypeEnum;
}

export type TreeItem<T> = {
  /**
   * id
   */
  index: string;
  /**
   * 子节点的 ids 数组
   * 只有在 isFolder 为 true 时才生效
   */
  children: Array<string>;
  /**
   * 是否是文件夹
   */
  isFolder: boolean;
  /**
   * 数据载体
   */
  data: T;
};

export type GroupListDataItemType = TreeItem<GroupItemType>;

export type GroupListDataType = Record<
  GroupItemType["id"],
  GroupListDataItemType
>;
```

这里我们拿 demo 中的数据来对照下

```typescript
const listData: GroupListDataType = {
  root: {
    isFolder: true,
    index: "root",
    children: ["ungrouped"],
    data: {
      id: "root",
      type: GroupItemTypeEnum.GROUP,
      title: "root group",
      emoji: undefined,
      message: "",
      avatar: undefined,
      backgroundColor: undefined,
      readonly: false,
    },
  },
  ungrouped: {
    isFolder: true,
    index: "ungrouped",
    children: [],
    data: {
      id: "ungrouped",
      type: GroupItemTypeEnum.GROUP,
      title: "未分类",
      emoji: undefined,
      message: "",
      avatar: undefined,
      backgroundColor: undefined,
      readonly: false,
    },
  },
};
```

#### 顶级数据

`GroupListDataType` 中**必须**包含一个 id 为`root` 节点，用于描述顶级数据，该节点不会被渲染出来，只是用于确定数据关系（你可以理解为列表渲染总是从 `root` 节点的 `children` 开始往下找子级）

因此即使列表为空时，数据应该也是下面这样

```typescript
const listData: GroupListDataType = {
  root: {
    isFolder: true,
    index: "root",
    children: [],
    data: {
      id: "root",
      type: GroupItemTypeEnum.GROUP,
      title: "root group",
      emoji: undefined,
      message: "",
      avatar: undefined,
      backgroundColor: undefined,
      readonly: false,
    },
  },
};
```

如果此时需要你需要添加一个 `GroupItem` 到数据结构中，你需要做两步骤

1. 在 `listData` 中添加这个数据
2. 在 `listData.root.children` 中 push 下这个数据的 id

效果如下

![https://i.imgur.com/kFARVPG.png](https://i.imgur.com/kFARVPG.png)

数据如下

```typescript
const listData: GroupListDataType = {
  root: {
    isFolder: true,
    index: "root",
    children: ["carljin"],
    data: {
      id: "root",
      type: GroupItemTypeEnum.GROUP,
      title: "root group",
      emoji: undefined,
      message: "",
      avatar: undefined,
      backgroundColor: undefined,
      readonly: false,
    },
  },
  carljin: {
    isFolder: true,
    index: "carljin",
    children: [],
    data: {
      id: "carljin",
      type: GroupItemTypeEnum.USER,
      title: "CarlJin",
      emoji: undefined,
      message: "",
      avatar: "https://avatars.githubusercontent.com/u/24644246?v=4",
      backgroundColor: undefined,
      readonly: false,
    },
  },
};
```

> 注意 `root` 并不会渲染，它作为顶级节点，只用会渲染 root.children 里面指定的数据

> 注意 如果你要删除一个 `GroupList` 也需要在父节点或者 root 的 children 中删除其 ID （建议你使用下文中的方法来处理删除，已经内置好删除方法）

## height （可选）

列表渲染高度，默认为 `80vh`

> 该列表使用了虚拟滚动所以必须指定固定高度

## depthPaddingLeft (可选)

每一级距离左侧的 padding-left 默认值为 `14`

计算方式为 depth \* depthPaddingLeft

## plugin（可选）

插件实例对象，具体使用请看下文中的 [插件](#plugins)

## getDropdownMenu（可选）

右上角下拉框回调，通过这个配置你可以自定义下拉框的内容和回调处理函数，具体使用见下文 [右上角下拉框内容渲染](#dropdown)

# 事件

## onDataChange（可选）

`(data: GroupListDataType) => void;`

当用户与列表进行交互，比如拖拽节点位置、修改名称、删除等操作时的回调.

当数据发生改变时请及时更新 `data` 数据，以保证列表能正确渲染

## onDelete（可选）

`(data: GroupItemType) => CancelableReturnType;`

节点删除时回调

## onItemFocused（可选）

`(data: GroupItemType) => void;`

节点 focused 时的回调。

# Slot

插槽

![https://i.imgur.com/DnaFIci.png](https://i.imgur.com/DnaFIci.png)

(上图指出了每个插槽的位置，请根据你的需求选择对应的插槽)

插槽这样使用

```tsx
<GroupList
  data={data}
  onDataChange={setData}
  SlotHeader={<div>我是 Header</div>}
  SlotFooter={<div>我是 Footer</div>}
  SlotExtraInformation={({ data }) => {
    return <div>{data.type}</div>;
  }}
  SlotAvatarExtra={({ data }) => {
    return <div>{data.name}</div>;
  }}
/>
```

## 类型

插槽有两种类型
`ReactNode` 和 `DefaultSlotType` 其中只有 `SlotHeader` 和 `SlotFooter` 属于 `ReactNode` 类型，其他的都是 `DefaultSlotType`

因为 "SlotBottomRightArea"、"SlotExtraInformation"、"SlotTopRightAreaLeft"、"SlotTopRightAreaRight"、"SlotAvatarExtra"

这几个插槽都是针对 `GroupItem` 组件使用。所以它们需要接受 `GroupItem` 数据并返回一个 `ReactNode`，比如你希望根据节点是 `folder` 或者 `user` 来选择返回不同的 Slot 内容，此时为 `DefaultSlotType` 类型就很有必要。

我们来看下 `DefaultSlotType` 的类型描述

```typescript
export type DefaultSlotType = (
  props: Required<
    Pick<GroupItemPropsType, "isFocused" | "isExpanded" | "isSelected">
  > & {
    data: GroupItemType;
  },
) => ReactElement | null;
```

为 `DefaultSlotType` 类型的插槽回调中 props 参数中一共有 4 个值

1. isFocused 该节点是否 focused
2. isExpanded 该节点是否 展开
3. isSelected 该节点是否 已选中
4. data 该节点数据

## 例子

假设我们需要在节点为 `folder` 类型的 `SlotExtraInformation` 节点中插入当前 folder 的子节点有多少个。我们可以这样写

```tsx
<GroupList
  data={data}
  onDataChange={setData}
  SlotExtraInformation={({ data: _data }) => {
    //  找到数据列表中该节点的数据
    const itemData = data[_data.id];
    //  如果不是 folder 类型的节点则不渲染内容
    if (!itemData.isFolder) return null;

    return <div>有 {itemData.children.length} 个子节点</div>;
  }}
/>
```

## hover-shows

当你使用 `SlotTopRightAreaLeft` 和 `SlotTopRightAreaRight` 插槽时候。可能希望该插槽的内容和 dropdown 按钮一样，随着鼠标移入这个节点才显示。

你只需要将要渲染的内容包裹在 `.hover-shows` 这个类名下即可，比如这样

```tsx
<GroupList
  data={data}
  onDataChange={setData}
  SlotTopRightAreaRight={() => {
    return (
      <div className={"hover-shows"}>
        <DeleteBtn />
      </div>
    );
  }}
/>
```

# Dropdown

下拉菜单

![https://i.imgur.com/qcgQ9RC.png](https://i.imgur.com/qcgQ9RC.png)

该组件使用 `antd` 的 [Dropdown](https://ant.design/components/dropdown) 组件来渲染下拉菜单。因此你可以通过 [Menu Props](https://ant.design/components/menu#api) 来配置出你想要的下拉菜单效果。

> 强烈建议你先粗略的看下 antd dropdown 和 menu props 里面的内容

## 默认菜单

该组件内置了三个常用菜单 `修改标题`, `修改背景色` 和 `删除`

## 自定义菜单与使用

```tsx
<GroupList
  data={groupListData.current}
  onDataChange={onDataChange}
  getDropdownMenu={(data) => {
    //  如果是小组就返回小组用的菜单
    if (data.type === GroupItemTypeEnum.GROUP) {
      return {
        items: [
          {
            label: "点击弹出小组名称",
            key: "alertGroupName",
          },
        ],
        onClick(ev) {
          alert(ev.key);
        },
      };
    } else {
      return {
        items: [
          {
            label: "点击弹出成员名称",
            key: "alertUserName",
          },
        ],
        onClick(ev) {
          alert(ev.key);
        },
      };
    }
  }}
/>
```

# Plugins

插件

该组件提供了以下内置插件

1. [newMessagePlugin](/story/grouplist--plugin-user-status)
2. [selectsPlugin](/story/grouplist--plugin-selects)
3. [userStatusPlugin](/story/grouplist--plugin-user-status)

## 使用

```tsx
import {
  useSelectsPlugin,
  GroupListPlugin,
  GroupList,
} from "@crmchatreactcomponent/grouplist";

function GroupListWrapper() {
  const [ids, setIds] = useState<GroupItemType["id"][]>([]);

  const { plugin: SelectPlugin } = useSelectsPlugin({
    uniqueId: "test",
    state: {
      ids,
      setIds,
    },
  });

  const plugin = useMemo(() => {
    const plugin = new GroupListPlugin();
    plugin.register(SelectPlugin);
    return plugin;
  }, [SelectPlugin]);

  <GroupList data={data} onDataChange={handleDataChange} plugin={plugin} />;
}
```

## 编写插件

插件的实现原理就是修改传入给 GroupList 的 props，因此你也可以自己编写自己的插件。这里有个参考例子

[https://github.com/CRMChatReactComponent/grouplist/blob/main/src/plugins/useNewMessagesPlugin.tsx](https://github.com/CRMChatReactComponent/grouplist/blob/main/src/plugins/useNewMessagesPlugin.tsx)

# 方法

GroupList 提供了一系列的 API，你可以通过调用它们来快速的完成数据的修改

## 使用

```tsx
function GroupListWrapper() {
  const GroupListRef = useRef<ElementRef<typeof GroupList>>();

  return (
    <>
      <button
        onClick={() => {
          //  调用展开所有接口
          GroupListRef.current?.expandAll();
        }}
      >
        展开所有菜单
      </button>
      <GroupList ref={GroupListRef} data={data} onDataChange={setData} />
    </>
  );
}
```

以下是已支持的接口

```typescript
export type UseDataModifyAPIReturnType = {
  /**
   * unFocus 一个 item
   * @param id
   */
  unFocusItem(id?: GroupItemType["id"]): void;
  /**
   * focus 一个 item
   * 注意：folder 无法 focus
   * @param id
   */
  focusItem(id: GroupItemType["id"]): void;
  /**
   * 展开或收起一个文件夹
   * @param id
   */
  toggleFolderExpanded(id: GroupItemType["id"]): void;
  /**
   * 展开一个文件夹
   * @param id
   */
  expandFolder(id: GroupItemType["id"]): void;
  /**
   * 展开所有文件夹
   */
  expandAll(): void;
  /**
   * 收起一个文件夹
   * @param id
   */
  collapseFolder(id: GroupItemType["id"]): void;
  /**
   * 收起所有文件夹
   */
  collapseAll(): void;
  /**
   * 删除一个 item，如果是数组同时删除数组里面的所有内容
   * @param id
   */
  deleteItem(id: GroupItemType["id"]): void;
  /**
   * 删除多个 items
   * @param ids
   */
  deleteItems(ids: GroupItemType["id"][]): void;
  /**
   * 将用户添加到文件夹
   * 如果用户已经在其他文件夹中将会移动到 groupID 指定的文件夹
   * 如果用户不存在，则会新建
   * @param folderId
   * @param items
   */
  addItemsToFolder(folderId: GroupItemType["id"], items: GroupItemType[]): void;
  /**
   * 将 items 添加到指定文件夹中，通过 ids
   * 如果 item 不存在将不会添加
   * @param folderId
   * @param itemIds
   */
  addItemsToFolderByIds(
    folderId: GroupItemType["id"],
    itemIds: GroupItemType["id"][],
  ): void;
  /**
   * 将 items 从指定文件夹中删除，通过 ids
   * @param folderId
   * @param itemIds
   */
  removeItemsFromFolderByIds(
    folderId: GroupItemType["id"],
    itemIds: GroupItemType["id"][],
  ): void;
  /**
   * 添加一个分组
   * @param payload
   */
  addAFolder(payload: { name: string; id: string; parentId?: string }): void;
  /**
   * 递归获取一个文件夹下面所有的节点 id（不包含子文件夹 ids）
   * @param folderId
   * @param _ids 不需要传入
   */
  getAllItemsFromFolder(
    folderId: GroupItemType["id"],
    _ids?: GroupItemType["id"][],
  ): GroupItemType["id"][];
};
```
