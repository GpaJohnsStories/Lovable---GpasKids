import React from 'react';
import { Play, Pause, RotateCcw, Square } from 'lucide-react';

export const SuperAudioColorPreview: React.FC = () => {
  // User's perfect color choices
  const buttonColors = {
    play: {
      name: 'Play',
      bgColor: '#16a34a', // Fresh Green
      shadowColor: '#16a34a40',
      icon: Play
    },
    pause: {
      name: 'Pause',
      bgColor: '#F2BA15', // Brighter Gold
      shadowColor: '#F2BA1540', 
      icon: Pause
    },
    restart: {
      name: 'Restart',
      bgColor: '#169CF9', // Sky Blue
      shadowColor: '#169CF940',
      icon: RotateCcw
    },
    stop: {
      name: 'Stop',
      bgColor: '#DC2626', // Cherry Red
      shadowColor: '#DC262640',
      icon: Square
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
                <button 
                  className="w-20 h-20 rounded-full border-4 border-white/30 shadow-lg
                    transform hover:scale-105 hover:shadow-xl
                    transition-all duration-200 active:scale-95
                    flex items-center justify-center
                    relative
                    before:absolute before:inset-1 before:rounded-full 
                    before:bg-white/20 before:blur-sm"
                  style={{
                    background: `linear-gradient(to bottom, ${button.bgColor}, ${button.bgColor}dd)`,
                    boxShadow: `0 10px 25px ${button.shadowColor}, 0 4px 10px rgba(0,0,0,0.1)`
                  }}
                >
                  <IconComponent 
                    className="w-8 h-8 text-white drop-shadow-sm" 
                    fill="white"
                  />
                </button>
              </div>
              <p className="text-sm font-semibold text-gray-700">{button.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {button.bgColor}
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