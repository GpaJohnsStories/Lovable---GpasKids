import React, { useMemo } from "react";
import BaseWebTextBox from "./BaseWebTextBox";

interface SysLaaWebTextBoxProps {
  code: string;
  title?: string;
  id?: string;
}

const SysLaaWebTextBox: React.FC<SysLaaWebTextBoxProps> = ({ 
  code, 
  title,
  id 
}) => {
  // SYS-LAA theme - orange colors
  const orangeTheme = useMemo(() => ({
    primaryColor: "#FF8C42",
    borderColor: "#FF8C42", 
    backgroundColor: "#FF8C4233",
    photoMatColor: "#FF8C4233"
  }), []);

  return (
    <BaseWebTextBox
      code={code}
      title={title}
      id={id}
      theme={orangeTheme}
      cssClassPrefix="syslaa"
    />
  );
};

export default SysLaaWebTextBox;