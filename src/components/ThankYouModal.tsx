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
          <div className="mx-auto w-32 h-32 rounded-full overflow-hidden border-4 border-orange-300 shadow-lg">
            <img 
              src="/lovable-uploads/9e9298d1-6c77-49d4-8d81-a38c9ac28737.png" 
              alt="Grandpa John with his dog and cat" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <DialogTitle className="font-handwritten text-[#0B3D91] text-3xl font-bold italic text-center">
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