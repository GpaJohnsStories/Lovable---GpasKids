import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, DollarSign, ExternalLink, Copy, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import ThankYouModal from "./ThankYouModal";
import DonationConfirmationDialog from "./DonationConfirmationDialog";
import { QRCodeSVG } from 'qrcode.react';

const VenmoDonationForm = () => {
  const [selectedAmount, setSelectedAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [finalAmount, setFinalAmount] = useState<string>('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Enhanced device and browser detection
  const getDeviceType = () => {
    const userAgent = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(userAgent)) return 'ios';
    if (/Android/.test(userAgent)) return 'android';
    return 'unknown';
  };

  const isInAppBrowser = () => {
    const userAgent = navigator.userAgent;
    // Common in-app browsers that might have issues with deep links
    return /FBAN|FBAV|Instagram|Twitter|LinkedIn|Snapchat|TikTok|WeChat/.test(userAgent);
  };

  const deviceType = getDeviceType();
  const inAppBrowser = isInAppBrowser();

  const getAppStoreLink = () => {
    if (deviceType === 'ios') {
      return 'https://apps.apple.com/us/app/venmo/id351727428';
    } else if (deviceType === 'android') {
      return 'https://play.google.com/store/apps/details?id=com.venmo';
    }
    return null;
  };

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

  const generateVenmoLink = (amount: string): { url: string; type: 'app' | 'web' | 'manual' } => {
    const venmoUsername = 'GpaJohn-Buddy';
    const note = encodeURIComponent('Donation for Gpa\'s Kids Stories');
    
    console.log('🔗 Generating Venmo link:', { isMobile, deviceType, inAppBrowser, amount });
    
    if (isMobile && !inAppBrowser) {
      // Try Venmo app first on mobile (but not in-app browsers)
      const deepLink = `venmo://paycharge?txn=pay&recipients=${venmoUsername}&amount=${amount}&note=${note}`;
      console.log('📱 Using mobile deep link:', deepLink);
      return {
        url: deepLink,
        type: 'app'
      };
    } else {
      // Desktop users or in-app browsers go to Venmo web interface
      const webLink = `https://venmo.com/${venmoUsername}`;
      console.log('🌐 Using web link:', webLink);
      return {
        url: webLink,
        type: 'web'
      };
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Information Copied Successfully",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: `Please manually copy: ${text}`,
        variant: "destructive",
      });
    }
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
      // Generate and open Venmo link
      const { url, type } = generateVenmoLink(amount);
      
      console.log('🚀 Opening Venmo link:', { url, type });
      
      if (type === 'app') {
        // Enhanced mobile app opening with better fallbacks
        const startTime = Date.now();
        
        // Try to open the app
        const openResult = window.open(url, '_blank');
        console.log('📱 App open result:', openResult);
        
        // Set up visibility listener for mobile app redirect
        const handleVisibilityChange = () => {
          if (!document.hidden) {
            const timeAway = Date.now() - startTime;
            console.log('👀 User returned to browser after:', timeAway, 'ms');
            
            // Only auto-redirect if they were away for more than 3 seconds (likely used the app)
            if (timeAway > 3000) {
              navigate('/library', { state: { fromDonation: true } });
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange);
          }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Clean up listener after 5 minutes
        setTimeout(() => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        }, 300000);
        
        // Improved fallback detection
        setTimeout(() => {
          if (document.hasFocus()) {
            console.log('⚠️ Still in browser after 2 seconds, app likely not installed');
            toast({
              title: "Having trouble opening Venmo?",
              description: "Try downloading the app first or use the web version below",
              duration: 8000,
            });
          }
        }, 2000);
      } else {
        // Open web version for desktop or in-app browsers
        const openResult = window.open(url, '_blank');
        console.log('🌐 Web open result:', openResult);
        
        if (!openResult) {
          toast({
            title: "Pop-up blocked?",
            description: "Please allow pop-ups or manually visit venmo.com/@GpaJohn-Buddy",
            variant: "destructive",
          });
        }
      }

      // Show confirmation dialog instead of thank you modal
      setShowConfirmation(true);
      
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

  const handleDonationConfirm = async () => {
    try {
      // Record donation in database
      const { error } = await supabase.functions.invoke('track-donation', {
        body: { amount: parseFloat(finalAmount) }
      });

      if (error) {
        console.error('Error tracking donation:', error);
        // Don't block the user experience if tracking fails
      }

      setShowConfirmation(false);
      setShowThankYou(true);
    } catch (error) {
      console.error('Error processing donation confirmation:', error);
      setShowConfirmation(false);
      setShowThankYou(true); // Still show thank you since user confirmed
    }
  };

  const handleDonationCancel = () => {
    setShowConfirmation(false);
    toast({
      title: "No problem!",
      description: "You can try again anytime. Thanks for considering a donation!",
    });
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
              {isSubmitting ? 'Processing...' : (
                <div className="flex items-center justify-center gap-2">
                  {/* Venmo Logo SVG */}
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    className="text-white"
                  >
                    <path d="M19.83 4.17c1.58 1.58 2.17 3.83 2.17 6.08 0 6.25-7.42 13.75-10.08 13.75-1.92 0-2.67-1.17-2.67-2.42 0-1.33.42-2.83 1.17-4.75L12 5.25h3.25L13.5 17.08c2.08-2.83 5.25-7.33 5.25-10.58 0-1.25-.25-2.08-.92-2.33z"/>
                  </svg>
                  {isMobile ? 'Open Venmo App' : 'Visit Venmo.com'}
                  <ExternalLink className="h-4 w-4" />
                </div>
              )}
            </Button>

            <div className="text-center space-y-2">
              {/* In-app browser warning */}
              {inAppBrowser && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                  <p className="text-xs font-medium text-amber-800 mb-1">
                    ⚠️ Using {isMobile ? 'social media' : 'in-app'} browser detected
                  </p>
                  <p className="text-xs text-amber-700">
                    For best results, open this page in Safari (iOS) or Chrome (Android)
                  </p>
                </div>
              )}
              
              <p className="text-xs text-gray-500">
                {isMobile 
                  ? "You'll be redirected to the Venmo app or website"
                  : "You'll be redirected to Venmo.com to complete your donation"
                }
              </p>
              
              {!isMobile && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                  <p className="text-xs font-medium text-blue-800">
                    For desktop users:
                  </p>
                  <div className="flex items-center justify-between bg-white rounded border px-2 py-1">
                    <span className="text-xs font-mono text-gray-700">@GpaJohn-Buddy</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard('@GpaJohn-Buddy', 'Username')}
                      className="h-6 px-2 text-xs"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-blue-600">
                    Search for this username on Venmo.com or in the app
                  </p>
                </div>
              )}

              {/* Having Trouble Section */}
              <details className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <summary className="text-xs font-medium text-blue-800 cursor-pointer hover:text-blue-900">
                  💡 Having trouble? Click for help
                </summary>
                <div className="mt-2 space-y-2 text-xs text-blue-700">
                  <div className="space-y-1">
                    <p className="font-medium">If Venmo app won't open:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Make sure Venmo app is installed and updated</li>
                      <li>Try opening in Safari (iOS) or Chrome (Android)</li>
                      <li>Disable "Request Desktop Website" in browser settings</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="font-medium">Alternative methods:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Open Venmo app manually and search "@GpaJohn-Buddy"</li>
                      <li>Visit venmo.com in your browser</li>
                      <li>Use the QR code below (mobile only)</li>
                    </ul>
                  </div>
                </div>
              </details>

              {/* Mobile App Store QR Code */}
              {isMobile && getAppStoreLink() && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-green-600" />
                    <p className="text-xs font-medium text-green-800">
                      Don't have the Venmo app?
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2">
                    <QRCodeSVG 
                      value={getAppStoreLink()!} 
                      size={100}
                      level="M"
                      includeMargin={true}
                    />
                    <p className="text-xs text-green-600 text-center">
                      Scan to download Venmo from your app store
                    </p>
                  </div>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <DonationConfirmationDialog
        isOpen={showConfirmation}
        amount={finalAmount}
        onConfirm={handleDonationConfirm}
        onCancel={handleDonationCancel}
      />

      <ThankYouModal
        isOpen={showThankYou}
        onClose={() => setShowThankYou(false)}
        amount={finalAmount}
      />
    </>
  );
};

export default VenmoDonationForm;