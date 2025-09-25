import React from "react";
import SysWelWebTextBox from "@/components/templates/SysWelWebTextBox";
import SysWe2WebTextBox from "@/components/templates/SysWe2WebTextBox";
import SysLaaWebTextBox from "@/components/templates/SysLaaWebTextBox";
import { WebTextBox as LegacyWebTextBox } from "@/components/LegacyWebTextBox";

interface WebTextBoxProps {
  code?: string;
  title?: string;
  id?: string;
  // Legacy props for backward compatibility
  webtextCode?: string;
  borderColor?: string;
  backgroundColor?: string;
  showReturn?: boolean;
  onReturnClick?: () => void;
}

const WebTextBox: React.FC<WebTextBoxProps> = ({ 
  code,
  title,
  id,
  // Legacy props
  webtextCode,
  borderColor,
  backgroundColor,
  showReturn = false,
  onReturnClick
}) => {
  // Use new code prop, fallback to legacy webtextCode
  const actualCode = code || webtextCode;
  
  if (!actualCode) {
    return <div>Error: No webtext code provided</div>;
  }

  // If legacy props are provided, use the old WebTextBox
  if (borderColor || backgroundColor) {
    return (
      <LegacyWebTextBox
        webtextCode={actualCode}
        borderColor={borderColor}
        backgroundColor={backgroundColor}
        title={title || ""}
        id={id}
        showReturn={showReturn}
        onReturnClick={onReturnClick}
      />
    );
  }

  // Route specific codes to their templates
  if (actualCode === "SYS-WE2") {
    return (
      <SysWe2WebTextBox
        code={actualCode}
        title={title}
        id={id}
      />
    );
  }

  if (actualCode === "SYS-LAA") {
    return (
      <SysLaaWebTextBox
        code={actualCode}
        title={title}
        id={id}
      />
    );
  }

  // Use the new SysWel template by default
  return (
    <SysWelWebTextBox 
      code={actualCode}
      title={title}
      id={id}
    />
  );
};

export { WebTextBox };
export default WebTextBox;