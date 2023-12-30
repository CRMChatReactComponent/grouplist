import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { Input, InputProps, Space, Typography } from "antd";

const { Text } = Typography;

export type ListItemPropsType = {
  size: InputProps["size"];
  value: string;
  onChange(val: string): void;
};

export type ListItemHandler = {
  clear: () => void;
};

const ListItem = forwardRef<ListItemHandler, ListItemPropsType>(
  ({ size = "middle", value, onChange }: ListItemPropsType, ref) => {
    const { t } = useTranslation();
    const [_value, setValue] = useState("");

    useImperativeHandle(
      ref,
      () => ({
        clear() {
          setValue("");
          onChange("");
        },
      }),
      [],
    );

    useEffect(() => {
      setValue(value);
    }, [value]);

    return (
      <Space size={12}>
        <Text>{t("nameFieldName")}</Text>
        <Input
          style={{ width: 240 }}
          placeholder={t("nameFieldPlaceholder")}
          size={size}
          value={_value}
          onChange={(ev) => {
            setValue(ev.target.value);
            onChange(ev.target.value);
          }}
        />
      </Space>
    );
  },
);

ListItem.displayName = "ListItem";

export default ListItem;
