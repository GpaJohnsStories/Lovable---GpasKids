import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface MenuButtonProps {
  icon: string;
  text: string;
  color: string;
  onClick: () => void;
  customSize?: {
    width: string;
    height: string;
    iconSize: string;
  };
}

const MenuButton = ({ icon, text, color, onClick, customSize }: MenuButtonProps) => {
  // Function to get icon URL from Supabase storage with fallback
  const getIconUrl = (filePath: string) => {
    return supabase.storage.from('icons').getPublicUrl(filePath).data.publicUrl;
  };

  const getSafeIconUrl = (filePath: string) => {
    return getIconUrl(filePath);
  };

  const freshGreen = "#16a34a";

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
            width: customSize?.width || '60px',
            height: customSize?.height || '60px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `linear-gradient(135deg, ${freshGreen}dd, ${freshGreen}bb)`;
            e.currentTarget.style.border = `2px solid ${freshGreen}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `linear-gradient(135deg, ${color}dd, ${color}bb)`;
            e.currentTarget.style.border = `2px solid ${color}`;
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.background = `linear-gradient(135deg, ${freshGreen}aa, ${freshGreen}99)`;
            e.currentTarget.style.border = `2px solid ${freshGreen}`;
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.background = `linear-gradient(135deg, ${freshGreen}dd, ${freshGreen}bb)`;
            e.currentTarget.style.border = `2px solid ${freshGreen}`;
          }}
        >
          {/* Icon - proportionally scaled to fit button with margin */}
          <img 
            src={getSafeIconUrl(icon)}
            alt={text}
            style={{
              width: customSize?.iconSize || '55px',
              height: customSize?.iconSize || '55px'
            }}
            className="object-contain"
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