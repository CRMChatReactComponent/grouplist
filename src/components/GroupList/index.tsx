import {
  FC,
  ReactNode,
  useMemo,
  useState,
  forwardRef,
  createRef,
  useImperativeHandle,
  memo,
  useEffect,
  useLayoutEffect,
} from "react";
import {
  UncontrolledTreeEnvironment,
  StaticTreeDataProvider,
  Tree,
  InteractionMode,
} from "react-complex-tree";
import { TreeEnvironmentRef, TreeRef } from "react-complex-tree/lib/esm/types";
import "react-complex-tree/lib/style-modern.css";
import { DropdownProps } from "antd";
import { omit } from "lodash-es";
import GroupItem, { GroupItemPropsType } from "@/components/GroupItem";
import { GroupItemType } from "@/components/GroupItem/type";
import { deleteDataFromItems } from "@/components/GroupList/helpers/dataOperation";
import { isElDisableInteraction } from "@/components/GroupList/helpers/disableInteractionHelper";
import { isControlKey } from "@/components/GroupList/helpers/isControlKey";
import {
  GroupListDataItemType,
  GroupListDataType,
} from "@/components/GroupList/types";
import { useIsDark } from "@/hooks/useIsDark";
import { GroupListPlugin } from "@/plugins/GroupListPlugin";
import { CancelableReturnType } from "@/types";
import {
  Wrapper,
  ItemWrap,
  GroupListWrapper,
  HeaderWrapper,
  FooterWrapper,
} from "./index.styled";

export * from "./types";

export type GroupListPropsType = {
  data: GroupListDataType;
  deepestFolderLevel?: number;
  plugin?: GroupListPlugin;
  getDropdownMenu?: (data: GroupItemType) => DropdownProps["menu"];
  onDataChange?: (data: GroupListDataType) => void;
  onDelete?: (data: GroupItemType) => CancelableReturnType;
  onItemDeleted?: (data: GroupItemType) => void;
  onItemFocused?: (data: GroupItemType) => void;
  onItemDataChange?: (data: GroupItemType) => void;
  onItemAdd?: (data: GroupItemType, parent: GroupItemType | null) => void;
  SlotHeader?: ReactNode;
  SlotFooter?: ReactNode;
} & Pick<
  GroupItemPropsType,
  | "SlotBottomRightArea"
  | "SlotExtraInformation"
  | "SlotTopRightAreaLeft"
  | "SlotTopRightAreaRight"
>;

export type GroupListHandler = {
  getEnvironment: () => TreeEnvironmentRef<GroupItemType, ""> | null;
  getTree: () => TreeRef<GroupItemType> | null;
};

const GroupList = forwardRef<GroupListHandler, GroupListPropsType>(
  (_props: GroupListPropsType, ref) => {
    const plugin = _props.plugin ?? new GroupListPlugin();
    const props = plugin.resolveProps(omit(_props, ["plugin"]));

    const {
      data,
      deepestFolderLevel = 2,
      onItemFocused = () => {},
      onDataChange = () => {},
      onDelete = () => {},
      getDropdownMenu = () => ({}),
    }: GroupListPropsType = props;

    const environment = createRef<TreeEnvironmentRef<GroupItemType, "">>();
    const tree = createRef<TreeRef<GroupItemType>>();
    const [_, update] = useState(0);

    const dataProvider = useMemo(() => {
      return new StaticTreeDataProvider(data);
    }, [data]);
    const isDark = useIsDark();

    //  暴露方法
    useImperativeHandle(
      ref,
      () => ({
        getEnvironment: () => environment.current,
        getTree: () => tree.current,
      }),
      [tree.current, environment.current],
    );

    function handleItemDataChange(item: GroupItemType) {
      data[item.id].data = item;
      onDataChange(data);

      update(Math.random());
    }

    function handleOnDrop() {
      //  @ts-ignore
      const items = environment.current?.dataProvider?.data?.items;
      if (items) {
        onDataChange({
          ...items,
        });
      }
    }

    function handleOnDelete(data: GroupItemType) {
      //  @ts-ignore
      const items = environment.current?.dataProvider?.data?.items ?? {};
      onDelete(data);
      onDataChange(
        deleteDataFromItems(
          {
            ...items,
          },
          data.id,
        ),
      );
    }

    function handleFocus(item) {
      onItemFocused(item.data);
    }

    return (
      <Wrapper>
        {props.SlotHeader && <HeaderWrapper>{props.SlotHeader}</HeaderWrapper>}
        <GroupListWrapper $isDark={isDark}>
          <UncontrolledTreeEnvironment
            ref={environment}
            canDragAndDrop={true}
            canDropOnFolder={true}
            canReorderItems={true}
            canDropOnNonFolder={false}
            canDropAt={(items, target) => {
              const isHaveFolderInItems = !!items.find((item) => item.isFolder);

              //  禁止拖拽后形成跟深的 folder
              if (isHaveFolderInItems) {
                //  禁止将一个 item 拖拽到 deepestFolderLevel - 1 的 folder 中
                if (target.targetType === "item") {
                  if (target.depth + 2 > deepestFolderLevel) {
                    return false;
                  }
                }

                if (target.targetType === "between-items") {
                  if (target.depth + 1 > deepestFolderLevel) {
                    return false;
                  }
                }
              }

              return true;
            }}
            dataProvider={dataProvider}
            viewState={{}}
            defaultInteractionMode={{
              mode: "custom",
              extends: InteractionMode.ClickItemToExpand,
              createInteractiveElementProps: (
                item,
                treeId,
                actions,
                renderFlags,
              ) => ({
                onClick: (ev) => {
                  const target = ev.target as HTMLDivElement;
                  if (isElDisableInteraction(target)) return;

                  actions.focusItem();

                  if (ev.shiftKey) {
                    actions.selectUpTo(!ev.ctrlKey);
                  } else if (isControlKey(ev)) {
                    if (renderFlags.isSelected) {
                      actions.unselectItem();
                    } else {
                      actions.addToSelectedItems();
                    }
                  } else {
                    if (item.isFolder) {
                      actions.toggleExpandedState();
                    }
                    actions.selectItem();

                    if (!item.isFolder) {
                      actions.primaryAction();
                    }
                  }
                },
                onFocus: (ev) => {
                  const target = ev.target as HTMLDivElement;
                  if (isElDisableInteraction(target)) return;
                  if (item.isFolder) return;
                  actions.focusItem();
                },
              }),
            }}
            getItemTitle={(item: GroupListDataItemType) => item.data.title}
            renderTreeContainer={({ children, containerProps }) => (
              <div {...containerProps}>{children}</div>
            )}
            renderItemsContainer={({ children, containerProps }) => (
              <div {...containerProps}>{children}</div>
            )}
            renderItem={(_props) => {
              const { context, children, item } = _props;
              const itemData = item.data as GroupItemType;

              return (
                <div
                  {...context.itemContainerWithChildrenProps}
                  key={itemData.id}
                >
                  <ItemWrap
                    {...context.itemContainerWithoutChildrenProps}
                    {...context.interactiveElementProps}
                  >
                    <GroupItem
                      key={itemData.id}
                      data={itemData}
                      isSelected={context.isSelected}
                      isExpanded={context.isExpanded}
                      isFocused={context.isFocused}
                      actionDropdownMenu={getDropdownMenu(itemData)}
                      onDataChange={handleItemDataChange}
                      onDeleted={handleOnDelete}
                      SlotExtraInformation={props.SlotExtraInformation}
                      SlotTopRightAreaLeft={props.SlotTopRightAreaLeft}
                      SlotTopRightAreaRight={props.SlotTopRightAreaRight}
                      SlotBottomRightArea={props.SlotBottomRightArea}
                    />
                  </ItemWrap>

                  <div
                    style={{
                      paddingLeft: 24,
                    }}
                  >
                    {children}
                  </div>
                </div>
              );
            }}
            onDrop={handleOnDrop}
            onFocusItem={handleFocus}
          >
            <Tree
              ref={tree}
              treeId={"group-list"}
              rootItem={"root"}
              treeLabel={"group-list"}
            />
          </UncontrolledTreeEnvironment>
        </GroupListWrapper>
        {props.SlotFooter && <FooterWrapper>{props.SlotFooter}</FooterWrapper>}
      </Wrapper>
    );
  },
);

GroupList.displayName = "GroupList";

export default GroupList;
