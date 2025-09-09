import React, { useMemo } from "react";
import BaseWebTextBox from "./BaseWebTextBox";

interface SysWe2WebTextBoxProps {
  code: string;
  title?: string;
  id?: string;
}

const SysWe2WebTextBox: React.FC<SysWe2WebTextBoxProps> = ({ code, title, id }) => {
  // SYS-WE2 theme - dark green colors
  const greenTheme = useMemo(() => ({
    primaryColor: "#4A7C59",
    borderColor: "#4A7C59", 
    backgroundColor: "#4A7C5933",
    photoMatColor: "#4A7C5933"
  }), []);

  return (
    <BaseWebTextBox
      code={code}
      title={title}
      id={id}
      theme={greenTheme}
      cssClassPrefix="syswe2"
    />
  );
};

export default SysWe2WebTextBox;