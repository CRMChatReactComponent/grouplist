import { ReactNode, useState, forwardRef, useImperativeHandle } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DraggableProvided,
  DraggableStateSnapshot,
  DraggableRubric,
} from "react-beautiful-dnd";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { DropdownProps } from "antd";
import { omit } from "lodash-es";
import GroupItem, { GroupItemPropsType } from "@/components/GroupItem";
import { GroupItemType } from "@/components/GroupItem/type";
import {
  deleteDataFromItems,
  getDepthById,
} from "@/components/GroupList/helpers/dataOperation";
import { isElDisableInteraction } from "@/components/GroupList/helpers/disableInteractionHelper";
import { useData } from "@/components/GroupList/hooks/useData";
import {
  useDataModifyAPI,
  UseDataModifyAPIReturnType,
} from "@/components/GroupList/hooks/useDataModifyAPI";
import { GroupListDataType } from "@/components/GroupList/types";
import { useIsDark } from "@/hooks/useIsDark";
import { GroupListPlugin } from "@/plugins/GroupListPlugin";
import { CancelableReturnType } from "@/types";
import { GroupItemHeight } from "../GroupItem/const";
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
  height?: number;
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
  | "SlotAvatarExtra"
>;

export type GroupListHandler = Omit<
  UseDataModifyAPIReturnType,
  "_moveItemToFolder" | "_moveItemToIndex"
>;

export type ViewStateType = {
  expanded: GroupItemType["id"][];
  selected: GroupItemType["id"][];
  focused: GroupItemType["id"];
};

const GroupList = forwardRef<GroupListHandler, GroupListPropsType>(
  (_props: GroupListPropsType, ref) => {
    const plugin = _props.plugin ?? new GroupListPlugin();
    const props = plugin.resolveProps(omit(_props, ["plugin"]));
    const [viewStates, setViewStates] = useState<ViewStateType>({
      expanded: [],
      selected: [],
      focused: "",
    });

    const {
      data,
      height = window.innerHeight * 0.8,
      onItemFocused = () => {},
      onDataChange = () => {},
      onDelete = () => {},
      getDropdownMenu = () => ({}),
    }: GroupListPropsType = props;

    const { listItemsIds, parentIdMap } = useData(data, viewStates.expanded);
    const API = useDataModifyAPI({
      data,
      listItemsIds,
      parentIdMap,
      viewStates,
      onDataChange,
      setViewStates,
    });

    const {
      focusItem,
      toggleFolderExpanded,
      expandFolder,
      collapseFolder,
      _moveItemToIndex,
      _moveItemToFolder,
    } = API;

    const isDark = useIsDark();

    //  暴露方法
    useImperativeHandle(ref, () => API);

    const handleGroupItemClick = (ev) => {
      if (isElDisableInteraction(ev.target as HTMLDivElement)) return;
      const target = ev.currentTarget as HTMLDivElement;
      const id = target.dataset.id as string;

      if (data[id].isFolder) {
        toggleFolderExpanded(id);
      } else {
        onItemFocused(data[id].data);
        focusItem(id);
      }
    };

    const handleDragEnd = (result) => {
      if (!result.draggableId) return;

      if (result.combine && data[result?.combine?.draggableId]?.isFolder) {
        _moveItemToFolder(result.draggableId, result.combine.draggableId);
        expandFolder(result?.combine?.draggableId);
      } else {
        if (!result.destination) return;
        _moveItemToIndex(result.draggableId, result.destination.index);
      }
    };

    const onBeforeDragStart = (start) => {
      if (data[start.draggableId]?.isFolder) {
        collapseFolder(start.draggableId);
      }
    };

    const handleItemDataChange = (item: GroupItemType) => {
      data[item.id].data = item;
      onDataChange(data);
    };

    const handleOnDelete = (item: GroupItemType) => {
      const items = data;
      onDelete(item);
      onDataChange(
        deleteDataFromItems(
          {
            ...items,
          },
          item.id,
        ),
      );
    };

    const DepthWrapper = (props: { id: string; children: ReactNode }) => {
      const depth = getDepthById(props.id, parentIdMap);
      return (
        <div
          style={{
            paddingLeft: depth * 14,
          }}
        >
          {props.children}
        </div>
      );
    };

    const RowRenderer = ({ index, style }) => {
      const id = listItemsIds[index];
      const itemData = data[id].data;
      const isExpanded = viewStates.expanded.includes(id);
      const isSelected = viewStates.selected.includes(id);
      const isFocused = viewStates.focused === id;

      // 渲染每一行的逻辑
      return (
        <Draggable draggableId={id} index={index} key={id}>
          {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
            const isOnDropOver =
              data[id].isFolder && Boolean(snapshot.combineTargetFor);
            return (
              <div
                key={id}
                style={style}
                data-id={itemData.id}
                onClick={handleGroupItemClick}
              >
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <DepthWrapper id={id}>
                    <GroupItem
                      key={itemData.id}
                      data={itemData}
                      isSelected={isSelected}
                      isExpanded={isExpanded}
                      isFocused={isFocused}
                      isOnDropOver={isOnDropOver}
                      actionDropdownMenu={getDropdownMenu(itemData)}
                      onDataChange={handleItemDataChange}
                      onDeleted={handleOnDelete}
                      SlotExtraInformation={props.SlotExtraInformation}
                      SlotTopRightAreaLeft={props.SlotTopRightAreaLeft}
                      SlotTopRightAreaRight={props.SlotTopRightAreaRight}
                      SlotBottomRightArea={props.SlotBottomRightArea}
                      SlotAvatarExtra={props.SlotAvatarExtra}
                    />
                  </DepthWrapper>
                </div>
              </div>
            );
          }}
        </Draggable>
      );
    };

    const RenderClone = (
      provided: DraggableProvided,
      snapshot: DraggableStateSnapshot,
      rubric: DraggableRubric,
    ) => {
      const id = listItemsIds[rubric.source.index];
      const itemData = data[id].data;

      return (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <DepthWrapper id={id}>
            <GroupItem
              key={itemData.id}
              data={itemData}
              isSelected={false}
              isExpanded={false}
              isFocused={false}
              SlotExtraInformation={props.SlotExtraInformation}
              SlotBottomRightArea={props.SlotBottomRightArea}
            />
          </DepthWrapper>
        </div>
      );
    };

    return (
      <DragDropContext
        onDragEnd={handleDragEnd}
        onBeforeDragStart={onBeforeDragStart}
      >
        <Wrapper>
          {props.SlotHeader && (
            <HeaderWrapper>{props.SlotHeader}</HeaderWrapper>
          )}
          <GroupListWrapper $isDark={isDark} $height={height}>
            <AutoSizer>
              {({ width, height }) => (
                <Droppable
                  droppableId="droppable"
                  mode={"virtual"}
                  renderClone={RenderClone}
                  isCombineEnabled={true}
                  direction={"vertical"}
                >
                  {(provided) => (
                    <List
                      width={width}
                      height={height}
                      itemCount={listItemsIds.length}
                      itemSize={GroupItemHeight}
                      outerRef={provided.innerRef}
                      layout={"vertical"}
                      overscanCount={2}
                    >
                      {RowRenderer}
                    </List>
                  )}
                </Droppable>
              )}
            </AutoSizer>
          </GroupListWrapper>
          {props.SlotFooter && (
            <FooterWrapper>{props.SlotFooter}</FooterWrapper>
          )}
        </Wrapper>
      </DragDropContext>
    );
  },
);

GroupList.displayName = "GroupList";

export default GroupList;
