import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ThankYouModal from "./ThankYouModal";

const VenmoDonationForm = () => {
  const [selectedAmount, setSelectedAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [finalAmount, setFinalAmount] = useState<string>('');
  const { toast } = useToast();

  const presetAmounts = [
    { value: '1.00', label: '$1.00' },
    { value: '5.00', label: '$5.00' },
    { value: '10.00', label: '$10.00' },
    { value: '20.00', label: '$20.00' },
    { value: 'other', label: 'Other Amount' }
  ];

  const handleAmountChange = (value: string) => {
    setSelectedAmount(value);
    if (value !== 'other') {
      setCustomAmount('');
    }
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      const numValue = parseFloat(value);
      if (value === '' || (numValue >= 0.01 && numValue <= 50)) {
        setCustomAmount(value);
      }
    }
  };

  const validateForm = (): string | null => {
    if (!selectedAmount) {
      return 'Please select a donation amount';
    }

    if (selectedAmount === 'other') {
      if (!customAmount || parseFloat(customAmount) < 0.01) {
        return 'Please enter a valid amount (minimum $0.01)';
      }
      if (parseFloat(customAmount) > 50) {
        return 'Maximum donation amount is $50.00';
      }
    }

    return null;
  };

  const getDonationAmount = (): string => {
    return selectedAmount === 'other' ? customAmount : selectedAmount;
  };

  const generateVenmoLink = (amount: string): string => {
    const venmoUsername = 'GpaJohn'; // Replace with actual Venmo username
    const note = encodeURIComponent('Donation for Gpa\'s Kids Stories');
    return `venmo://paycharge?txn=pay&recipients=${venmoUsername}&amount=${amount}&note=${note}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const amount = getDonationAmount();
    setFinalAmount(amount);

    try {
      // Record donation attempt in database
      const { error } = await supabase.functions.invoke('track-donation', {
        body: { amount: parseFloat(amount) }
      });

      if (error) {
        console.error('Error tracking donation:', error);
        // Don't block the donation process if tracking fails
      }

      // Generate and open Venmo link
      const venmoLink = generateVenmoLink(amount);
      window.open(venmoLink, '_blank');

      // Show thank you modal
      setShowThankYou(true);
      
      // Reset form
      setSelectedAmount('');
      setCustomAmount('');

    } catch (error) {
      console.error('Error processing donation:', error);
      toast({
        title: "Error",
        description: "There was an issue processing your donation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="max-w-md mx-auto bg-gradient-to-b from-yellow-50 to-orange-50 border-2 border-orange-200 shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-b from-yellow-200 to-orange-200 rounded-full flex items-center justify-center border-4 border-orange-300 mb-3">
            <Heart className="h-8 w-8 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-orange-800">
            Help Grandpa John With A Gift
          </CardTitle>
          <p className="text-gray-600 text-sm">
            Grandpa John's Stories is NOT a non-profit organization so please mark your gift as a donation.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold text-gray-700">
                Choose your donation amount:
              </Label>
              
              <RadioGroup value={selectedAmount} onValueChange={handleAmountChange}>
                <div className="grid grid-cols-2 gap-3">
                  {presetAmounts.map((amount) => (
                    <div key={amount.value} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={amount.value} 
                        id={amount.value}
                        className="border-orange-400 text-orange-600"
                      />
                      <Label 
                        htmlFor={amount.value}
                        className="text-sm font-medium cursor-pointer hover:text-orange-600 transition-colors"
                      >
                        {amount.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              {selectedAmount === 'other' && (
                <div className="mt-4">
                  <Label htmlFor="customAmount" className="text-sm font-medium text-gray-700 mb-2 block">
                    Enter amount (Minimum $ 1.00, Maximum $ 50.00):
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="customAmount"
                      type="text"
                      placeholder="0.00"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      className="pl-8 border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !selectedAmount}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : 'Donate with Venmo'}
            </Button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                You'll be redirected to the Venmo app to complete your donation
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      <ThankYouModal
        isOpen={showThankYou}
        onClose={() => setShowThankYou(false)}
        amount={finalAmount}
      />
    </>
  );
};

export default VenmoDonationForm;