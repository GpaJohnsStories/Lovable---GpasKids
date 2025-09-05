import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Heart, Star } from "lucide-react";

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  customMessage?: string;
}

const ThankYouModal: React.FC<ThankYouModalProps> = ({ isOpen, onClose, amount, customMessage }) => {
  const navigate = useNavigate();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-b from-yellow-50 to-orange-50 border-2 border-orange-200">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 bg-gradient-to-b from-yellow-200 to-orange-200 rounded-full flex items-center justify-center border-4 border-orange-300">
            {/* Placeholder for special thank you photo */}
            <div className="flex items-center justify-center">
              <Heart className="h-12 w-12 text-red-500" />
              <Star className="h-8 w-8 text-yellow-500 absolute ml-6 mt-6" />
            </div>
          </div>
          
          <DialogTitle className="text-2xl font-bold text-orange-800">
            Thank you for your message.
          </DialogTitle>
          
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 mt-6">
          <div className="text-center">
            <span className="font-handwritten text-[#0B3D91] text-3xl font-bold italic">
              Grandpa John
            </span>
          </div>
          
          <Button 
            onClick={() => {
              onClose();
              navigate('/library');
            }}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Continue Reading Stories
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThankYouModal;