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
              <table 
                style={{
                  borderCollapse: 'separate',
                  borderSpacing: '0',
                  border: '2px solid gold',
                  margin: '10px auto',
                  width: '110px',
                  height: '83px'
                }}
              >
                <tbody>
                  <tr>
                    <td colSpan={2} width={110} height={28} style={{padding: '0'}}>
                      {/* Empty top row */}
                    </td>
                  </tr>
                  <tr>
                    <td width={55} height={55} style={{padding: '0', textAlign: 'center'}}>
                      <img 
                        src="/lovable-uploads/ICO-CCM.png"
                        alt="Decrease font size"
                        style={{
                          width: '55px',
                          height: '55px',
                          objectFit: 'contain',
                          cursor: isMinSize ? 'not-allowed' : 'pointer',
                          opacity: isMinSize ? 0.5 : 1
                        }}
                        onClick={!isMinSize ? handleDecrease : undefined}
                        role="button"
                        tabIndex={isMinSize ? -1 : 0}
                        aria-label="Decrease font size"
                        aria-disabled={isMinSize}
                        onKeyDown={(e) => {
                          if ((e.key === 'Enter' || e.key === ' ') && !isMinSize) {
                            e.preventDefault();
                            handleDecrease();
                          }
                        }}
                      />
                    </td>
                    <td width={55} height={55} style={{padding: '0', textAlign: 'center'}}>
                      <img 
                        src="/lovable-uploads/ICO-CCP.png"
                        alt="Increase font size"
                        style={{
                          width: '55px',
                          height: '55px',
                          objectFit: 'contain',
                          cursor: isMaxSize ? 'not-allowed' : 'pointer',
                          opacity: isMaxSize ? 0.5 : 1
                        }}
                        onClick={!isMaxSize ? handleIncrease : undefined}
                        role="button"
                        tabIndex={isMaxSize ? -1 : 0}
                        aria-label="Increase font size"
                        aria-disabled={isMaxSize}
                        onKeyDown={(e) => {
                          if ((e.key === 'Enter' || e.key === ' ') && !isMaxSize) {
                            e.preventDefault();
                            handleIncrease();
                          }
                        }}
                      />
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