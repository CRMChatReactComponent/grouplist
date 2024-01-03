import { FC, ReactNode, useMemo } from "react";
import {
  UncontrolledTreeEnvironment,
  StaticTreeDataProvider,
  Tree,
  InteractionMode,
} from "react-complex-tree";
import { DropdownProps } from "antd";
import GroupItem from "@/components/GroupItem";
import { GroupItemType } from "@/components/GroupItem/type";
import { isElDisableInteraction } from "@/components/GroupList/helpers/disableInteractionHelper";
import {
  GroupListDataItemType,
  GroupListDataType,
} from "@/components/GroupList/types";
import { CancelableReturnType } from "@/types";
import styled from "styled-components";

export type GroupListPropsType = {
  data: GroupListDataType;
  dropdownMenu?: (
    data: GroupItemType,
    parent: GroupListDataItemType | null,
  ) => DropdownProps["menu"];
  onDataChange?: (data: GroupItemType[]) => void;
  onItemDelete?: (data: GroupItemType) => CancelableReturnType;
  onItemDeleted?: (data: GroupItemType) => void;
  onItemDataChange?: (data: GroupItemType) => void;
  onItemAdd?: (data: GroupItemType, parent: GroupItemType | null) => void;
  SlotHeader?: ReactNode;
  SlotFooter?: ReactNode;
};

const ItemWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const GroupList: FC<GroupListPropsType> = (props: GroupListPropsType) => {
  const { data }: GroupListPropsType = props;

  const dataProvider = useMemo(() => {
    return new StaticTreeDataProvider(data);
  }, [data]);

  return (
    <div className="rct-dark">
      <UncontrolledTreeEnvironment
        canDragAndDrop={true}
        canDropOnFolder={true}
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

              if (item.isFolder) {
                renderFlags.isExpanded
                  ? actions.collapseItem()
                  : actions.expandItem();
              } else {
                actions.focusItem();
              }
            },
            onFocus: () => {
              if (item.isFolder) {
                return;
              }
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
        renderItem={({ context, children, item }) => {
          const data = item.data as GroupItemType;

          return (
            <div {...context.itemContainerWithChildrenProps}>
              <ItemWrap
                {...context.itemContainerWithoutChildrenProps}
                {...context.interactiveElementProps}
              >
                <GroupItem
                  data={data}
                  isExpanded={context.isExpanded}
                  isFocused={context.isFocused}
                />
              </ItemWrap>

              <div style={{ paddingLeft: 12 }}>{children}</div>
            </div>
          );
        }}
      >
        <Tree
          treeId={"group-list"}
          rootItem={"root"}
          treeLabel={"group-list"}
        />
      </UncontrolledTreeEnvironment>
    </div>
  );
};

export default GroupList;
