import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface YesNoButtonsProps {
  onNo: () => void;
  onYes: () => void;
  yesLabel?: string;
  noLabel?: string;
  className?: string;
  disabledYes?: boolean;
  disabledNo?: boolean;
  yesClassName?: string;
  noClassName?: string;
}

export const YesNoButtons = React.forwardRef<
  HTMLDivElement,
  YesNoButtonsProps
>(({
  onNo,
  onYes,
  yesLabel = "YES",
  noLabel = "NO",
  className,
  disabledYes = false,
  disabledNo = false,
  yesClassName,
  noClassName,
  ...props
}, ref) => {
  const defaultButtonStyle = {
    fontSize: '21px',
    fontFamily: 'Arial',
    fontWeight: 'bold' as const
  };

  return (
    <div 
      ref={ref}
      className={cn("flex gap-2 justify-end", className)}
      {...props}
    >
      <Button
        variant="no"
        onClick={onNo}
        disabled={disabledNo}
        className={cn("min-w-[80px]", noClassName)}
        style={defaultButtonStyle}
      >
        {noLabel}
      </Button>
      <Button
        variant="yes"
        onClick={onYes}
        disabled={disabledYes}
        className={cn("min-w-[80px]", yesClassName)}
        style={defaultButtonStyle}
      >
        {yesLabel}
      </Button>
    </div>
  );
});

YesNoButtons.displayName = "YesNoButtons";