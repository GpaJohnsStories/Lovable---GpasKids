import React, { useMemo } from "react";
import BaseWebTextBox from "./BaseWebTextBox";

interface SysWe2WebTextBoxProps {
  code: string;
  title?: string;
  id?: string;
}

const SysWe2WebTextBox: React.FC<SysWe2WebTextBoxProps> = ({ code, title, id }) => {
  // SYS-WE2 theme - orange colors
  const orangeTheme = useMemo(() => ({
    primaryColor: "#D2691E",
    borderColor: "#D2691E", 
    backgroundColor: "#D2691E33",
    photoMatColor: "#D2691E33"
  }), []);

  return (
    <BaseWebTextBox
      code={code}
      title={title}
      id={id}
      theme={orangeTheme}
      cssClassPrefix="syswe2"
    />
  );
};

export default SysWe2WebTextBox;