
import React, { useState, useRef, useEffect } from 'react';
import * as DialogPrimitive from "@radix-ui/react-dialog";

// Simplified SuperAudio component - Audio functionality removed

interface SuperAudioProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  author?: string;
  voiceName?: string;
  showAuthor?: boolean;
}

export const SuperAudio: React.FC<SuperAudioProps> = ({
  isOpen,
  onClose,
  title,
  author,
  voiceName,
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
            height: '380px',
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
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '14px',
            lineHeight: '1.5',
            color: '#000000',
          }}
          onMouseDown={handleMouseDown}
          onInteractOutside={(e) => e.preventDefault()}
        >
        
        {/* Close button - Top Right Corner */}
        <button
          onClick={onClose}
          style={{
            all: 'unset',
            boxSizing: 'border-box',
            position: 'absolute',
            top: '8px',
            right: '16px',
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
            display: 'block',
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
                  color: '#6b7280',
                  marginTop: '4px',
                  margin: '4px 0 0 0',
                  padding: '0',
                }}>by {author}</p>
              )}
              {voiceName && (
                <p style={{
                  all: 'unset',
                  boxSizing: 'border-box',
                  display: 'block',
                  fontSize: '12px',
                  color: '#9ca3af',
                  marginTop: '4px',
                  margin: '4px 0 0 0',
                  padding: '0',
                }}><br />Being read by {voiceName} from OpenAI</p>
              )}
            </div>
            
            
            {/* Table */}
            <table width={220} cellSpacing={0} cellPadding={0} border={0}>
              <tbody>
                {/* Row 1: 4 cells, 27px height, blue fill, labeled */}
                <tr>
                  <td width={55} height={27} style={{backgroundColor: '#2563eb'}} role="button" aria-label="Play" title="Play"></td>
                  <td width={55} height={27} style={{backgroundColor: '#2563eb'}} role="button" aria-label="Pause" title="Pause"></td>
                  <td width={55} height={27} style={{backgroundColor: '#2563eb'}} role="button" aria-label="Restart" title="Restart"></td>
                  <td width={55} height={27} style={{backgroundColor: '#2563eb'}} role="button" aria-label="Stop" title="Stop"></td>
                </tr>

                {/* Row 2: 4 cells, 55px x 55px, blue fill */}
                <tr>
                  <td width={55} height={55} style={{backgroundColor: '#2563eb'}}></td>
                  <td width={55} height={55} style={{backgroundColor: '#2563eb'}}></td>
                  <td width={55} height={55} style={{backgroundColor: '#2563eb'}}></td>
                  <td width={55} height={55} style={{backgroundColor: '#2563eb'}}></td>
                </tr>

                {/* Row 3: 1 cell, 27px height, transparent */}
                <tr>
                  <td colSpan={4} height={27} style={{backgroundColor: 'transparent', border: 'none'}}></td>
                </tr>

                {/* Row 4: 1 cell, 27px height, brown fill, centered text */}
                <tr>
                  <td colSpan={4} height={27} style={{backgroundColor: '#814d2e'}} align="center" valign="middle">
                    <span style={{color: 'white'}} aria-label="Playback Speed">Playback Speed</span>
                  </td>
                </tr>

                {/* Row 5: 4 cells, 55px height, brown fill */}
                <tr>
                  <td width={55} height={55} style={{backgroundColor: '#814d2e'}}></td>
                  <td width={55} height={55} style={{backgroundColor: '#814d2e'}}></td>
                  <td width={55} height={55} style={{backgroundColor: '#814d2e'}}></td>
                  <td width={55} height={55} style={{backgroundColor: '#814d2e'}}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
