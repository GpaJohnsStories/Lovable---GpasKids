import React from 'react';

interface AudioSpeedControlsProps {
  playbackRate: number;
  onSpeedChange: (speed: number) => void;
  audioUrl?: string;
}

export const AudioSpeedControls: React.FC<AudioSpeedControlsProps> = ({
  playbackRate,
  onSpeedChange,
  audioUrl
}) => {
  return (
    <>
      {/* Row 3: Speed Controls Header */}
      <div 
        className="col-span-4 border-t-2 border-l-2 border-r-2 border-white/40 shadow-lg flex items-center justify-center rounded-t-lg"
        style={{ backgroundColor: '#814d2e' }}
      >
        <span className="text-white text-sm font-bold font-fun">Playback Speed</span>
      </div>

      {/* Row 4: Speed Controls */}
      <div className="flex items-center justify-center rounded-bl-lg" style={{ backgroundColor: '#814d2e' }}>
        <button 
          className={`w-[55px] h-[55px] rounded-lg border-4 border-white/40 shadow-lg
            transform hover:scale-105 hover:shadow-xl active:scale-95
            transition-all duration-200 flex flex-col items-center justify-center
            relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed
            ${playbackRate === 1 ? 'ring-2 ring-yellow-400' : ''}`}
          style={{
            background: `linear-gradient(135deg, hsl(120, 50%, 60%) 0%, hsl(120, 50%, 50%) 100%)`,
            boxShadow: `0 8px 20px rgba(34, 139, 34, 0.3), inset 0 2px 4px rgba(255,255,255,0.3)`
          }}
          onClick={(e) => {e.stopPropagation(); onSpeedChange(1);}}
          disabled={!audioUrl}
        >
          <span className="font-bold text-xs drop-shadow-sm font-fun" style={{ color: '#814d2e' }}>Normal</span>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
        </button>
      </div>

      <div className="flex items-center justify-center" style={{ backgroundColor: '#814d2e' }}>
        <button 
          className={`w-[55px] h-[55px] rounded-lg border-4 border-white/40 shadow-lg
            transform hover:scale-105 hover:shadow-xl active:scale-95
            transition-all duration-200 flex flex-col items-center justify-center
            relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed
            ${playbackRate === 1.25 ? 'ring-2 ring-yellow-400' : ''}`}
          style={{
            background: `linear-gradient(135deg, hsl(120, 50%, 55%) 0%, hsl(120, 50%, 45%) 100%)`,
            boxShadow: `0 8px 20px rgba(34, 139, 34, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)`
          }}
          onClick={(e) => {e.stopPropagation(); onSpeedChange(1.25);}}
          disabled={!audioUrl}
        >
          <span className="font-bold text-xs drop-shadow-sm font-fun" style={{ color: '#FFFDD0' }}>Fast</span>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
        </button>
      </div>

      <div className="flex items-center justify-center" style={{ backgroundColor: '#814d2e' }}>
        <button 
          className={`w-[55px] h-[55px] rounded-lg border-4 border-white/40 shadow-lg
            transform hover:scale-105 hover:shadow-xl active:scale-95
            transition-all duration-200 flex flex-col items-center justify-center
            relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed
            ${playbackRate === 1.5 ? 'ring-2 ring-yellow-400' : ''}`}
          style={{
            background: `linear-gradient(135deg, hsl(120, 55%, 45%) 0%, hsl(120, 55%, 35%) 100%)`,
            boxShadow: `0 8px 20px rgba(34, 139, 34, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)`
          }}
          onClick={(e) => {e.stopPropagation(); onSpeedChange(1.5);}}
          disabled={!audioUrl}
        >
          <span className="font-bold text-xs drop-shadow-sm font-fun" style={{ color: '#FFFDD0' }}>Faster</span>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
        </button>
      </div>

      <div className="flex items-center justify-center rounded-br-lg" style={{ backgroundColor: '#814d2e' }}>
        <button 
          className={`w-[55px] h-[55px] rounded-lg border-4 border-white/40 shadow-lg
            transform hover:scale-105 hover:shadow-xl active:scale-95
            transition-all duration-200 flex flex-col items-center justify-center
            relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed
            ${playbackRate === 0.75 ? 'ring-2 ring-yellow-400' : ''}`}
          style={{
            background: `linear-gradient(135deg, hsl(120, 40%, 40%) 0%, hsl(120, 40%, 30%) 100%)`,
            boxShadow: `0 8px 20px rgba(34, 139, 34, 0.6), inset 0 2px 4px rgba(255,255,255,0.3)`
          }}
          onClick={(e) => {e.stopPropagation(); onSpeedChange(0.75);}}
          disabled={!audioUrl}
        >
          <span className="font-bold text-xs drop-shadow-sm font-fun" style={{ color: '#FFFDD0' }}>Slow</span>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
        </button>
      </div>
    </>
  );
};