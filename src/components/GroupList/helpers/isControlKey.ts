import React from "react";

export const isControlKey = (e: React.MouseEvent<HTMLElement, MouseEvent>) =>
  e.ctrlKey ||
  (navigator.platform.toUpperCase().indexOf("MAC") >= 0 && e.metaKey);
