import React, { useMemo } from "react";
import BaseWebTextBox from "./BaseWebTextBox";

interface SysWe2WebTextBoxProps {
  code: string;
  title?: string;
  id?: string;
}

const SysWe2WebTextBox: React.FC<SysWe2WebTextBoxProps> = ({ code, title, id }) => {
  // SYS-WE2 theme - green colors
  const greenTheme = useMemo(() => ({
    primaryColor: "#228B22",
    borderColor: "#228B22", 
    backgroundColor: "#228B2233",
    photoMatColor: "#228B2233"
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