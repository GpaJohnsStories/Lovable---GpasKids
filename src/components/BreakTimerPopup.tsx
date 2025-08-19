/**
 * SYS-BT3 - Break Reminder Popup
 * 
 * This is the Break Reminder (formerly Break Timer Alert) that encourages users to take breaks.
 * It is opened via the Break Timer system when a break is due, or via the Back Door 
 * functionality (triple-clicking Sparky in the Break Timer).
 * 
 * SYS-BT2 Back Door Integration:
 * - Can be opened instantly via triple-click on Sparky icon in Break Timer
 * - When opened via Back Door, the Break Timer countdown is set to zero
 * - Provides immediate access to break reminder without waiting for the 15-minute timer
 * 
 * Features:
 * - 5-minute countdown timer for break duration
 * - Start/pause functionality
 * - Reset option to restart the break timer
 * - Break completion acknowledgment
 * - Motivational messaging to encourage taking breaks
 */

import React, { useState, useEffect } from 'react';
import { Clock, Coffee, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCachedIcon } from '@/hooks/useCachedIcon';
interface BreakTimerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onBreakComplete: () => void;
}
export const BreakTimerPopup: React.FC<BreakTimerPopupProps> = ({
  isOpen,
  onClose,
  onBreakComplete
}) => {
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Get Sparky icon
  const {
    iconUrl: sparkyIconUrl,
    iconName: sparkyName
  } = useCachedIcon('!CO-SPT.gif');

  // Get Close icon
  const {
    iconUrl: closeIconUrl,
    iconName: closeName
  } = useCachedIcon('!CO-CLS.jpg');

  // Reset timer when popup opens and start immediately
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(5 * 60);
      setIsRunning(true);
      setIsCompleted(false);
    }
  }, [isOpen]);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);
  const formatTime = (seconds: number) => {
    const mins = Math.ceil(seconds / 60);
    return `${mins} Minutes`;
  };
  const startTimer = () => {
    setIsRunning(true);
  };
  const pauseTimer = () => {
    setIsRunning(false);
  };
  const resetTimer = () => {
    setTimeLeft(5 * 60);
    setIsRunning(false);
    setIsCompleted(false);
  };
  // Break suggestions array
  const suggestions = [
    '🔥 DO NOT look at screens',
    '🔥 Get a drink or snack', 
    '🔥 Stretch arms & legs',
    '🔥 Look outside & far away',
    '🔥 Get some fresh air',
    '🔥 Take a short walk'
  ];

  // Calculate minutes remaining and how many bullets should be bold
  const minutesRemaining = Math.ceil(timeLeft / 60);
  const additionalBoldCount = Math.max(0, 6 - minutesRemaining); // At 5min=1 additional, 4min=2, etc.

  const handleBreakComplete = () => {
    onBreakComplete();
    onClose();
  };
  if (!isOpen) return null;
  return <TooltipProvider>
      {/* Backdrop */}
      <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 49,
      backgroundColor: 'rgba(0, 0, 0, 0.6)'
    }} onClick={onClose} />
      
      {/* Break Timer Dialog - Same size as SuperAV */}
      <div style={{
      // Position and size matching SuperAV
      position: 'fixed',
      width: '288px',
      height: '490px',
      left: 'calc(50% - 144px)',
      // Center horizontally
      top: 'calc(50% - 245px)',
      // Center vertically
      zIndex: 50,
      // Forest green styling with SuperAV rounded corners
      background: '#228B22',
      // Forest green background
      border: '2px solid #14532d',
      // Dark green border
      borderRadius: '16px',
      // Same as SuperAV
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
      // Font
      fontFamily: 'Kalam, "Comic Sans MS", Arial, sans-serif',
      color: '#ffffff',
      // Layout
      display: 'flex',
      flexDirection: 'column',
      padding: '12px'
    }}>
        {/* Inner Screen - Shortened */}
        <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '2px solid #5A3E2B',
        boxShadow: 'inset 0 0 0 2px #A67C52, inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        height: '400px',
        color: '#000000',
        position: 'relative'
      }}>
          {/* Sparky icon in top left corner with tooltip */}
          {sparkyIconUrl && <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          zIndex: 20,
          cursor: 'pointer',
          transition: 'transform 0.2s'
        }} onMouseOver={e => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }} onMouseOut={e => {
          e.currentTarget.style.transform = 'scale(1)';
        }}>
            <Tooltip>
              <TooltipTrigger>
                <img src={sparkyIconUrl} alt={sparkyName ?? 'Sparky'} style={{
                width: '75px',
                height: '75px',
                objectFit: 'contain'
              }} />
              </TooltipTrigger>
              <TooltipContent className="whitespace-nowrap">
                {sparkyName ?? 'Sparky -- Official Break Reminder'}
              </TooltipContent>
            </Tooltip>
          </div>}
          
          {/* Header */}
          <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
            <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            margin: 0,
            color: '#F97316'
          }}>Time For A Break</h2>
          </div>

          {/* Timer Display or Completion Message */}
          {isCompleted ? (
            /* Completion Message */
            <div style={{
              textAlign: 'center',
              marginBottom: '20px',
              marginTop: '40px'
            }}>
              <div style={{
                fontSize: '28px',
                fontWeight: 'bold',
                fontStyle: 'italic',
                color: '#22c55e',
                lineHeight: '1.3',
                marginBottom: '20px'
              }}>
                Great Break!<br />
                Ready for a story?<br />
                Let's do it!
              </div>
            </div>
          ) : (
            <>
              {/* Timer Display */}
              <div style={{
                textAlign: 'center',
                marginBottom: '5px'
              }}>
                <div style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  fontFamily: 'Kalam, "Comic Sans MS", Arial, sans-serif',
                  color: '#F97316',
                  marginBottom: '0px'
                }}>
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* Message */}
              <div style={{
                backgroundColor: 'rgba(34, 139, 34, 0.15)',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '8px',
                textAlign: 'left',
                margin: '0 -8px 8px -8px',
                position: 'relative'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  margin: '0 0 12px 0',
                  color: '#F97316',
                  textAlign: 'center'
                }}>Ideas for a quick break...</h3>
                <ul style={{
                  fontSize: '16px',
                  lineHeight: '1.25',
                  margin: 0,
                  padding: '0',
                  color: '#F97316',
                  listStyle: 'none'
                }}>
                  {suggestions.map((suggestion, index) => {
                    // First bullet is always bold, then progressive bolding based on time
                    const shouldBeBold = index === 0 || index <= additionalBoldCount;
                    return (
                      <li key={index} style={{
                        marginBottom: '4px',
                        fontWeight: shouldBeBold ? 'bold' : 'normal'
                      }}>
                        {suggestion}
                      </li>
                    );
                  })}
                </ul>
                
                {/* SYS-BT3 code in bottom right corner */}
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px'
                }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#228B22'
                  }}>
                    SYS-BT3
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Controls */}
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginTop: 'auto'
        }}>
            
          </div>
        </div>

        {/* Close Button - Full width at bottom like break timer */}
        {closeIconUrl && (
          <div style={{ height: '60px' }}>
            <button 
              onClick={isCompleted ? onClose : undefined}
              disabled={!isCompleted}
              style={{
                width: '100%',
                height: '100%',
                background: 'transparent',
                border: 'none',
                padding: '0',
                cursor: isCompleted ? 'pointer' : 'not-allowed',
                transition: 'transform 0.2s',
                borderRadius: '16px',
                overflow: 'hidden',
                opacity: isCompleted ? 1 : 0.5
              }}
              onMouseOver={e => {
                if (isCompleted) {
                  e.currentTarget.style.transform = 'scale(1.02)';
                }
              }}
              onMouseOut={e => {
                if (isCompleted) {
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              <img 
                src={closeIconUrl} 
                alt={closeName ?? 'Close'} 
                style={{
                  height: '60px',
                  width: '100%',
                  objectFit: 'fill',
                  borderRadius: '16px'
                }}
              />
            </button>
          </div>
        )}
      </div>
    </TooltipProvider>;
};