import React, { useState, useRef, useEffect } from 'react';
import * as DialogPrimitive from "@radix-ui/react-dialog";

// Font constant from tailwind.config.ts font-fun definition
const FONT_FUN = 'Kalam, "Comic Sans MS", Arial, sans-serif';

interface SuperFontProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  author?: string;
  fontSize: number;
  onFontSizeChange: (newSize: number) => void;
  showAuthor?: boolean;
}

export const SuperFont: React.FC<SuperFontProps> = ({
  isOpen,
  onClose,
  title,
  author,
  fontSize,
  onFontSizeChange,
  showAuthor = true,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Font size control functions
  const handleIncrease = () => {
    if (fontSize < 30) {
      onFontSizeChange(fontSize + 2);
    }
  };

  const handleDecrease = () => {
    if (fontSize > 9) {
      onFontSizeChange(fontSize - 2);
    }
  };

  const isMinSize = fontSize <= 9;
  const isMaxSize = fontSize >= 30;

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content 
          ref={dialogRef}
          style={{
            // CSS Reset for complete isolation
            all: 'unset',
            boxSizing: 'border-box',
            
            // Position and size
            position: 'fixed',
            width: '288px',
            height: '250px',
            left: `calc(10% + ${position.x}px)`,
            top: `calc(5% + ${position.y}px)`,
            zIndex: 50,
            maxWidth: 'none',
            maxHeight: 'none',
            
            // Appearance
            background: 'linear-gradient(to bottom, #fffbeb, #fed7aa)',
            border: '4px solid #fdba74',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            cursor: isDragging ? 'grabbing' : 'grab',
            
            // Font reset
            fontFamily: FONT_FUN,
            fontSize: '14px',
            lineHeight: '1.5',
            color: '#000000',
          }}
          onMouseDown={handleMouseDown}
          onInteractOutside={(e) => e.preventDefault()}
        >
        
        {/* Close button - Bottom Right Corner */}
        <button
          onClick={onClose}
          style={{
            all: 'unset',
            boxSizing: 'border-box',
            position: 'absolute',
            bottom: '8px',
            right: '20px',
            zIndex: 10,
            paddingLeft: '12px',
            paddingRight: '12px',
            paddingTop: '4px',
            paddingBottom: '4px',
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            border: 'none',
            outline: 'none',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          Close
        </button>

        {/* Content Area - Full popup */}
        <div style={{
          all: 'unset',
          boxSizing: 'border-box',
          display: 'block',
          height: '100%',
          padding: '4px',
        }}>
          <div style={{
            all: 'unset',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: 'calc(100% - 8px)',
            width: 'calc(100% - 8px)',
            margin: '0 auto',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '12px',
            padding: '16px',
            backdropFilter: 'blur(4px)',
            border: '1px solid #fed7aa',
          }}>
            {/* Title and Author at top */}
            <div style={{
              all: 'unset',
              boxSizing: 'border-box',
              display: 'block',
              textAlign: 'center',
              marginBottom: '16px',
              paddingTop: '8px',
            }}>
              <h3 style={{
                all: 'unset',
                boxSizing: 'border-box',
                display: 'block',
                fontSize: '20px',
                fontWeight: 'bold',
                fontStyle: 'italic',
                fontFamily: FONT_FUN,
                color: '#F97316',
                margin: '0',
                padding: '0',
                lineHeight: '1.2',
              }}>{title}</h3>
              {showAuthor && author && (
                <p style={{
                  all: 'unset',
                  boxSizing: 'border-box',
                  display: 'block',
                  fontSize: '14px',
                  fontFamily: FONT_FUN,
                  color: '#6b7280',
                  marginTop: '4px',
                  margin: '4px 0 0 0',
                  padding: '0',
                }}>by {author}</p>
              )}
            </div>
            
            {/* Font Control Table */}
            <div style={{flex: 1, display: 'flex', alignItems: 'center'}}>
              <table width={244} cellSpacing={0} cellPadding={0} border={0}>
              <tbody>
                {/* Row 1: Empty for user's idea */}
                <tr>
                  <td colSpan={2} height={27} style={{backgroundColor: 'transparent', borderRadius: '12px 12px 0 0'}} align="center" valign="middle">
                    {/* Left empty for user's special idea */}
                  </td>
                </tr>

                {/* Row 2: Two font size control buttons */}
                <tr>
                  <td width={122} height={55} style={{padding: '0 2.5px 8px 2.5px', backgroundColor: '#2563eb', borderRadius: '0 0 0 12px', textAlign: 'center'}}>
                    <div style={{
                      width: '55px',
                      height: '55px',
                      background: isMinSize ? 'linear-gradient(145deg, #9ca3af, #6b7280)' : 'linear-gradient(145deg, #a16207, #92400e)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.3)',
                      cursor: isMinSize ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease',
                      border: '1px solid rgba(255,255,255,0.2)',
                      transform: 'scale(1)',
                      opacity: isMinSize ? 0.5 : 1,
                      margin: '0 auto'
                    }} 
                    role="button" 
                    aria-label="Decrease font size" 
                    title="Decrease font size"
                    onMouseEnter={(e) => {
                      if (!isMinSize) e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isMinSize) e.currentTarget.style.transform = 'scale(1)';
                    }}
                    onMouseDown={(e) => {
                      if (!isMinSize) e.currentTarget.style.transform = 'scale(0.95)';
                    }}
                     onMouseUp={(e) => {
                       if (!isMinSize) e.currentTarget.style.transform = 'scale(1.1)';
                     }}
                     onClick={isMinSize ? undefined : handleDecrease}>
                       {/* Placeholder minus symbol - will be replaced with chocolate bar image */}
                       <div style={{
                         width: '20px',
                         height: '4px',
                         backgroundColor: 'white',
                         borderRadius: '2px'
                       }}></div>
                     </div>
                  </td>
                  <td width={122} height={55} style={{padding: '0 2.5px 8px 2.5px', backgroundColor: '#2563eb', borderRadius: '0 0 12px 0', textAlign: 'center'}}>
                    <div style={{
                      width: '55px',
                      height: '55px',
                      background: isMaxSize ? 'linear-gradient(145deg, #9ca3af, #6b7280)' : 'linear-gradient(145deg, #a16207, #92400e)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.3)',
                      cursor: isMaxSize ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease',
                      border: '1px solid rgba(255,255,255,0.2)',
                      transform: 'scale(1)',
                      opacity: isMaxSize ? 0.5 : 1,
                      margin: '0 auto'
                    }} 
                    role="button" 
                    aria-label="Increase font size" 
                    title="Increase font size"
                    onMouseEnter={(e) => {
                      if (!isMaxSize) e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isMaxSize) e.currentTarget.style.transform = 'scale(1)';
                    }}
                    onMouseDown={(e) => {
                      if (!isMaxSize) e.currentTarget.style.transform = 'scale(0.95)';
                    }}
                     onMouseUp={(e) => {
                       if (!isMaxSize) e.currentTarget.style.transform = 'scale(1.1)';
                     }}
                     onClick={isMaxSize ? undefined : handleIncrease}>
                       {/* Placeholder plus symbol - will be replaced with chocolate bar image */}
                       <div style={{position: 'relative', width: '20px', height: '20px'}}>
                         <div style={{
                           position: 'absolute',
                           top: '8px',
                           left: '0',
                           width: '20px',
                           height: '4px',
                           backgroundColor: 'white',
                           borderRadius: '2px'
                         }}></div>
                         <div style={{
                           position: 'absolute',
                           top: '0',
                           left: '8px',
                           width: '4px',
                           height: '20px',
                           backgroundColor: 'white',
                           borderRadius: '2px'
                         }}></div>
                       </div>
                     </div>
                  </td>
                </tr>
              </tbody>
              </table>
            </div>
          </div>
        </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};