
import React, { useState, useRef, useEffect, useId } from 'react';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { RefreshCw } from "lucide-react";
import { useSuperAVContext } from '@/contexts/SuperAVContext';
import { useCachedIcon } from '@/hooks/useCachedIcon';
import { useStoryCodeLookup } from '@/hooks/useStoryCodeLookup';
import { createSafeHtml } from '@/utils/xssProtection';
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

// Custom Play Icon Component
const CustomPlayIcon: React.FC = () => {
  const { iconUrl, isLoading, error } = useCachedIcon('!CO-AV1.jpg');
  
  if (isLoading) return <div className="w-full h-full" />;
  if (error || !iconUrl) return <span>!CO-AV1</span>;
  
  return (
    <img 
      src={iconUrl} 
      alt="Play" 
      className="w-full h-full object-contain"
    />
  );
};

// Custom Pause Icon Component
const CustomPauseIcon: React.FC = () => {
  const { iconUrl, isLoading, error } = useCachedIcon('!CO-AV2.jpg');
  
  if (isLoading) return <div className="w-full h-full" />;
  if (error || !iconUrl) return <span>!CO-AV2</span>;
  
  return (
    <img 
      src={iconUrl} 
      alt="Pause" 
      className="w-full h-full object-contain"
    />
  );
};

// Custom Restart Icon Component
const CustomRestartIcon: React.FC = () => {
  const { iconUrl, isLoading, error } = useCachedIcon('!CO-AV3.jpg');
  
  if (isLoading) return <div className="w-full h-full" />;
  if (error || !iconUrl) return <span>!CO-AV3</span>;
  
  return (
    <img 
      src={iconUrl} 
      alt="Restart" 
      className="w-full h-full object-contain"
    />
  );
};

// Custom Stop Icon Component
const CustomStopIcon: React.FC = () => {
  const { iconUrl, isLoading, error } = useCachedIcon('!CO-AV4.jpg');
  
  if (isLoading) return <div className="w-full h-full" />;
  if (error || !iconUrl) return <span>!CO-AV4</span>;
  
  return (
    <img 
      src={iconUrl} 
      alt="Stop" 
      className="w-full h-full object-contain"
    />
  );
};

// Custom Speed Icon Components
const CustomSpeedNormalIcon: React.FC = () => {
  const { iconUrl, isLoading, error } = useCachedIcon('!CO-AV5.jpg');
  
  if (isLoading) return <div className="w-full h-full" />;
  if (error || !iconUrl) return <span>!CO-AV5</span>;
  
  return (
    <img 
      src={iconUrl} 
      alt="Normal Speed" 
      className="w-full h-full object-contain"
    />
  );
};

const CustomSpeedFastIcon: React.FC = () => {
  const { iconUrl, isLoading, error } = useCachedIcon('!CO-AV6.jpg');
  
  if (isLoading) return <div className="w-full h-full" />;
  if (error || !iconUrl) return <span>!CO-AV6</span>;
  
  return (
    <img 
      src={iconUrl} 
      alt="Fast Speed" 
      className="w-full h-full object-contain"
    />
  );
};

const CustomSpeedFasterIcon: React.FC = () => {
  const { iconUrl, isLoading, error } = useCachedIcon('!CO-AV7.jpg');
  
  if (isLoading) return <div className="w-full h-full" />;
  if (error || !iconUrl) return <span>!CO-AV7</span>;
  
  return (
    <img 
      src={iconUrl} 
      alt="Faster Speed" 
      className="w-full h-full object-contain"
    />
  );
};

const CustomSpeedFastestIcon: React.FC = () => {
  const { iconUrl, isLoading, error } = useCachedIcon('!CO-AV8.jpg');
  
  if (isLoading) return <div className="w-full h-full" />;
  if (error || !iconUrl) return <span>!CO-AV8</span>;
  
  return (
    <img 
      src={iconUrl} 
      alt="Fastest Speed" 
      className="w-full h-full object-contain"
    />
  );
};

const CustomCCPIcon: React.FC = () => {
  const { iconUrl, isLoading, error } = useCachedIcon('!ICO-CCP.png');
  
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

// Custom CCM Icon Component for smaller size button
const CustomCCMIcon: React.FC = () => {
  const { iconUrl, isLoading, error } = useCachedIcon('!ICO-CCM.png');
  
  if (isLoading) return <div style={{ width: '45px', height: '45px' }} />;
  if (error || !iconUrl) return <span>smaller</span>;
  
  return (
    <img 
      src={iconUrl} 
      alt="Make Smaller" 
      style={{ 
        height: '45px', 
        width: '45px',
        objectFit: 'contain'
      }} 
    />
  );
};

// Custom CWS Icon Component for change word size
const CustomCWSIcon: React.FC = () => {
  const { iconUrl, isLoading, error } = useCachedIcon('!ICO-CSZ.jpg');
  
  if (isLoading) return <div style={{ width: '55px', height: '55px' }} />;
  if (error || !iconUrl) return <span style={{ fontSize: '12px' }}>Size</span>;
  
  return (
    <img 
      src={iconUrl} 
      alt="Change word size" 
      style={{ 
        height: '45px', 
        width: 'auto',
        objectFit: 'contain'
      }} 
    />
  );
};

// Reusable CachedIcon component for size controls
interface CachedIconProps {
  iconCode: string;
  fallback: React.ReactNode;
  style?: React.CSSProperties;
}

const CachedIcon: React.FC<CachedIconProps> = ({ iconCode, fallback, style }) => {
  const { iconUrl, isLoading, error } = useCachedIcon(iconCode);
  
  if (isLoading) return <div style={style} />;
  if (error || !iconUrl) return <>{fallback}</>;
  
  return (
    <img 
      src={iconUrl} 
      alt={iconCode} 
      style={style}
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
  const [playbackRate, setPlaybackRate] = useState(1.0); // Default to normal speed (1.0) since audio is recorded at 0.5
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // SYS-AVX fallback state
  const [useSysAvx, setUseSysAvx] = useState(false);
  const [sysAvx, setSysAvx] = useState<{
    title: string;
    content: string;
    audioUrl: string;
    photoUrl?: string;
    photoAlt?: string;
  } | null>(null);
  
  const { lookupStoryByCode } = useStoryCodeLookup();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Register/unregister with context when isOpen changes
  useEffect(() => {
    if (isOpen) {
      superAVContext.registerInstance(instanceId, onClose);
    } else {
      superAVContext.unregisterInstance(instanceId);
      // Reset SYS-AVX state when closing
      setUseSysAvx(false);
      setSysAvx(null);
    }

    return () => {
      superAVContext.unregisterInstance(instanceId);
    };
  }, [isOpen, instanceId, onClose, superAVContext]);

  // Load SYS-AVX when needed (no audio URL provided)
  useEffect(() => {
    if (isOpen && !audioUrl) {
      console.log('🔧 No audio URL provided, looking up SYS-AVX fallback');
      lookupStoryByCode('SYS-AVX', true).then(result => {
        if (result.found && result.story?.audio_url) {
          console.log('✅ SYS-AVX found with audio:', result.story);
          setSysAvx({
            title: result.story.title || 'SYS-AVX',
            content: result.story.content || '',
            audioUrl: result.story.audio_url,
            photoUrl: result.story.photo_link_1,
            photoAlt: result.story.photo_alt_1 || 'Buddy with headphones'
          });
          setUseSysAvx(true);
        } else {
          console.warn('⚠️ SYS-AVX not found or missing audio, keeping normal UI');
        }
      });
    } else if (isOpen && audioUrl) {
      // Reset SYS-AVX state when we have a regular audio URL
      setUseSysAvx(false);
      setSysAvx(null);
    }
  }, [isOpen, audioUrl, lookupStoryByCode]);

  // Auto-play SYS-AVX audio when it becomes available
  useEffect(() => {
    if (useSysAvx && sysAvx?.audioUrl && audioRef.current) {
      console.log('🎵 Auto-playing SYS-AVX audio at speed 1.0');
      audioRef.current.playbackRate = 1.0;
      setPlaybackRate(1.0);
      audioRef.current.play().catch(error => {
        console.warn('⚠️ Auto-play blocked:', error);
      });
    }
  }, [useSysAvx, sysAvx]);

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
    if (audioRef.current && (audioUrl || sysAvx?.audioUrl)) {
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
  }, [audioUrl, sysAvx?.audioUrl]);

  

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

  console.log('🎬 SuperAV render - isOpen:', isOpen, 'title:', title);
  
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
              background: '#D4C89A',
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
            backgroundColor: '#D4C89A',
            borderRadius: '12px',
            padding: '8px',
            backdropFilter: 'blur(4px)',
            border: '1px solid #fed7aa',
            backgroundImage: 'url(/lovable-uploads/paper-texture.png)',
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
            backgroundBlendMode: 'soft-light',
            position: 'relative',
          }}>
            {/* Paper texture overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url(/lovable-uploads/paper-texture.png)',
              backgroundRepeat: 'repeat',
              backgroundSize: '200px 200px',
              opacity: 0.15,
              mixBlendMode: 'soft-light',
              pointerEvents: 'none',
              borderRadius: '12px',
            }} />
            {/* Fixed-height text containers at top with brown border */}
             <div className="playback-controls-section" style={{
               width: '252px',
               marginBottom: '0px',
               border: '2px solid #5A3E2B',
               boxShadow: 'inset 0 0 0 2px #A67C52, inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)'
             }}>
               {useSysAvx && sysAvx ? (
                 /* SYS-AVX layout with photo and text */
                  <div style={{
                    padding: '0px 8px 2px 0px', // 0px top, 8px right, 2px bottom, 0px left
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px' // Reduced gap to 2px
                  }}>
                   <div style={{
                     display: 'flex',
                     gap: '8px',
                     alignItems: 'flex-start'
                   }}>
                     {/* Photo in upper-left */}
                     {sysAvx.photoUrl && (
                       <div style={{ 
                         flexShrink: 0,
                         maxHeight: '220px' // About half of SuperAV popup height
                       }}>
                         <img 
                           src={sysAvx.photoUrl}
                           alt={sysAvx.photoAlt || 'Buddy with headphones'}
                            style={{
                              width: '45px',
                              height: '45px',
                              objectFit: 'contain',
                              display: 'block'
                            }}
                         />
                       </div>
                     )}
                     
                     {/* First sentence and first half of second sentence - to buddy's right */}
                     <div style={{
                       flex: 1,
                       minWidth: 0 // Allow shrinking
                     }}>
                       <div 
                         style={{
                           fontSize: `${currentScale === 'xs' ? '12px' : 
                                      currentScale === 'sm' ? '14px' :
                                      currentScale === 'base' ? '16px' :
                                      currentScale === 'lg' ? '18px' :
                                      currentScale === 'xl' ? '20px' :
                                      currentScale === '2xl' ? '24px' :
                                      currentScale === '3xl' ? '30px' :
                                      currentScale === '4xl' ? '36px' : '16px'}`,
                           fontFamily: FONT_FUN,
                           color: '#654321',
                           lineHeight: '1.4',
                           wordWrap: 'break-word',
                           overflowWrap: 'break-word'
                         }}
                       >
                         There is no audio file for this page yet. But your word size
                       </div>
                     </div>
                   </div>
                   
                   {/* Second half of second sentence - below buddy at left margin */}
                   <div style={{
                     marginTop: '2px' // Reduced to 2px
                   }}>
                     <div 
                       style={{
                         fontSize: `${currentScale === 'xs' ? '12px' : 
                                    currentScale === 'sm' ? '14px' :
                                    currentScale === 'base' ? '16px' :
                                    currentScale === 'lg' ? '18px' :
                                    currentScale === 'xl' ? '20px' :
                                    currentScale === '2xl' ? '24px' :
                                    currentScale === '3xl' ? '30px' :
                                    currentScale === '4xl' ? '36px' : '16px'}`,
                         fontFamily: FONT_FUN,
                         color: '#654321',
                         lineHeight: '1.4',
                         wordWrap: 'break-word',
                         overflowWrap: 'break-word'
                       }}
                     >
                       buttons below still work just fine.
                     </div>
                   </div>
                 </div>
               ) : (
                 /* Normal title/author layout */
                 <>
                   {/* Title container */}
                   <div style={{
                       minHeight: '60px',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       marginBottom: '12px'
                     }}>
                        <h3 style={{
                          all: 'unset',
                          boxSizing: 'border-box',
                          display: '-webkit-box',
                          fontSize: '18px',
                          fontWeight: 'bold',
                          fontStyle: 'italic',
                          fontFamily: FONT_FUN,
                           color: '#F97316',
                          margin: '0',
                          padding: '0',
                          lineHeight: '1.3',
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          textAlign: 'center',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>{title}</h3>
                     </div>
                     
                     {/* Author and Voice Info */}
                     <div style={{
                       borderTop: '1px solid rgba(184, 134, 11, 0.3)',
                       paddingTop: '8px',
                       textAlign: 'center'
                     }}>
                       {showAuthor && author && (
                         <p style={{
                           all: 'unset',
                           boxSizing: 'border-box',
                           display: 'block',
                           fontSize: '14px',
                           fontFamily: FONT_FUN,
                           color: '#654321',
                           margin: '0 0 4px 0',
                           padding: '0',
                           lineHeight: '1.2'
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
                           color: '#8B4513',
                           margin: '0',
                           padding: '0',
                           lineHeight: '1.2'
                         }}>Being read by {voiceName} from OpenAI</p>
                       )}
                     </div>
                 </>
               )}
               </div>
             
             {/* Table with simplified positioning */}
            <div style={{flex: 1, display: 'flex', alignItems: 'center', marginTop: '1px'}}>
              <table width={244} cellSpacing={0} cellPadding={0} border={0}>
              <tbody>

                {/* Row 1 & 2: Playback Controls Header and Buttons - Merged */}
                <tr>
                   <td colSpan={4} className="playback-controls-section" style={{ border: 'none', boxShadow: 'none', background: 'transparent', padding: 0 }}>
                      <div className="playback-controls-inner">
                          {/* Header */}
                           <div style={{
                             height: '27px',
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center',
                             borderRadius: '9px 9px 0 0'
                           }}>
                           <b style={{color: '#8B4513', fontFamily: FONT_FUN}} aria-label="Playback Control">Playback Control</b>
                         </div>
                         
                          {/* Control buttons row */}
                           <div style={{
                             height: '65px',
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'space-between',
                             padding: '4px 2.5px 8px 2.5px',
                             borderRadius: '0 0 9px 9px'
                           }}>
                           {/* Play Button */}
                            <div 
                              className="button-3d-base button-3d-60px-square button-3d-green"
                              role="button" 
                              aria-label="Play Audio" 
                              title="Play Audio"
                              style={{
                                cursor: 'pointer'
                              }}
                              onClick={handlePlay}>
                                <CustomPlayIcon />
                              </div>
                           
                           {/* Pause Button */}
                            <div 
                              className="button-3d-base button-3d-60px-square button-3d-amber"
                              role="button" 
                              aria-label="Pause Audio" 
                              title="Pause Audio"
                              style={{
                                cursor: 'pointer'
                              }}
                              onClick={handlePause}>
                                <CustomPauseIcon />
                              </div>
                           
                            {/* Restart Button */}
                             <div 
                               className="button-3d-base button-3d-60px-square button-3d-orange"
                               role="button" 
                               aria-label="Restart Audio" 
                               title="Restart Audio"
                               style={{
                                 cursor: 'pointer'
                               }}
                               onClick={handleRestart}>
                                 <CustomRestartIcon />
                               </div>
                            
                            {/* Stop Button */}
                             <div 
                               className="button-3d-base button-3d-60px-square button-3d-red"
                               role="button" 
                               aria-label="Stop Audio" 
                               title="Stop Audio"
                               style={{
                                 cursor: 'pointer'
                               }}
                               onClick={handleStop}>
                                 <CustomStopIcon />
                               </div>
                         </div>
                       </div>
                   </td>
                </tr>

                {/* Row 3: 1 cell, 27px height, transparent */}
                <tr>
                   <td colSpan={4} height={1} style={{backgroundColor: 'transparent', border: 'none'}}></td>
                </tr>

                {/* Row 4 & 5: Playbook Speed Section - Using same style as word size controls */}
                <tr>
                   <td colSpan={4} style={{
                     padding: '3px', 
                     background: '#D4C89A',
                     borderRadius: '12px'
                    }}>
                       <div style={{
                         backgroundColor: '#D4C89A',
                         borderRadius: '9px',
                         height: '100%'
                        }}>
                          {/* Header */}
                           <div style={{
                             height: '27px',
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center',
                             borderTopLeftRadius: '9px',
                             borderTopRightRadius: '9px'
                           }}>
                           <b style={{color: '#8B4513', fontFamily: FONT_FUN}} aria-label="Playback Speed">Playback Speed</b>
                         </div>
                        
                          {/* Speed buttons row */}
                           <div style={{
                             height: '60px',
                             display: 'grid',
                             gridTemplateColumns: '120px 60px 60px',
                             gap: '0px',
                             alignItems: 'start',
                             borderBottomLeftRadius: '9px',
                             borderBottomRightRadius: '9px'
                           }}>
                             {/* Normal Speed - exact same size as Change Word Size label */}
                              <div 
                                className="button-3d-base button-3d-60px-square button-3d-green"
                                role="button" 
                                aria-label="Normal Speed" 
                                title="Normal Speed"
                                 style={{
                                   cursor: 'pointer',
                                   width: '120px',
                                   height: '60px',
                                   borderRadius: '0px'
                                 }}
                                onClick={() => handleSpeedChange(1)}>
                                  <CustomSpeedNormalIcon />
                                </div>
                            
                            {/* Fast Speed */}
                            <div 
                              className="button-3d-base button-3d-60px-square button-3d-green"
                              role="button" 
                              aria-label="Fast Speed" 
                              title="Fast Speed"
                              style={{
                                cursor: 'pointer'
                              }}
                              onClick={() => handleSpeedChange(1.25)}>
                                <CustomSpeedFastIcon />
                              </div>
                            
                            {/* Faster Speed */}
                            <div 
                              className="button-3d-base button-3d-60px-square button-3d-green"
                              role="button" 
                              aria-label="Faster Speed" 
                              title="Faster Speed"
                              style={{
                                cursor: 'pointer'
                              }}
                              onClick={() => handleSpeedChange(1.5)}>
                                <CustomSpeedFasterIcon />
                              </div>
                            
                        </div>
                      </div>
                     </td>
                   </tr>

                  {/* Row 6: Font Size Section Gap */}
                  <tr>
                    <td colSpan={4} height={1} style={{backgroundColor: 'transparent', border: 'none'}}></td>
                  </tr>

                  {/* Row 7: Font Size Control Section - New Flex Layout */}
                   <tr>
                         <td colSpan={4} height={62} style={{
                           padding: '3px', 
                           background: '#D4C89A',
                           borderRadius: '12px'
                        }}>
                           <div style={{
                             padding: '0px 2px',
                             backgroundColor: '#D4C89A',
                             borderRadius: '9px',
                             height: '100%'
                           }}>
                           <div style={{
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'space-evenly',
                             height: '100%',
                             width: '100%',
                             gap: '8px',
                             borderRadius: '9px'
                            }}>
                          {/* Left: Size Icon */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                             <CachedIcon 
                               iconCode="!CO-AV9.jpg" 
                               fallback={<span className="text-xs">!CO-AV9.jpg</span>}
                               style={{ height: '80px', width: '120px', objectFit: 'contain' }}
                            />
                          </div>
                        
                         {/* Center and Right: Bigger and Smaller buttons */}
                         <div style={{
                           display: 'flex',
                           gap: '8px'
                         }}>
                           <div 
                             className={`button-3d-base button-3d-60px-square ${isMaxSize ? 'opacity-60' : ''}`}
                             role="button" 
                             aria-label="Increase Font Size" 
                             title="Increase Font Size"
                             style={{
                               cursor: isMaxSize ? 'not-allowed' : 'pointer',
                               opacity: isMaxSize ? 0.6 : 1,
                               pointerEvents: isMaxSize ? 'none' : 'auto'
                             }}
                             onClick={!isMaxSize ? handleScaleIncrease : undefined}>
                               <CachedIcon 
                                 iconCode="!CO-AVB.png" 
                                 fallback={<span className="text-xs">!CO-AVB.png</span>}
                                 style={{ height: '60px', width: '60px', objectFit: 'contain' }}
                              />
                           </div>
                          
                            <div 
                              className={`button-3d-base button-3d-60px-square ${isMinSize ? 'opacity-60' : ''}`}
                              role="button" 
                              aria-label="Decrease Font Size" 
                              title="Decrease Font Size"
                              style={{
                                cursor: isMinSize ? 'not-allowed' : 'pointer',
                                opacity: isMinSize ? 0.6 : 1,
                                pointerEvents: isMinSize ? 'none' : 'auto'
                              }}
                              onClick={!isMinSize ? handleScaleDecrease : undefined}>
                                <CachedIcon 
                                  iconCode="!CO-AVS.jpg" 
                                  fallback={<span className="text-xs">!CO-AVS.jpg</span>}
                                  style={{ height: '60px', width: '60px', objectFit: 'contain' }}
                               />
                            </div>
                         </div>
                        </div>
                         </div>
                      </td>
                   </tr>
                   
                   {/* New borderless close button row */}
                   <tr>
                     <td style={{
                       border: 'none',
                       background: 'transparent',
                       padding: '0',
                       textAlign: 'center',
                       display: 'flex',
                       justifyContent: 'center',
                       alignItems: 'center',
                       width: '100%'
                     }}>
                        <div 
                          className="button-3d-base"
                          role="button" 
                          aria-label="Close SuperAV" 
                          title="Close SuperAV"
                          style={{
                            cursor: 'pointer',
                            height: '60px',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                         onClick={onClose}>
                          <CachedIcon 
                            iconCode="!CO-CLS.jpg" 
                            fallback={<span className="text-xs">!CO-CLS.jpg</span>}
                            style={{ height: '60px', width: '100%', objectFit: 'fill' }}
                          />
                       </div>
                     </td>
                   </tr>
                </tbody>
             </table>
             </div>
           </div>
         </div>
         
          {/* Hidden audio element */}
          {(audioUrl || sysAvx?.audioUrl) && (
            <audio ref={audioRef} preload="metadata">
              <source src={audioUrl || sysAvx?.audioUrl} type="audio/mpeg" />
              <source src={audioUrl || sysAvx?.audioUrl} type="audio/mp3" />
              <source src={audioUrl || sysAvx?.audioUrl} type="audio/wav" />
              Your browser does not support the audio element.
             </audio>
           )}
          
          </div>
        </>
      )}
    </div>
  );
};
