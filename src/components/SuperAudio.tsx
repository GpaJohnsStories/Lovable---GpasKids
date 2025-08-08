
import React, { useState, useRef, useEffect } from 'react';
import * as DialogPrimitive from "@radix-ui/react-dialog";

// Simplified SuperAudio component - Audio functionality removed

// Font constant from tailwind.config.ts font-fun definition
const FONT_FUN = 'Kalam, "Comic Sans MS", Arial, sans-serif';

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
            fontFamily: FONT_FUN,
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
              {voiceName && (
                <p style={{
                  all: 'unset',
                  boxSizing: 'border-box',
                  display: 'block',
                  fontSize: '12px',
                  fontFamily: FONT_FUN,
                  fontWeight: 'bold',
                  color: '#9ca3af',
                  marginTop: '4px',
                  margin: '4px 0 0 0',
                  padding: '0',
                }}><br />Being read by {voiceName} from OpenAI</p>
              )}
            </div>
            
            
            {/* Table */}
            <table width={244} cellSpacing={0} cellPadding={0} border={0}>
              <tbody>
                {/* Row 1: 4 cells, 27px height, blue fill, labeled */}
                <tr>
                  <td width={60} height={27} style={{backgroundColor: '#2563eb', borderRadius: '12px 0 0 0'}} role="button" aria-label="Play" title="Play" align="center" valign="middle">
                    <b style={{color: 'white', fontFamily: FONT_FUN}}>Play</b>
                  </td>
                  <td width={60} height={27} style={{backgroundColor: '#2563eb'}} role="button" aria-label="Pause" title="Pause" align="center" valign="middle">
                    <b style={{color: 'white', fontFamily: FONT_FUN}}>Pause</b>
                  </td>
                  <td width={60} height={27} style={{backgroundColor: '#2563eb'}} role="button" aria-label="Restart" title="Restart" align="center" valign="middle">
                    <b style={{color: 'white', fontFamily: FONT_FUN}}>Restart</b>
                  </td>
                  <td width={60} height={27} style={{backgroundColor: '#2563eb', borderRadius: '0 12px 0 0'}} role="button" aria-label="Stop" title="Stop" align="center" valign="middle">
                    <b style={{color: 'white', fontFamily: FONT_FUN}}>STOP</b>
                  </td>
                </tr>

                {/* Row 2: 4 beautiful buttons with gradients and icons */}
                <tr>
                  <td width={60} height={55} style={{padding: '0 2.5px 8px 2.5px', backgroundColor: '#2563eb', borderRadius: '0 0 0 12px', textAlign: 'center'}}>
                    <div style={{
                      width: '55px',
                      height: '55px',
                      background: 'linear-gradient(145deg, #22c55e, #16a34a)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      border: '1px solid rgba(255,255,255,0.2)',
                      transform: 'scale(1)'
                    }} 
                    role="button" 
                    aria-label="Play" 
                    title="Play"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = 'scale(0.95)';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}>
                      <div style={{
                        width: '0',
                        height: '0',
                        borderLeft: '14px solid white',
                        borderTop: '10px solid transparent',
                        borderBottom: '10px solid transparent',
                        marginLeft: '3px'
                      }}></div>
                    </div>
                  </td>
                  <td width={60} height={55} style={{padding: '0 2.5px 8px 2.5px', backgroundColor: '#2563eb', textAlign: 'center'}}>
                    <div style={{
                      width: '55px',
                      height: '55px',
                      background: 'linear-gradient(145deg, #fbbf24, #f59e0b)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      border: '1px solid rgba(255,255,255,0.2)',
                      transform: 'scale(1)'
                    }} 
                    role="button" 
                    aria-label="Pause" 
                    title="Pause"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = 'scale(0.95)';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}>
                      <div style={{display: 'flex', gap: '4px'}}>
                        <div style={{width: '5px', height: '18px', backgroundColor: 'white', borderRadius: '1px'}}></div>
                        <div style={{width: '5px', height: '18px', backgroundColor: 'white', borderRadius: '1px'}}></div>
                      </div>
                    </div>
                  </td>
                  <td width={60} height={55} style={{padding: '0 2.5px 8px 2.5px', backgroundColor: '#2563eb', textAlign: 'center'}}>
                    <div style={{
                      width: '55px',
                      height: '55px',
                      background: 'linear-gradient(145deg, #3b82f6, #2563eb)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      border: '1px solid rgba(255,255,255,0.2)',
                      transform: 'scale(1)'
                    }} 
                    role="button" 
                    aria-label="Restart" 
                    title="Restart"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = 'scale(0.95)';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}>
                      <div style={{
                        width: '18px',
                        height: '18px',
                        border: '3px solid white',
                        borderRadius: '50%',
                        borderTopColor: 'transparent',
                        borderRightColor: 'transparent',
                        position: 'relative'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '-3px',
                          right: '-6px',
                          width: '0',
                          height: '0',
                          borderLeft: '8px solid white',
                          borderTop: '4px solid transparent',
                          borderBottom: '4px solid transparent'
                        }}></div>
                      </div>
                    </div>
                  </td>
                  <td width={60} height={55} style={{padding: '0 2.5px 8px 2.5px', backgroundColor: '#2563eb', borderRadius: '0 0 12px 0', textAlign: 'center'}}>
                    <div style={{
                      width: '55px',
                      height: '55px',
                      background: 'linear-gradient(145deg, #ef4444, #dc2626)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      border: '1px solid rgba(255,255,255,0.2)',
                      transform: 'scale(1)'
                    }} 
                    role="button" 
                    aria-label="Stop" 
                    title="Stop"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = 'scale(0.95)';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: 'white',
                        borderRadius: '2px'
                      }}></div>
                    </div>
                  </td>
                </tr>

                {/* Row 3: 1 cell, 27px height, transparent */}
                <tr>
                  <td colSpan={4} height={10} style={{backgroundColor: 'transparent', border: 'none'}}></td>
                </tr>

                {/* Row 4: 1 cell, 27px height, brown fill, centered text */}
                <tr>
                  <td colSpan={4} height={27} style={{backgroundColor: '#814d2e'}} align="center" valign="middle">
                    <b style={{color: 'white', fontFamily: FONT_FUN}} aria-label="Playback Speed">Playback Speed</b>
                  </td>
                </tr>

                {/* Row 5: 4 speed control buttons with gradients */}
                <tr>
                  <td width={60} height={55} style={{padding: '0 2.5px 8px 2.5px', backgroundColor: '#814d2e'}}>
                    <div style={{
                      width: '55px',
                      height: '55px',
                      background: 'linear-gradient(145deg, #22c55e, #16a34a)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      border: '1px solid rgba(255,255,255,0.2)',
                      transform: 'scale(1)'
                    }} 
                    role="button" 
                    aria-label="Normal Speed" 
                    title="Normal Speed"
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.1)'}>
                      <span style={{fontFamily: FONT_FUN, fontWeight: 'bold', fontSize: '13px', color: '#814d2e'}}>Normal</span>
                    </div>
                  </td>
                  <td width={60} height={55} style={{padding: '0 2.5px 8px 2.5px', backgroundColor: '#814d2e'}}>
                    <div style={{
                      width: '55px',
                      height: '55px',
                      background: 'linear-gradient(145deg, #22c55e, #16a34a)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      border: '1px solid rgba(255,255,255,0.2)',
                      transform: 'scale(1)'
                    }} 
                    role="button" 
                    aria-label="Fast Speed" 
                    title="Fast Speed"
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.1)'}>
                      <span style={{fontFamily: FONT_FUN, fontWeight: 'bold', fontSize: '13px', color: 'white'}}>Fast</span>
                    </div>
                  </td>
                  <td width={60} height={55} style={{padding: '0 2.5px 8px 2.5px', backgroundColor: '#814d2e'}}>
                    <div style={{
                      width: '55px',
                      height: '55px',
                      background: 'linear-gradient(145deg, #22c55e, #16a34a)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      border: '1px solid rgba(255,255,255,0.2)',
                      transform: 'scale(1)'
                    }} 
                    role="button" 
                    aria-label="Faster Speed" 
                    title="Faster Speed"
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.1)'}>
                      <span style={{fontFamily: FONT_FUN, fontWeight: 'bold', fontSize: '13px', color: 'white'}}>Faster</span>
                    </div>
                  </td>
                  <td width={60} height={55} style={{padding: '0 2.5px 8px 2.5px', backgroundColor: '#814d2e'}}>
                    <div style={{
                      width: '55px',
                      height: '55px',
                      background: 'linear-gradient(145deg, #22c55e, #16a34a)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      border: '1px solid rgba(255,255,255,0.2)',
                      transform: 'scale(1)'
                    }} 
                    role="button" 
                    aria-label="Fastest Speed" 
                    title="Fastest Speed"
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.1)'}>
                      <span style={{fontFamily: FONT_FUN, fontWeight: 'bold', fontSize: '13px', color: '#F2BA15'}}>Fastest</span>
                    </div>
                  </td>
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
