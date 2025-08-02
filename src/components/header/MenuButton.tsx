import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className="group relative flex items-center justify-center rounded-lg hover:scale-105 transform transition-all duration-200 cursor-pointer active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${color}dd, ${color}bb)`,
            boxShadow: `0 8px 16px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)`,
            border: `2px solid ${color}`,
            width: '15px',
            height: '15px'
          }}
        >
          {/* Icon - 12x12px centered in 15x15px button */}
          <img 
            src={getSafeIconUrl(`${icon}.png`)}
            alt={text}
            className="w-3 h-3 object-contain"
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
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="bg-popover text-popover-foreground border shadow-md">
        <p className="font-semibold">{text}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default MenuButton;