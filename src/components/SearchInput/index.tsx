import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input, InputProps } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import styled from "styled-components";

const { Search } = Input;

const SearchWrapper = styled.div`
  padding: 8px 8px;
`;

export interface SearchInputProps {
  onSearch?: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = (props) => {
  const { t } = useTranslation();
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      props.onSearch?.("");
    }
    setValue(e.target.value);
  };

  const handleSearch = (value: string) => {
    props.onSearch?.(value);
  };

  return (
    <SearchWrapper>
      <Search
        value={value}
        onChange={handleChange}
        onSearch={handleSearch}
        allowClear={true}
        placeholder={t("search")}
        prefix={<SearchOutlined />}
      />
    </SearchWrapper>
  );
};

export default SearchInput;
