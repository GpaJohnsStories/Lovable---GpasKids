import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CharacterLimitedTextareaProps extends React.ComponentProps<typeof Textarea> {
  characterLimit: number;
  showCharacterCount?: boolean;
  onCharacterLimitExceeded?: () => void;
  compact?: boolean;
}

const CharacterLimitedTextarea = React.forwardRef<
  HTMLTextAreaElement,
  CharacterLimitedTextareaProps
>(({ className, characterLimit, showCharacterCount = true, onCharacterLimitExceeded, compact = false, onChange, onPaste, ...props }, ref) => {
  const [characterCount, setCharacterCount] = React.useState(0);

  // Update character count when value changes
  React.useEffect(() => {
    const currentValue = props.value || '';
    setCharacterCount(currentValue.toString().length);
  }, [props.value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const newCharacterCount = newValue.length;
    
    if (newCharacterCount > characterLimit) {
      // Truncate to character limit
      const truncatedValue = newValue.substring(0, characterLimit);
      e.target.value = truncatedValue;
      setCharacterCount(characterLimit);
      
      if (onCharacterLimitExceeded) {
        onCharacterLimitExceeded();
      }
    } else {
      setCharacterCount(newCharacterCount);
    }
    
    if (onChange) {
      onChange(e);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text');
    const currentValue = e.currentTarget.value;
    const selectionStart = e.currentTarget.selectionStart;
    const selectionEnd = e.currentTarget.selectionEnd;
    
    // Calculate what the new value would be after paste
    const newValue = currentValue.substring(0, selectionStart) + pastedText + currentValue.substring(selectionEnd);
    const newCharacterCount = newValue.length;
    
    if (newCharacterCount > characterLimit) {
      e.preventDefault();
      
      // Truncate the pasted content to fit within character limit
      const availableSpace = characterLimit - (currentValue.length - (selectionEnd - selectionStart));
      const truncatedPaste = pastedText.substring(0, availableSpace);
      const truncatedValue = currentValue.substring(0, selectionStart) + truncatedPaste + currentValue.substring(selectionEnd);
      e.currentTarget.value = truncatedValue;
      
      // Create a synthetic change event
      const syntheticEvent = {
        ...e,
        target: e.currentTarget,
        currentTarget: e.currentTarget,
      } as React.ChangeEvent<HTMLTextAreaElement>;
      
      setCharacterCount(truncatedValue.length);
      
      if (onChange) {
        onChange(syntheticEvent);
      }
      
      if (onCharacterLimitExceeded) {
        onCharacterLimitExceeded();
      }
    } else if (onPaste) {
      onPaste(e);
    }
  };

  const isAtLimit = characterCount >= characterLimit;
  const isNearLimit = characterCount >= characterLimit * 0.9; // 90% of limit

  return (
    <div className={cn(compact ? "relative" : "space-y-2")}>
      <Textarea
        className={cn(
          className,
          isAtLimit && "border-red-300 focus:border-red-500",
          isNearLimit && !isAtLimit && "border-orange-300 focus:border-orange-500"
        )}
        ref={ref}
        onChange={handleChange}
        onPaste={handlePaste}
        {...props}
      />
      {showCharacterCount && compact && (
        <div 
          className="absolute bottom-1 right-2 pointer-events-none"
          style={{
            fontFamily: 'Arial',
            fontSize: '19px',
            color: isAtLimit ? '#DC143C' : isNearLimit ? '#F97316' : '#666666'
          }}
        >
          {characterCount}/{characterLimit}
        </div>
      )}
      {showCharacterCount && !compact && (
        <div className="flex justify-between text-xs">
          <span className={cn(
            "font-medium",
            isAtLimit && "text-red-600",
            isNearLimit && !isAtLimit && "text-orange-600",
            !isNearLimit && "text-gray-500"
          )}>
            {characterCount}/{characterLimit} characters
          </span>
          {isAtLimit && (
            <span className="text-red-600">Character limit reached</span>
          )}
          {isNearLimit && !isAtLimit && (
            <span className="text-orange-600">Approaching character limit</span>
          )}
        </div>
      )}
    </div>
  );
});

CharacterLimitedTextarea.displayName = "CharacterLimitedTextarea";

export { CharacterLimitedTextarea };
