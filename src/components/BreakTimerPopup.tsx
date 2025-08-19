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

  // Reset timer when popup opens
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(5 * 60);
      setIsRunning(false);
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
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 49,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        }}
        onClick={onClose}
      />
      
      {/* Break Timer Dialog - Same size as SuperAV */}
      <div
        style={{
          // Position and size matching SuperAV
          position: 'fixed',
          width: '288px',
          height: '490px',
          left: 'calc(50% - 144px)', // Center horizontally
          top: 'calc(50% - 245px)', // Center vertically
          zIndex: 50,
          
          // Dark green styling
          background: 'linear-gradient(135deg, #166534, #15803d)', // Dark green gradient
          border: '2px solid #14532d', // Dark green border
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          
          // Font
          fontFamily: 'Kalam, "Comic Sans MS", Arial, sans-serif',
          color: '#ffffff',
          
          // Layout
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Coffee style={{ width: '24px', height: '24px', color: '#dcfce7' }} />
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              margin: 0,
              color: '#dcfce7'
            }}>
              Break Reminder
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#dcfce7',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Timer Display */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <div style={{
            fontSize: '48px',
            fontWeight: 'bold',
            fontFamily: 'monospace',
            color: '#dcfce7',
            marginBottom: '10px'
          }}>
            {formatTime(timeLeft)}
          </div>
          <p style={{
            fontSize: '16px',
            color: '#bbf7d0',
            margin: 0
          }}>
            {isCompleted ? 'Break complete!' : 'Recommended break time'}
          </p>
        </div>

        {/* Message */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '14px',
            lineHeight: '1.5',
            margin: 0,
            color: '#dcfce7'
          }}>
            {isCompleted 
              ? 'Great job! You took a healthy break. Your eyes and mind will thank you!'
              : 'Step away from the screen. Stretch, look at something far away, or take a short walk.'
            }
          </p>
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginTop: 'auto'
        }}>
          {!isCompleted && (
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              <button
                onClick={isRunning ? pauseTimer : startTimer}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#22c55e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#16a34a';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#22c55e';
                }}
              >
                {isRunning ? 'Pause' : 'Start Timer'}
              </button>
              <button
                onClick={resetTimer}
                style={{
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Reset
              </button>
            </div>
          )}
          
          <button
            onClick={handleBreakComplete}
            style={{
              padding: '14px',
              backgroundColor: isCompleted ? '#22c55e' : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: isCompleted ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              if (isCompleted) {
                e.currentTarget.style.backgroundColor = '#16a34a';
              } else {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }
            }}
            onMouseOut={(e) => {
              if (isCompleted) {
                e.currentTarget.style.backgroundColor = '#22c55e';
              } else {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }
            }}
          >
            {isCompleted ? 'Continue - I Took a Break!' : 'Skip - I Already Took a Break'}
          </button>
        </div>
      </div>
    </>
  );
};