import { ElementRef, useEffect, useMemo, useRef, useState } from "react";
import { Button, ColorPicker, Select, Space, Switch, Typography } from "antd";
import { omit, sample } from "lodash-es";
import { GroupItemType } from "../components/GroupItem/type";
import GroupList from "../components/GroupList/index";
import { GroupItemTypeEnum } from "../enums/index";
import { GroupListPlugin } from "../plugins/GroupListPlugin";
import { useNewMessagesPlugin } from "../plugins/useNewMessagesPlugin";
import { useSelectsPlugin } from "../plugins/useSelectsPlugin";
import {
  UserOnlineStatusEnum,
  useUserStatusPlugin,
} from "../plugins/useUserStatusPlugin";
import { genMockTreeData } from "./helpers/genMockTreeDataHelper";
import type { Meta, StoryObj } from "@storybook/react";

const { Text } = Typography;

const meta = {
  title: "GroupList",
  component: GroupList,
  argTypes: {},
  render(props) {
    const [data, setData] = useState(props.data ?? {});

    function handleDataChange(data) {
      setData(data);
      props?.onDataChange?.(data);
    }
    return (
      <div style={{ width: 420 }}>
        <GroupList
          {...omit(props, ["data", "onDataChange"])}
          data={data}
          onDataChange={handleDataChange}
        />
      </div>
    );
  },
} satisfies Meta<typeof GroupList>;

export default meta;
type Story = StoryObj<typeof GroupList>;

const mockTreeData = genMockTreeData();
export const Basic: Story = {
  args: {
    data: mockTreeData,
  },
};

export const HeaderAndFooter: Story = {
  args: {
    data: mockTreeData,
    SlotHeader: <Text>Header 区域</Text>,
    SlotFooter: <Text>Footer 区域</Text>,
  },
};

export const PluginNewMessage: Story = {
  args: {
    data: mockTreeData,
  },
  render(props, context) {
    const [data, setData] = useState(props.data ?? {});
    const [newMessagesIdsMap, setNewMessagesIdsMap] = useState<
      Record<GroupItemType["id"], number>
    >({});
    const [currentSelectId, setCurrentSelectId] = useState("root");
    const [dot, setDot] = useState(false);
    const [size, setSize] = useState<"default" | "small">("default");

    const { plugin: newMessagePlugin } = useNewMessagesPlugin({
      state: {
        map: newMessagesIdsMap,
        setMap: setNewMessagesIdsMap,
      },
      dot,
      size,
    });

    const plugin = useMemo(() => {
      const plugin = new GroupListPlugin();
      plugin.register(newMessagePlugin);
      return plugin;
    }, [newMessagePlugin]);

    const selectOptions = useMemo(() => {
      return Object.values(data)
        .filter((item) => {
          return item.data.type === GroupItemTypeEnum.USER;
        })
        .map((item) => {
          return {
            value: item.data.id,
            label: item.data.title,
          };
        });
    }, [data]);

    useEffect(() => {
      context?.setMethodsPanel(
        <Space size={12} direction={"vertical"}>
          <Select
            value={currentSelectId}
            onChange={(value) => setCurrentSelectId(value)}
            options={selectOptions}
            style={{ width: 240 }}
            showSearch={true}
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
          />
          <Space size={12} direction={"vertical"}>
            <Button type={"primary"} onClick={updateCount}>
              更新 message count
            </Button>
            <Button danger={true} onClick={removeCount}>
              删除 message count
            </Button>
            <Button
              onClick={() => {
                setNewMessagesIdsMap({});
              }}
            >
              {" "}
              删除全部{" "}
            </Button>
          </Space>

          <Space>
            <Text>Dot:</Text>
            <Switch checked={dot} onChange={setDot} />
          </Space>

          <Space>
            <Text>Size:</Text>
            <Select
              value={size}
              onChange={setSize}
              options={[
                {
                  label: "small",
                  value: "small",
                },
                {
                  label: "default",
                  value: "default",
                },
              ]}
              style={{ width: 120 }}
            />
          </Space>
        </Space>,
      );
    }, [currentSelectId, dot, size]);

    function updateCount() {
      setNewMessagesIdsMap({
        ...newMessagesIdsMap,
        [currentSelectId]: Math.random() * 120,
      });
    }

    function removeCount() {
      delete newMessagesIdsMap[currentSelectId];
      setNewMessagesIdsMap({
        ...newMessagesIdsMap,
      });
    }

    function handleDataChange(data) {
      console.log(data,999)
      setData(data);
      props?.onDataChange?.(data);
    }

    return (
      <div style={{ width: 420 }}>
        <GroupList
          {...omit(props, ["data", "onDataChange", "plugin"])}
          data={data}
          onDataChange={handleDataChange}
          plugin={plugin}
        />
      </div>
    );
  },
};

export const PluginUserStatus: Story = {
  args: {
    data: mockTreeData,
  },
  render(props, context) {
    const [data, setData] = useState(props.data ?? {});
    const [userStatusIdsMap, setUserStatusIdsMap] = useState<
      Record<GroupItemType["id"], UserOnlineStatusEnum | undefined>
    >(
      Object.keys(mockTreeData).reduce((prev, current) => {
        prev[current] = sample([
          UserOnlineStatusEnum.INVISIBLE,
          UserOnlineStatusEnum.ACTIVE,
          UserOnlineStatusEnum.AWAY,
          UserOnlineStatusEnum.DO_NOT_DISTURB,
          undefined,
        ]);
        return prev;
      }, {}),
    );
    const [currentSelectId, setCurrentSelectId] = useState("root");

    const { plugin: newUserStatusPlugin } = useUserStatusPlugin({
      state: {
        map: userStatusIdsMap,
        setMap: setUserStatusIdsMap,
      },
    });

    const plugin = useMemo(() => {
      const plugin = new GroupListPlugin();
      plugin.register(newUserStatusPlugin);
      return plugin;
    }, [newUserStatusPlugin]);

    function handleDataChange(data) {
      setData(data);
      props?.onDataChange?.(data);
    }

    return (
      <div style={{ width: 420 }}>
        <GroupList
          {...omit(props, ["data", "onDataChange", "plugin"])}
          data={data}
          onDataChange={handleDataChange}
          plugin={plugin}
        />
      </div>
    );
  },
};

export const CustomDropdown: Story = {
  args: {
    data: mockTreeData,
  },
  render(props, context) {
    return (
      <div style={{ width: 420, height: "80vh", overflow: "auto" }}>
        <GroupList
          {...props}
          getDropdownMenu={(data) => {
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
      </div>
    );
  },
};

export const Ref: Story = {
  args: {
    data: mockTreeData,
  },
  render(props, context) {
    const GroupListRef = useRef<ElementRef<typeof GroupList>>(null);

    return (
      <div style={{ width: 420, height: "80vh", overflow: "auto" }}>
        <GroupList
          {...props}
          ref={GroupListRef}
          SlotHeader={
            <Space>
              <Button
                size={"small"}
                onClick={() => GroupListRef.current?.collapseAll()}
              >
                收起全部
              </Button>
              <Button
                size={"small"}
                onClick={() => GroupListRef.current?.expandAll()}
              >
                展开全部
              </Button>
            </Space>
          }
          SlotFooter={
            <Space>
              <Text>我是 footer</Text>
            </Space>
          }
        />
      </div>
    );
  },
};

export const PluginSelects: Story = {
  args: {
    data: mockTreeData,
  },
  render(props, context) {
    const [data, setData] = useState(props.data ?? {});
    const [ids, setIds] = useState<GroupItemType["id"][]>([]);
    const [color, setColor] = useState<string>("#f20");
    const [isAutoSelectChildren, setIsAutoSelectChildren] =
      useState<boolean>(true);

    const { plugin: SelectPlugin } = useSelectsPlugin({
      uniqueId: "test",
      state: {
        ids,
        setIds,
      },
      color: color,
      isAutoSelectChildren,
    });

    const plugin = useMemo(() => {
      const plugin = new GroupListPlugin();
      plugin.register(SelectPlugin);
      return plugin;
    }, [SelectPlugin]);

    useEffect(() => {
      context?.setMethodsPanel(
        <Space size={12} direction={"vertical"}>
          <Space>
            <Text>颜色</Text>
            <ColorPicker
              size="large"
              showText
              value={color}
              onChange={(_, val) => {
                setColor(val);
              }}
            />
          </Space>
          <Space>
            <Text>是否自动选择子节点</Text>
            <Switch
              checked={isAutoSelectChildren}
              onChange={setIsAutoSelectChildren}
            />
          </Space>
          <Space direction={"vertical"}>
            <Button
              onClick={() => {
                setIds(Object.keys(data));
              }}
            >
              选择全部
            </Button>
            <Button
              onClick={() => {
                setIds([]);
              }}
            >
              取消全部
            </Button>
          </Space>
        </Space>,
      );
    }, [isAutoSelectChildren, color]);

    function handleDataChange(data) {
      setData(data);
      props?.onDataChange?.(data);
    }

    return (
      <div style={{ width: 420 }}>
        <GroupList
          {...omit(props, ["data", "onDataChange"])}
          data={data}
          onDataChange={handleDataChange}
          plugin={plugin}
        />
      </div>
    );
  },
};
export const PluginSelectsMultiple: Story = {
  args: {
    data: mockTreeData,
  },
  render(props, context) {
    const [ids, setIds] = useState<GroupItemType["id"][]>([]);
    const [ids2, setIds2] = useState<GroupItemType["id"][]>([]);
    const [data, setData] = useState(props.data ?? {});
    const [_, update] = useState(0);

    const { plugin: SelectPlugin } = useSelectsPlugin({
      uniqueId: "test",
      state: {
        ids,
        setIds,
      },
    });
    const { plugin: SelectPlugin2 } = useSelectsPlugin({
      uniqueId: "test2",
      state: {
        ids: ids2,
        setIds: setIds2,
      },
      color: "#f0f",
    });

    const plugin = useMemo(() => {
      const plugin = new GroupListPlugin();
      plugin.register(SelectPlugin);
      plugin.register(SelectPlugin2);
      return plugin;
    }, [SelectPlugin, SelectPlugin2]);

    function handleDataChange(data) {
      setData(data);
      props?.onDataChange?.(data);
      update(Math.random());
    }

    return (
      <div style={{ width: 420 }}>
        <GroupList
          {...omit(props, ["data", "onDataChange"])}
          data={data}
          onDataChange={handleDataChange}
          plugin={plugin}
        />
      </div>
    );
  },
};
