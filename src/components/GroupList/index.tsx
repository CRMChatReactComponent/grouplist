import {
  ReactNode,
  useState,
  forwardRef,
  useImperativeHandle,
  memo,
  MouseEventHandler,
} from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DraggableProvided,
  DraggableStateSnapshot,
  DraggableRubric,
} from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  FixedSizeList as List,
  areEqual,
  ListChildComponentProps,
} from "react-window";
import { DropdownProps, Empty } from "antd";
import { omit } from "lodash-es";
import GroupItem, { GroupItemPropsType } from "@/components/GroupItem";
import { GroupItemType } from "@/components/GroupItem/type";
import {
  deleteDataFromItems,
  getDepthById,
} from "@/components/GroupList/helpers/dataOperation";
import { isElDisableInteraction } from "@/components/GroupList/helpers/disableInteractionHelper";
import { ParentIdMapType, useData } from "@/components/GroupList/hooks/useData";
import {
  useDataModifyAPI,
  UseDataModifyAPIReturnType,
} from "@/components/GroupList/hooks/useDataModifyAPI";
import { GroupListDataType } from "@/components/GroupList/types";
import { useIsDark } from "@/hooks/useIsDark";
import { GroupListPlugin } from "@/plugins/GroupListPlugin";
import { CancelableReturnType } from "@/types";
import { GroupItemHeight } from "../GroupItem/const";
import SearchInput, { SearchInputProps } from "../SearchInput";
import {
  Wrapper,
  ItemWrap,
  GroupListWrapper,
  HeaderWrapper,
  FooterWrapper,
  EmptyWrapper,
} from "./index.styled";
import { MouseDownEvent } from "emoji-picker-react/dist/config/config";

export * from "./types";

export type GroupListPropsType = {
  /**
   * 列表数据
   */
  data: GroupListDataType;
  /**
   * 组件高度
   */
  height?: number;
  /**
   * 每一级距离左侧的 padding-left
   * 计算方式为 depth * depthPaddingLeft
   */
  depthPaddingLeft?: number;
  /**
   * 总是将 folder 置顶排序
   */
  alwaysMakeFolderTop?: boolean;
  /**
   * 是否显示搜索框
   */
  showSearchInput?: boolean;

  /**
   * 插件
   */
  plugin?: GroupListPlugin;
  /**
   * 右上角下拉框回调
   * @param data
   */
  getDropdownMenu?: (data: GroupItemType) => DropdownProps["menu"];
  /**
   * 列表数据改变回调
   * @param data
   */
  onDataChange?: (data: GroupListDataType) => void;
  /**
   * 列表元素删除时回调
   * @param data
   */
  onDelete?: (data: GroupItemType) => CancelableReturnType;
  /**
   * 列表元素 focus 时回调
   * @param data
   */
  onItemFocused?: (data: GroupItemType) => void;
  /**
   * 头部插槽
   */
  SlotHeader?: ReactNode;
  /**
   * 底部插槽
   */
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

    const {
      data,
      height = window.innerHeight * 0.8,
      depthPaddingLeft = 14,
      alwaysMakeFolderTop = false,
      onItemFocused = () => {},
      onDataChange = () => {},
      onDelete = () => {},
      getDropdownMenu = () => ({}),
    }: GroupListPropsType = props;

    const { t } = useTranslation();
    const [viewStates, setViewStates] = useState<ViewStateType>({
      expanded: [],
      selected: [],
      focused: "",
    });

    //  搜索框数据定义
    const [searchValue, setSearchValue] = useState("");

    const { listItemsIds, parentIdMap, searchFilteredData } = useData(
      data,
      viewStates.expanded,
      searchValue ?? "",
    );
    const API = useDataModifyAPI({
      data,
      listItemsIds,
      parentIdMap,
      viewStates,
      onDataChange,
      setViewStates,
      alwaysMakeFolderTop,
      searchFilteredData,
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

      // 非搜索状态保持原有逻辑
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

    const handleSearchChange = (value: string) => {
      setSearchValue(value);
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
          <DepthWrapper
            id={id}
            parentIdMap={parentIdMap}
            depthPaddingLeft={depthPaddingLeft}
          >
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
          {props.showSearchInput && (
            <SearchInput onSearch={handleSearchChange} />
          )}
          <GroupListWrapper $isDark={isDark} $height={height}>
            {searchValue ? (
              <div style={{ height: "100%" }}>
                {searchFilteredData.root.children.length === 0 ? (
                  <EmptyWrapper>
                    <Empty description={t("noSearchResult")} />
                  </EmptyWrapper>
                ) : (
                  <AutoSizer>
                    {({ width, height }) => (
                      <List
                        width={width}
                        height={height}
                        itemCount={searchFilteredData.root.children.length}
                        itemSize={GroupItemHeight}
                        layout={"vertical"}
                        overscanCount={2}
                      >
                        {({ index, style, data: _data }) => {
                          const id = searchFilteredData.root.children[index];
                          const itemData = searchFilteredData[id].data;
                          const isSelected = viewStates.selected.includes(id);
                          const isFocused = viewStates.focused === id;

                          return (
                            <div
                              style={style}
                              onClick={handleGroupItemClick}
                              data-id={itemData.id}
                            >
                              <GroupItem
                                key={itemData.id}
                                data={itemData}
                                isSelected={isSelected}
                                isExpanded={false}
                                isFocused={isFocused}
                                isOnDropOver={false}
                                actionDropdownMenu={getDropdownMenu(itemData)}
                                onDataChange={handleItemDataChange}
                                onDeleted={handleOnDelete}
                              />
                            </div>
                          );
                        }}
                      </List>
                    )}
                  </AutoSizer>
                )}
              </div>
            ) : (
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
                        itemData={{
                          listItemsIds,
                          viewStates,
                          handleGroupItemClick,
                          parentIdMap,
                          getDropdownMenu,
                          handleItemDataChange,
                          handleOnDelete,
                          props,
                          data,
                          depthPaddingLeft,
                        }}
                      >
                        {RowRenderer}
                      </List>
                    )}
                  </Droppable>
                )}
              </AutoSizer>
            )}
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

const DepthWrapper = memo(
  (props: {
    id: string;
    children: ReactNode;
    parentIdMap: ParentIdMapType;
    depthPaddingLeft: number;
  }) => {
    const depth = getDepthById(props.id, props.parentIdMap);
    return (
      <div
        style={{
          paddingLeft: depth * props.depthPaddingLeft,
        }}
      >
        {props.children}
      </div>
    );
  },
);
DepthWrapper.displayName = "DepthWrapper";

const RowRenderer = memo<
  ListChildComponentProps<{
    listItemsIds: string[];
    viewStates: ViewStateType;
    handleGroupItemClick: MouseEventHandler<HTMLDivElement>;
    parentIdMap: ParentIdMapType;
    getDropdownMenu: GroupListPropsType["getDropdownMenu"];
    handleItemDataChange: (item: GroupItemType) => void;
    handleOnDelete: (item: GroupItemType) => void;
    props: GroupListPropsType;
    data: GroupListDataType;
    depthPaddingLeft: number;
  }>
>(({ index, style, data: _data }) => {
  const {
    listItemsIds,
    viewStates,
    handleGroupItemClick,
    parentIdMap,
    getDropdownMenu = () => ({}),
    handleItemDataChange,
    handleOnDelete,
    props,
    data,
    depthPaddingLeft,
  } = _data;
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
              <DepthWrapper
                id={id}
                parentIdMap={parentIdMap}
                depthPaddingLeft={depthPaddingLeft}
              >
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
}, areEqual);
RowRenderer.displayName = "RowRenderer";

export default GroupList;
