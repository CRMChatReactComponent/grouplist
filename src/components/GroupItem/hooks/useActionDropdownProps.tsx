import { useContext, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DropdownProps,
  MenuProps,
  ColorPicker,
  Divider,
  Flex,
  Button,
} from "antd";
import { GroupItemPropsType } from "@/components/GroupItem";
import { deepColor, mildColor, lightColor } from "@/const/colorPresets";
import { AntdApiContext, AntdApiContextType } from "$/AntdApiContext";
import { DeleteOutlined } from "@ant-design/icons";

enum ActionEnum {
  DELETE = "__DELETE",
  CHANGE_BG_COLOR = "__CHANGE_BG_COLOR",
}

export function useActionDropdownProps(
  props: Pick<
    GroupItemPropsType,
    "data" | "actionDropdownMenu" | "onBeforeDelete" | "onDeleted"
  > & {
    onColorChange(color: string): void;
  },
): DropdownProps {
  const { data, actionDropdownMenu, onBeforeDelete, onDeleted, onColorChange } =
    props;

  const [open, setOpen] = useState(false);
  const isColorPickerOpen = useRef(false);

  const { modalApi, messageApi } = useContext(
    AntdApiContext,
  ) as AntdApiContextType;

  const { t } = useTranslation();

  const inputMenus = useMemo(() => {
    const menu = actionDropdownMenu?.items
      ? [...actionDropdownMenu?.items]
      : [];
    if (actionDropdownMenu?.items) {
      menu.push({
        type: "divider",
      });
    }
    return menu;
  }, [props.actionDropdownMenu]);

  const defaultMenu: MenuProps["items"] = [
    ...inputMenus,
    {
      label: (
        <ColorPicker
          showText={() => t("changeBackgroundColor")}
          size={"small"}
          disabled={data.readonly}
          presets={[
            {
              label: t("deepColor"),
              colors: deepColor,
            },
            {
              label: t("mildColor"),
              colors: mildColor,
            },
            {
              label: t("lightColor"),
              colors: lightColor,
            },
          ]}
          defaultValue={data.backgroundColor ?? null}
          onChangeComplete={handleBackgroundColorChange}
          onOpenChange={handleColorPickerOpenChange}
          styles={{
            popupOverlayInner: {
              width: 468,
            },
          }}
          panelRender={(_, { components: { Picker, Presets } }) => (
            <div
              style={{
                display: "flex",
                width: 468,
              }}
            >
              <Flex
                vertical={true}
                justify={"space-between"}
                style={{
                  flex: 1,
                }}
              >
                <Presets />
                <Button
                  danger={true}
                  type={"primary"}
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    onColorChange("");
                    messageApi.success(t("deleteSuccessfully"));
                    setOpen(false);
                    isColorPickerOpen.current = false;
                  }}
                >
                  {t("deleteCurrentColor")}
                </Button>
              </Flex>
              <Divider
                type="vertical"
                style={{
                  height: "auto",
                }}
              />
              <div
                style={{
                  width: 234,
                }}
              >
                <Picker />
              </div>
            </div>
          )}
        />
      ),
      onClick() {
        if (data.readonly) return;
        isColorPickerOpen.current = true;
      },
      key: ActionEnum.CHANGE_BG_COLOR,
    },
    {
      type: "divider",
    },
    {
      label: t("delete"),
      icon: <DeleteOutlined />,
      key: ActionEnum.DELETE,
      danger: true,
      disabled: data.readonly,
    },
  ];

  function handleBackgroundColorChange(color) {
    onColorChange(`#${color.toHex()}`);
  }

  async function handleClick(ev) {
    if (Object.values(ActionEnum).includes(ev.key)) {
      switch (ev.key) {
        case ActionEnum.CHANGE_BG_COLOR:
          break;
        case ActionEnum.DELETE:
          if (onBeforeDelete) {
            const isAllow = await onBeforeDelete(data);
            if (isAllow === false) return;
          }

          modalApi.confirm({
            title: t("dangerOperation"),
            content: t("confirmToDelete"),
            okButtonProps: {
              danger: true,
            },
            cancelText: t("cancelText"),
            okText: t("confirmText"),
            onOk() {
              onDeleted?.(data);
            },
          });
          break;
      }
    } else {
      props?.actionDropdownMenu?.onClick?.(ev);
    }
  }

  function handleOpenChange(open) {
    if (!open && isColorPickerOpen.current) {
      return;
    }

    setOpen(open);
  }

  function handleColorPickerOpenChange(open) {
    isColorPickerOpen.current = open;
  }

  return {
    open: open,
    destroyPopupOnHide: true,
    onOpenChange: handleOpenChange,
    trigger: ["click"],
    menu: {
      items: defaultMenu,
      onClick: handleClick,
    },
  };
}
