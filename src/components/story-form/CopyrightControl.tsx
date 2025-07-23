
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";

interface CopyrightControlProps {
  value: string;
  onChange: (value: string) => void;
}

const CopyrightControl = ({ value, onChange }: CopyrightControlProps) => {
  const getCopyrightLabel = (status: string) => {
    switch (status) {
      case '©':
        return 'Full Copyright';
      case 'O':
        return 'Open, No Copyright';
      case 'S':
        return 'Limited Sharing';
      default:
        return 'Full Copyright';
    }
  };

  const getCopyrightColor = (status: string) => {
    switch (status) {
      case '©':
        return 'text-white bg-red-600 border-red-700';
      case 'O':
        return 'text-white bg-green-600 border-green-700';
      case 'S':
        return 'text-black bg-orange-400 border-orange-500';
      default:
        return 'text-white bg-red-600 border-red-700';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="copyright_status">Copyright Status</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-gray-500 cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="bg-white border border-gray-300 shadow-lg p-3 max-w-xs z-50">
              <div className="space-y-2 text-sm">
                <div className="font-semibold text-red-600">© Full Copyright</div>
                <p className="text-gray-700">All rights reserved. Content cannot be shared without permission.</p>
                
                <div className="font-semibold text-green-600">O Open, No Copyright</div>
                <p className="text-gray-700">Free to share and distribute without restrictions.</p>
                
                <div className="font-semibold text-yellow-600">S Limited Sharing</div>
                <p className="text-gray-700">Gpa John's copyright - limited sharing allowed with attribution.</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex justify-start">
        <Select value={value || '©'} onValueChange={onChange}>
          <SelectTrigger className={`w-48 font-bold ${getCopyrightColor(value || '©')}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-50 bg-white border shadow-lg">
            <SelectItem value="©" className="text-red-600 font-bold">
              © Full Copyright
            </SelectItem>
            <SelectItem value="O" className="text-green-600 font-bold">
              O Open, No Copyright
            </SelectItem>
            <SelectItem value="S" className="text-yellow-600 font-bold">
              S Limited Sharing
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CopyrightControl;
