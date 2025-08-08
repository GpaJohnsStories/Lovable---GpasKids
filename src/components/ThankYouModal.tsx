import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
}

const ThankYouModal = ({ isOpen, onClose, amount }: ThankYouModalProps) => {
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
            Thank You So Much!
          </DialogTitle>
          
          <DialogDescription className="text-lg text-gray-700 space-y-3">
            <p>
              Your generous donation of <span className="font-bold text-green-600">${amount}</span> means the world to Grandpa John and all the children who love these stories!
            </p>
            <p className="text-base">
              Your support helps keep these wonderful tales free and accessible for families everywhere.
            </p>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 mt-6">
          <div className="bg-white/60 p-4 rounded-lg border border-orange-200 text-center">
            <p className="text-sm text-gray-600 italic">
              "Every story shared is a gift of love and imagination to a child's heart."
            </p>
            <p className="text-xs text-gray-500 mt-1">- Grandpa John</p>
          </div>
          
          <Button 
            onClick={onClose}
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