import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Heart, DollarSign } from "lucide-react";
import ThankYouModal from "./ThankYouModal";

const DonationForm = () => {
  const [selectedAmount, setSelectedAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [showThankYou, setShowThankYou] = useState(false);

  const predefinedAmounts = ['1', '5', '10', '20'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Future: Integrate with Venmo API
    console.log('Donation submitted:', {
      amount: selectedAmount === 'custom' ? customAmount : selectedAmount,
      message
    });
    setShowThankYou(true);
  };

  const getFinalAmount = () => {
    return selectedAmount === 'custom' ? customAmount : selectedAmount;
  };

  return (
    <>
      <Card className="bg-white/80 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl text-orange-800">
            <Heart className="h-6 w-6 text-red-500" />
            Make a Donation
          </CardTitle>
          <CardDescription className="text-lg text-gray-700">
            Your support helps keep these wonderful stories free for all children
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Selection */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-800">Choose an amount:</Label>
              <RadioGroup value={selectedAmount} onValueChange={setSelectedAmount} className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {predefinedAmounts.map((amount) => (
                  <div key={amount} className="flex items-center space-x-2">
                    <RadioGroupItem value={amount} id={`amount-${amount}`} />
                    <Label 
                      htmlFor={`amount-${amount}`} 
                      className="cursor-pointer bg-green-100 hover:bg-green-200 px-4 py-2 rounded-lg border border-green-300 text-center font-semibold text-green-800 transition-colors"
                    >
                      ${parseFloat(amount).toFixed(2)}
                    </Label>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="amount-custom" />
                  <Label 
                    htmlFor="amount-custom" 
                    className="cursor-pointer bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-lg border border-blue-300 text-center font-semibold text-blue-800 transition-colors"
                  >
                    Other
                  </Label>
                </div>
              </RadioGroup>
              
              {selectedAmount === 'custom' && (
                <div className="mt-4">
                  <Label htmlFor="custom-amount" className="text-base font-medium text-gray-700">
                    Enter amount:
                  </Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="custom-amount"
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="0.00"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="pl-10 text-lg"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Optional Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-base font-medium text-gray-700">
                Optional message (will be shared with Grandpa John):
              </Label>
              <Textarea
                id="message"
                placeholder="Your kind words and encouragement..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px] resize-none"
                maxLength={500}
              />
              <p className="text-sm text-gray-500">{message.length}/500 characters</p>
            </div>

            {/* Venmo Instructions */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">How to donate via Venmo:</h3>
              <ol className="list-decimal list-inside space-y-1 text-blue-700 text-sm">
                <li>Click the donation button below to confirm your amount</li>
                <li>You'll be directed to Venmo to complete your donation</li>
                <li>Use Venmo username: <span className="font-mono bg-blue-100 px-1 rounded">@GrandpaJohn-Stories</span></li>
                <li>Include your message if you'd like</li>
              </ol>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!selectedAmount || (selectedAmount === 'custom' && !customAmount)}
              className="w-full text-lg py-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Heart className="h-5 w-5 mr-2" />
              Donate ${getFinalAmount()} via Venmo
            </Button>
          </form>
        </CardContent>
      </Card>

      <ThankYouModal 
        isOpen={showThankYou} 
        onClose={() => setShowThankYou(false)}
        amount={getFinalAmount()}
      />
    </>
  );
};

export default DonationForm;