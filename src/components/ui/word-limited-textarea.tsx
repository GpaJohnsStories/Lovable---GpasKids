import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { countWords, truncateToWordLimit } from "@/utils/textUtils";
import { cn } from "@/lib/utils";

interface WordLimitedTextareaProps extends React.ComponentProps<typeof Textarea> {
  wordLimit: number;
  showWordCount?: boolean;
  onWordLimitExceeded?: () => void;
  compact?: boolean;
}

const WordLimitedTextarea = React.forwardRef<
  HTMLTextAreaElement,
  WordLimitedTextareaProps
>(({ className, wordLimit, showWordCount = true, onWordLimitExceeded, compact = false, onChange, onPaste, ...props }, ref) => {
  const [wordCount, setWordCount] = React.useState(0);

  // Update word count when value changes
  React.useEffect(() => {
    const currentValue = props.value || '';
    setWordCount(countWords(currentValue.toString()));
  }, [props.value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const newWordCount = countWords(newValue);
    
    if (newWordCount > wordLimit) {
      // Truncate to word limit
      const truncatedValue = truncateToWordLimit(newValue, wordLimit);
      e.target.value = truncatedValue;
      setWordCount(wordLimit);
      
      if (onWordLimitExceeded) {
        onWordLimitExceeded();
      }
    } else {
      setWordCount(newWordCount);
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
    const newWordCount = countWords(newValue);
    
    if (newWordCount > wordLimit) {
      e.preventDefault();
      
      // Truncate the pasted content to fit within word limit
      const truncatedValue = truncateToWordLimit(newValue, wordLimit);
      e.currentTarget.value = truncatedValue;
      
      // Create a synthetic change event
      const syntheticEvent = {
        ...e,
        target: e.currentTarget,
        currentTarget: e.currentTarget,
      } as React.ChangeEvent<HTMLTextAreaElement>;
      
      setWordCount(wordLimit);
      
      if (onChange) {
        onChange(syntheticEvent);
      }
      
      if (onWordLimitExceeded) {
        onWordLimitExceeded();
      }
    } else if (onPaste) {
      onPaste(e);
    }
  };

  const isAtLimit = wordCount >= wordLimit;
  const isNearLimit = wordCount >= wordLimit * 0.9; // 90% of limit

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
      {showWordCount && compact && (
        <div 
          className="absolute bottom-1 right-2 pointer-events-none"
          style={{
            fontFamily: 'Arial',
            fontSize: '19px',
            color: isAtLimit ? '#DC143C' : isNearLimit ? '#F97316' : '#666666'
          }}
        >
          {wordCount}/{wordLimit}
        </div>
      )}
      {showWordCount && !compact && (
        <div className="flex justify-between text-xs">
          <span className={cn(
            "font-medium",
            isAtLimit && "text-red-600",
            isNearLimit && !isAtLimit && "text-orange-600",
            !isNearLimit && "text-gray-500"
          )}>
            {wordCount}/{wordLimit} words
          </span>
          {isAtLimit && (
            <span className="text-red-600">Word limit reached</span>
          )}
          {isNearLimit && !isAtLimit && (
            <span className="text-orange-600">Approaching word limit</span>
          )}
        </div>
      )}
    </div>
  );
});

WordLimitedTextarea.displayName = "WordLimitedTextarea";

export { WordLimitedTextarea };