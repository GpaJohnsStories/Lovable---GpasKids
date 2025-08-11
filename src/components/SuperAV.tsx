
import React, { useState, useRef, useEffect, useId } from 'react';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { RefreshCw } from "lucide-react";
import { useSuperAVContext } from '@/contexts/SuperAVContext';
import { useCachedIcon } from '@/hooks/useCachedIcon';
import { 
  FontScaleStep, 
  DEFAULT_FONT_SCALE, 
  getNextLargerScale, 
  getNextSmallerScale, 
  isMinScale, 
  isMaxScale,
  getScaleDisplayName,
  pixelSizeToScale
} from '@/utils/fontScaleUtils';

// SuperAV component - Unified audio and font controls

// Font constant from tailwind.config.ts font-fun definition
const FONT_FUN = 'Kalam, "Comic Sans MS", Arial, sans-serif';

// Custom Arrow Icon Component
const CustomArrowIcon: React.FC = () => {
  const { iconUrl, isLoading, error } = useCachedIcon('ICO-ARR.gif');
  
  if (isLoading) return <div style={{ width: '40px', height: '40px' }} />;
  if (error || !iconUrl) return <div style={{ width: '40px', height: '40px', background: '#814d2e' }} />;
  
  return (
    <img 
      src={iconUrl} 
      alt="Arrow" 
      style={{ 
        height: '40px', 
        width: '40px',
        objectFit: 'contain'
      }} 
    />
  );
};

// Custom CCP Icon Component for bigger size button
const CustomCCPIcon: React.FC = () => {
  const { iconUrl, isLoading, error } = useCachedIcon('ICO-CCP.png');
  
  if (isLoading) return <div style={{ width: '45px', height: '45px' }} />;
  if (error || !iconUrl) return <span>BIGGER</span>;
  
  return (
    <img 
      src={iconUrl} 
      alt="Make Bigger" 
      style={{ 
        height: '45px', 
        width: '45px',
        objectFit: 'contain'
      }} 
    />
  );
};

interface SuperAVProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  author?: string;
  voiceName?: string;
  showAuthor?: boolean;
  audioUrl?: string;
  fontSize?: number;
  onFontSizeChange?: (newSize: number) => void;
  fontScale?: FontScaleStep;
  onFontScaleChange?: (newScale: FontScaleStep) => void;
}

export const SuperAV: React.FC<SuperAVProps> = ({
  isOpen,
  onClose,
  title,
  author,
  voiceName,
  showAuthor = true,
  audioUrl,
  fontSize = 16,
  onFontSizeChange,
  fontScale,
  onFontScaleChange,
}) => {
  // Convert legacy fontSize to scale if using old system
  const [currentScale, setCurrentScale] = useState<FontScaleStep>(() => {
    if (fontScale) return fontScale;
    return pixelSizeToScale(fontSize);
  });
  const instanceId = useId();
  const superAVContext = useSuperAVContext();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Register/unregister with context when isOpen changes
  useEffect(() => {
    if (isOpen) {
      superAVContext.registerInstance(instanceId, onClose);
    } else {
      superAVContext.unregisterInstance(instanceId);
    }

    return () => {
      superAVContext.unregisterInstance(instanceId);
    };
  }, [isOpen, instanceId, onClose, superAVContext]);

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


  // Audio control functions
  const handlePlay = () => {
    if (audioRef.current && audioUrl) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
      setPlaybackRate(speed);
    }
  };

  // Font scale control functions
  const handleScaleIncrease = () => {
    const nextScale = getNextLargerScale(currentScale);
    setCurrentScale(nextScale);
    
    // Call both callbacks for backward compatibility
    if (onFontScaleChange) {
      onFontScaleChange(nextScale);
    }
    if (onFontSizeChange) {
      // Convert scale to approximate pixel size for legacy components
      const pixelSizes = { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30, '4xl': 36 };
      onFontSizeChange(pixelSizes[nextScale] || 16);
    }
  };

  const handleScaleDecrease = () => {
    const nextScale = getNextSmallerScale(currentScale);
    setCurrentScale(nextScale);
    
    // Call both callbacks for backward compatibility
    if (onFontScaleChange) {
      onFontScaleChange(nextScale);
    }
    if (onFontSizeChange) {
      // Convert scale to approximate pixel size for legacy components
      const pixelSizes = { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30, '4xl': 36 };
      onFontSizeChange(pixelSizes[nextScale] || 16);
    }
  };

  // Update current scale when fontScale prop changes
  useEffect(() => {
    if (fontScale && fontScale !== currentScale) {
      setCurrentScale(fontScale);
    }
  }, [fontScale, currentScale]);

  const isMinSize = isMinScale(currentScale);
  const isMaxSize = isMaxScale(currentScale);

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

  // Audio event handlers
  React.useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => setIsPlaying(false);
      const handlePause = () => setIsPlaying(false);
      const handlePlay = () => setIsPlaying(true);
      
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('play', handlePlay);
      
      return () => {
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('play', handlePlay);
      };
    }
  }, [audioUrl]);

  

  // Custom click handler for document to handle passthrough elements
  useEffect(() => {
    if (!isOpen) return;

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as Element;
      const dialogElement = dialogRef.current;
      
      // Check if click is inside SuperAV dialog
      if (dialogElement && dialogElement.contains(target)) {
        return; // Let SuperAV handle its own clicks
      }
      
      // Check if click is on a passthrough element
      const passthroughElement = target.closest('[data-allow-superav-passthrough="true"]');
      
      if (passthroughElement) {
        console.log('🎯 Passthrough element clicked:', passthroughElement);
        
        // Close SuperAV
        onClose();
        
        // Handle specific actions based on aria-label
        const ariaLabel = passthroughElement.getAttribute('aria-label') || '';
        
        if (ariaLabel.includes('Scroll')) {
          console.log('📜 Triggering scroll to top');
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 100);
        } else if (ariaLabel.includes('Menu')) {
          console.log('🎮 Triggering menu click');
          setTimeout(() => {
            // Find the button and trigger its click handler
            const button = passthroughElement as HTMLButtonElement;
            button.click();
          }, 100);
        }
      } else {
        // Normal click outside - close dialog
        onClose();
      }
    };

    // Add event listener to document
    document.addEventListener('click', handleDocumentClick, true);
    
    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
    };
  }, [isOpen, onClose]);

  return (
    <div>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 49,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          />
          {/* SuperAV Dialog */}
          <div 
            ref={dialogRef}
            style={{
              // CSS Reset for complete isolation
              all: 'unset',
              boxSizing: 'border-box',
              
              // Position and size
              position: 'fixed',
              width: '288px',
              height: '490px',
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
          >
        
        {/* Close button positioned at bottom after font size buttons */}

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
            <div style={{flex: 1, display: 'flex', alignItems: 'center'}}>
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
                     }}
                     onClick={handlePlay}>
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
                     }}
                     onClick={handlePause}>
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
                      background: 'linear-gradient(145deg, #fb923c, #F97316)',
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
                     }}
                     onClick={handleRestart}>
                        <RefreshCw size={20} color="white" strokeWidth={2.5} />
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
                     }}
                     onClick={handleStop}>
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
                  <td colSpan={4} height={27} style={{backgroundColor: '#814d2e', borderRadius: '12px 12px 0 0'}} align="center" valign="middle">
                    <b style={{color: 'white', fontFamily: FONT_FUN}} aria-label="Playback Speed">Playback Speed</b>
                  </td>
                </tr>

                {/* Row 5: 4 speed control buttons with gradients */}
                <tr>
                  <td width={60} height={55} style={{padding: '0 2.5px 8px 2.5px', backgroundColor: '#814d2e', borderRadius: '0 0 0 12px'}}>
                    <div style={{
                      width: '55px',
                      height: '55px',
                      background: 'linear-gradient(145deg, #86efac, #65d997)',
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
                     onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                     onClick={() => handleSpeedChange(1)}>
                       <span style={{fontFamily: FONT_FUN, fontWeight: 'bold', fontSize: '13px', color: '#814d2e'}}>Normal</span>
                     </div>
                  </td>
                  <td width={60} height={55} style={{padding: '0 2.5px 8px 2.5px', backgroundColor: '#814d2e'}}>
                    <div style={{
                      width: '55px',
                      height: '55px',
                      background: 'linear-gradient(145deg, #4ade80, #22c55e)',
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
                     onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                     onClick={() => handleSpeedChange(1.25)}>
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
                     onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                     onClick={() => handleSpeedChange(1.5)}>
                       <span style={{fontFamily: FONT_FUN, fontWeight: 'bold', fontSize: '13px', color: 'white'}}>Faster</span>
                     </div>
                  </td>
                  <td width={60} height={55} style={{padding: '0 2.5px 8px 2.5px', backgroundColor: '#814d2e', borderRadius: '0 0 12px 0'}}>
                    <div style={{
                      width: '55px',
                      height: '55px',
                      background: 'linear-gradient(145deg, #16a34a, #15803d)',
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
                     onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                     onClick={() => handleSpeedChange(2)}>
                       <span style={{fontFamily: FONT_FUN, fontWeight: 'bold', fontSize: '13px', color: '#F2BA15'}}>Fastest</span>
                     </div>
                    </td>
                  </tr>

                  {/* Row 6: Font Size Section Gap */}
                  <tr>
                    <td colSpan={4} height={10} style={{backgroundColor: 'transparent', border: 'none'}}></td>
                  </tr>

                  {/* Row 7: Font Size Control Section - New Flex Layout */}
                  <tr>
                    <td colSpan={4} height={55} style={{padding: '8px', backgroundColor: 'white', border: '2px solid orange', borderRadius: '12px'}}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: '100%',
                        width: '100%'
                      }}>
                        {/* Left side: Text + Arrow */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontFamily: FONT_FUN,
                          fontWeight: 'bold',
                          fontSize: '14px',
                          color: '#814d2e'
                        }}>
                          <span>Change word size</span>
                          <CustomArrowIcon />
                        </div>
                        
                        {/* Right side: Two 55x55 buttons */}
                        <div style={{
                          display: 'flex',
                          gap: '5px'
                        }}>
                          <div 
                            className={`button-3d-base button-3d-standard ${isMaxSize ? 'opacity-60' : ''}`}
                            role="button" 
                            aria-label="Increase Font Size" 
                            title="Increase Font Size"
                            style={{
                              cursor: isMaxSize ? 'not-allowed' : 'pointer',
                              opacity: isMaxSize ? 0.6 : 1,
                              pointerEvents: isMaxSize ? 'none' : 'auto'
                            }}
                            onClick={!isMaxSize ? handleScaleIncrease : undefined}>
                             <CustomCCPIcon />
                          </div>
                          
                          <div 
                            className={`button-3d-base button-3d-standard ${isMinSize ? 'opacity-60' : ''}`}
                            role="button" 
                            aria-label="Decrease Font Size" 
                            title="Decrease Font Size"
                            style={{
                              cursor: isMinSize ? 'not-allowed' : 'pointer',
                              opacity: isMinSize ? 0.6 : 1,
                              pointerEvents: isMinSize ? 'none' : 'auto'
                            }}
                            onClick={!isMinSize ? handleScaleDecrease : undefined}>
                            <CustomCCPIcon />
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
             </table>
             </div>
             
             {/* Close button positioned below font size buttons */}
             <div style={{
               all: 'unset',
               boxSizing: 'border-box',
               display: 'flex',
               justifyContent: 'center',
               marginTop: '12px',
               marginBottom: '8px'
             }}>
               <button
                 onClick={onClose}
                 style={{
                   all: 'unset',
                   boxSizing: 'border-box',
                   paddingLeft: '40px',
                   paddingRight: '40px',
                    paddingTop: '2px',
                    paddingBottom: '2px',
                   backgroundColor: '#F97316',
                   color: 'white',
                   borderRadius: '8px',
                   fontWeight: 'bold',
                    fontSize: '23px',
                   fontFamily: FONT_FUN,
                   cursor: 'pointer',
                   transition: 'background-color 0.2s ease',
                   border: 'none',
                   outline: 'none',
                 }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e35507'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F97316'}
               >
                 Close
               </button>
             </div>
           </div>
         </div>
         
         {/* Hidden audio element */}
         {audioUrl && (
           <audio ref={audioRef} preload="metadata">
             <source src={audioUrl} type="audio/mpeg" />
             <source src={audioUrl} type="audio/mp3" />
             <source src={audioUrl} type="audio/wav" />
             Your browser does not support the audio element.
            </audio>
          )}
          
          </div>
        </>
      )}
    </div>
  );
};
