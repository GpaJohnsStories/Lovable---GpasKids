import React from 'react';
import { Play, Pause, RotateCcw, Square } from 'lucide-react';

export const SuperAudioColorPreview: React.FC = () => {
  // Perfect colors that complement the warm orange/amber theme
  const buttonColors = {
    play: {
      name: 'Play',
      color: 'from-emerald-400 to-emerald-600', // Warm, friendly green
      icon: Play,
      shadow: 'shadow-emerald-300/50'
    },
    pause: {
      name: 'Pause', 
      color: 'from-amber-400 to-amber-600', // Matches your theme perfectly
      icon: Pause,
      shadow: 'shadow-amber-300/50'
    },
    restart: {
      name: 'Restart',
      color: 'from-sky-400 to-sky-600', // Cool blue for refresh
      icon: RotateCcw,
      shadow: 'shadow-sky-300/50'
    },
    stop: {
      name: 'Stop',
      color: 'from-rose-400 to-rose-600', // Warm red, not harsh
      icon: Square,
      shadow: 'shadow-rose-300/50'
    }
  };

  return (
    <div className="p-8 bg-gradient-to-b from-amber-50 to-orange-100 rounded-2xl border-4 border-orange-300">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        SuperAudio Button Colors
      </h2>
      
      <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
        {Object.entries(buttonColors).map(([key, button]) => {
          const IconComponent = button.icon;
          return (
            <div key={key} className="text-center">
              <div className="mb-2">
                <button className={`
                  w-20 h-20 rounded-full bg-gradient-to-b ${button.color}
                  border-4 border-white/30 ${button.shadow} shadow-lg
                  transform hover:scale-105 hover:shadow-xl
                  transition-all duration-200 active:scale-95
                  flex items-center justify-center
                  relative
                  before:absolute before:inset-1 before:rounded-full 
                  before:bg-white/20 before:blur-sm
                `}>
                  <IconComponent 
                    className="w-8 h-8 text-white drop-shadow-sm" 
                    fill="white"
                  />
                </button>
              </div>
              <p className="text-sm font-semibold text-gray-700">{button.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {button.color.replace('from-', '').replace(' to-', ' → ').replace('-', ' ')}
              </p>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          These colors complement your warm orange/amber theme while being 
          <br />intuitive and child-friendly for audio controls
        </p>
      </div>
    </div>
  );
};