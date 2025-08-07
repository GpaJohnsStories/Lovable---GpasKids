import React from 'react';
import { Play, Pause, RotateCcw, Square } from 'lucide-react';

interface AudioControlButtonsProps {
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  onStop: () => void;
  isPlaying: boolean;
  isLoading: boolean;
  audioUrl?: string;
}

export const AudioControlButtons: React.FC<AudioControlButtonsProps> = ({
  onPlay,
  onPause,
  onRestart,
  onStop,
  isPlaying,
  isLoading,
  audioUrl
}) => {
  return (
    <>
      <button 
        className="w-[55px] h-[55px] rounded-lg border-4 border-white/40 shadow-lg
          transform hover:scale-105 hover:shadow-xl active:scale-95
          transition-all duration-200 flex items-center justify-center
          relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: `linear-gradient(135deg, #16a34a 0%, #15803d 100%)`,
          boxShadow: `0 8px 20px rgba(22, 163, 74, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)`
        }}
        onClick={(e) => {e.stopPropagation(); onPlay();}}
        disabled={!audioUrl || isLoading || isPlaying}
      >
        <Play className="w-6 h-6 text-white drop-shadow-sm" fill="white" />
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
      </button>

      <button 
        className="w-[55px] h-[55px] rounded-lg border-4 border-white/40 shadow-lg
          transform hover:scale-105 hover:shadow-xl active:scale-95
          transition-all duration-200 flex items-center justify-center
          relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: `linear-gradient(135deg, #F2BA15 0%, #d39e00 100%)`,
          boxShadow: `0 8px 20px rgba(242, 186, 21, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)`
        }}
        onClick={(e) => {e.stopPropagation(); onPause();}}
        disabled={!audioUrl || !isPlaying}
      >
        <Pause className="w-6 h-6 text-white drop-shadow-sm" fill="white" />
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
      </button>

      <button 
        className="w-[55px] h-[55px] rounded-lg border-4 border-white/40 shadow-lg
          transform hover:scale-105 hover:shadow-xl active:scale-95
          transition-all duration-200 flex items-center justify-center
          relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: `linear-gradient(135deg, #169CF9 0%, #0284c7 100%)`,
          boxShadow: `0 8px 20px rgba(22, 156, 249, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)`
        }}
        onClick={(e) => {e.stopPropagation(); onRestart();}}
        disabled={!audioUrl}
      >
        <RotateCcw className="w-6 h-6 text-white drop-shadow-sm" />
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
      </button>

      <button 
        className="w-[55px] h-[55px] rounded-lg border-4 border-white/40 shadow-lg
          transform hover:scale-105 hover:shadow-xl active:scale-95
          transition-all duration-200 flex items-center justify-center
          relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: `linear-gradient(135deg, #DC2626 0%, #b91c1c 100%)`,
          boxShadow: `0 8px 20px rgba(220, 38, 38, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)`
        }}
        onClick={(e) => {e.stopPropagation(); onStop();}}
        disabled={!audioUrl}
      >
        <Square className="w-5 h-5 text-white drop-shadow-sm" fill="white" />
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
      </button>
    </>
  );
};