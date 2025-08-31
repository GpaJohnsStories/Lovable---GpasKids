import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

interface DonationConfirmationDialogProps {
  isOpen: boolean;
  amount: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DonationConfirmationDialog = ({ isOpen, amount, onConfirm, onCancel }: DonationConfirmationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-b from-blue-50 to-indigo-50 border-2 border-blue-200">
        <DialogHeader className="text-center space-y-4">
          <DialogTitle className="text-xl font-bold text-blue-800">
            Did you complete your donation in Venmo?
          </DialogTitle>
          
          <DialogDescription className="text-base text-gray-700">
            We opened Venmo for your ${amount} donation. Please let us know if you completed the payment.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-6">
          <Button 
            onClick={onConfirm}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Yes, I completed it
          </Button>
          
          <Button 
            onClick={onCancel}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
          >
            <XCircle className="h-5 w-5 mr-2" />
            I canceled / had trouble
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonationConfirmationDialog;