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
        {/* Inner Screen */}
        <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '2px solid #5A3E2B',
        boxShadow: 'inset 0 0 0 2px #A67C52, inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
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
            marginBottom: '10px'
          }}>
              {formatTime(timeLeft)}
            </div>
            
          </div>

          {/* Message */}
          <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          borderRadius: '12px',
          padding: '12px',
          marginBottom: '30px',
          textAlign: 'left',
          margin: '0 -8px 30px -8px'
        }}>
            <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            margin: '0 0 12px 0',
            color: '#F97316',
            textAlign: 'center'
          }}>
              Time for a quick break!
            </h3>
            <ul style={{
            fontSize: '14px',
            lineHeight: '1.6',
            margin: 0,
            padding: '0 0 0 20px',
            color: '#000000',
            listStyle: 'none'
          }}>
              <li style={{ marginBottom: '4px' }}>🔥 Get a drink or snack</li>
              <li style={{ marginBottom: '4px' }}>🔥 Stretch arms & legs</li>
              <li style={{ marginBottom: '4px' }}>🔥 Look outside, far away</li>
              <li style={{ marginBottom: '4px' }}>🔥 Say "Hi" to someone</li>
              <li style={{ marginBottom: '4px' }}>🔥 Get some fresh air</li>
              <li style={{ marginBottom: '4px' }}>🔥 Take a short walk</li>
              <li style={{ marginBottom: '4px' }}>🔥 DO NOT look at any screens</li>
            </ul>
          </div>

          {/* Controls */}
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginTop: 'auto'
        }}>
            <button onClick={handleBreakComplete} style={{
            padding: '14px',
            backgroundColor: isCompleted ? '#22c55e' : 'rgba(0, 0, 0, 0.1)',
            color: isCompleted ? 'white' : '#000000',
            border: isCompleted ? 'none' : '1px solid rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }} onMouseOver={e => {
            if (isCompleted) {
              e.currentTarget.style.backgroundColor = '#16a34a';
            } else {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';
            }
          }} onMouseOut={e => {
            if (isCompleted) {
              e.currentTarget.style.backgroundColor = '#22c55e';
            } else {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
            }
          }}>
              {isCompleted ? 'Continue - I Took a Break!' : 'Skip - I Already Took a Break'}
            </button>
          </div>
        </div>
      </div>
    </TooltipProvider>;
};