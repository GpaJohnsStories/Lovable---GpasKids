import React, { useMemo } from "react";
import BaseWebTextBox from "./BaseWebTextBox";

interface SysWelWebTextBoxProps {
  code: string;
  title?: string;
  id?: string;
}

const SysWelWebTextBox: React.FC<SysWelWebTextBoxProps> = ({ 
  code, 
  title,
  id 
}) => {
  // SYS-WEL theme - dark blue colors
  const welTheme = useMemo(() => ({
    primaryColor: "#0B3D91",
    borderColor: "#0B3D91", 
    backgroundColor: "#0B3D9133",
    photoMatColor: "#0B3D9133"
  }), []);

  return (
    <BaseWebTextBox
      code={code}
      title={title}
      id={id}
      theme={welTheme}
      cssClassPrefix="syswel"
    />
  );
};

export default SysWelWebTextBox;