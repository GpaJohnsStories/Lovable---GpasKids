import { supabase } from "@/integrations/supabase/client";

interface MenuButtonProps {
  icon: string;
  text: string;
  color: string;
  onClick: () => void;
}

const MenuButton = ({ icon, text, color, onClick }: MenuButtonProps) => {
  // Function to get icon URL from Supabase storage with fallback
  const getIconUrl = (filePath: string) => {
    return supabase.storage.from('icons').getPublicUrl(filePath).data.publicUrl;
  };

  const getSafeIconUrl = (filePath: string) => {
    try {
      return getIconUrl(filePath);
    } catch (error) {
      console.warn(`Failed to load icon ${filePath}, falling back to ICO-N2K.png`);
      return getIconUrl('ICO-N2K.png');
    }
  };

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-center p-2 rounded-lg hover:scale-105 transform transition-all duration-200 cursor-pointer active:scale-95"
      style={{
        background: `linear-gradient(135deg, ${color}dd, ${color}bb)`,
        boxShadow: `0 8px 16px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)`,
        border: `2px solid ${color}`,
        width: '60px',
        height: '60px'
      }}
    >
      {/* Icon Container */}
      <div 
        className="w-[40px] h-[40px] flex items-center justify-center rounded-md overflow-hidden"
        style={{ backgroundColor: color }}
      >
        <img 
          src={getSafeIconUrl(`${icon}.png`)}
          alt={text}
          className="w-full h-full object-contain"
          onError={(e) => {
            // Fallback to jpg, then gif if png fails
            const target = e.target as HTMLImageElement;
            if (target.src.includes('.png')) {
              target.src = getSafeIconUrl(`${icon}.jpg`);
            } else if (target.src.includes('.jpg')) {
              target.src = getSafeIconUrl(`${icon}.gif`);
            }
          }}
        />
      </div>
      
      {/* Text Label */}
      <div className="text-white text-[10px] font-bold mt-1 text-center leading-tight drop-shadow-md">
        {text}
      </div>
    </button>
  );
};

export default MenuButton;