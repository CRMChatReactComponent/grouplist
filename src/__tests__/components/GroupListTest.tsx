import { useMemo, useState } from "react";
import { GroupItemType } from "@/components/GroupItem/type";
import GroupList, { GroupListDataType } from "@/components/GroupList";
import { GroupItemTypeEnum } from "@/enums";
import { GroupListPlugin } from "@/plugins/GroupListPlugin";
import { useNewMessagesPlugin } from "@/plugins/useNewMessagesPlugin";
import { useSelectsPlugin } from "@/plugins/useSelectsPlugin";
import { AntdApiContextProviderCmp } from "$/AntdApiContext";
import { I18nContextCmp } from "$/I18nContext";

const data: GroupListDataType = {
  root: {
    isFolder: true,
    index: "root",
    children: ["user-1", "folder-1"],
    data: {
      id: "root",
      backgroundColor: undefined,
      emoji: undefined,
      avatar: undefined,
      title: "root group",
      message: "",
      readonly: false,
      type: GroupItemTypeEnum.GROUP,
    },
  },
  "user-1": {
    isFolder: false,
    index: "user-1",
    children: [],
    data: {
      id: "user-1",
      type: 0,
      title: "用户1",
      emoji: undefined,
      message: "im user-1",
      avatar: "https://avatars.githubusercontent.com/u/29160041",
      backgroundColor: "#df4fde",
      readonly: false,
    },
  },
  "folder-1": {
    isFolder: true,
    index: "folder-1",
    children: ["user-2"],
    data: {
      id: "folder-1",
      type: 1,
      title: "folder-1",
      backgroundColor: undefined,
      avatar: undefined,
      emoji: undefined,
      message: "im folder-1",
      readonly: false,
    },
  },
  "user-2": {
    isFolder: false,
    index: "user-2",
    children: [],
    data: {
      id: "user-2",
      type: 0,
      title: "user-2",
      emoji: undefined,
      message: "im user 2",
      avatar: "https://avatars.githubusercontent.com/u/29160041",
      backgroundColor: "#df4fde",
      readonly: false,
    },
  },
};

export function GroupListTest(props: { onDropdownClick(): void }) {
  const [newMessagesIdsMap, setNewMessagesIdsMap] = useState<
    Record<GroupItemType["id"], number>
  >({});
  const [ids, setIds] = useState<GroupItemType["id"][]>([]);

  const { plugin: newMessagePlugin } = useNewMessagesPlugin({
    state: {
      map: newMessagesIdsMap,
      setMap: setNewMessagesIdsMap,
    },
  });

  const { plugin: SelectPlugin } = useSelectsPlugin({
    uniqueId: "test",
    state: {
      ids,
      setIds,
    },
  });

  const plugin = useMemo(() => {
    const plugin = new GroupListPlugin();
    plugin.register(newMessagePlugin);
    plugin.register(SelectPlugin);
    return plugin;
  }, [newMessagePlugin, SelectPlugin]);

  return (
    <I18nContextCmp>
      <AntdApiContextProviderCmp>
        <GroupList
          data={data}
          plugin={plugin}
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
                  props.onDropdownClick();
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
                  props.onDropdownClick();
                },
              };
            }
          }}
          SlotHeader={<div data-testid={"SlotHeader"}></div>}
          SlotFooter={<div data-testid={"SlotFooter"}></div>}
          SlotExtraInformation={({ data }) => {
            return <div data-testid={`SlotExtraInformation-${data.id}`}></div>;
          }}
        />
      </AntdApiContextProviderCmp>

      <button
        data-testid={"updateMessage"}
        onClick={() =>
          setNewMessagesIdsMap({
            "user-1": 12,
          })
        }
      />

      <button
        data-testid={"deleteMessage"}
        onClick={() => setNewMessagesIdsMap({})}
      />

      <button
        data-testid={"selectAll"}
        onClick={() => setIds(Object.keys(data))}
      />
      <button data-testid={"unSelectAll"} onClick={() => setIds([])} />
    </I18nContextCmp>
  );
}
