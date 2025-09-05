import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { WordLimitedTextarea } from "@/components/ui/word-limited-textarea";
import ThankYouModal from './ThankYouModal';
import { containsBadWord } from '@/utils/profanity';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { WebTextBox } from './WebTextBox';
import { useCachedIcon } from '@/hooks/useCachedIcon';
import { X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import unicornIcon from '@/assets/unicorn-icon.png';
import elephantIcon from '@/assets/elephant-icon.png';
import eagleIcon from '@/assets/eagle-icon.png';
import vipIcon from '@/assets/vip-icon.png';
import giraffeIcon from '@/assets/giraffe-icon.png';
import reindeerIcon from '@/assets/reindeer-icon.png';
import questionIcon from '@/assets/question-icon.png';
interface ReportProblemDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
export const ReportProblemDialog: React.FC<ReportProblemDialogProps> = ({
  isOpen,
  onClose
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    description: '',
    whoAreYou: '',
    pageUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [profanityError, setProfanityError] = useState('');
  const [startTime, setStartTime] = useState<number>(0);

  // Load exit icon
  const { iconUrl: exitIconUrl, isLoading: exitIconLoading } = useCachedIcon('!CO-XIT.gif');

  // Load Unicorn icon from icon library
  const { iconUrl: unicornIconUrl, iconName: unicornIconName, isLoading: unicornIconLoading } = useCachedIcon('!CO-UNI.gif');
  
  // Load remaining icons from icon library
  const { iconUrl: elephantIconUrl } = useCachedIcon('!CO-ELE.gif');
  const { iconUrl: eagleIconUrl } = useCachedIcon('!CO-EGL.gif');
  const { iconUrl: vipIconUrl } = useCachedIcon('!CO-VIP.gif');
  const { iconUrl: giraffeIconUrl } = useCachedIcon('!CO-GRF.gif');
  const { iconUrl: reindeerIconUrl } = useCachedIcon('!CO-RDR.gif');
  const { iconUrl: questionIconUrl } = useCachedIcon('!CO-WRU.gif');

  // Icon mapping for "Who are you?" choices
  const iconMap: Record<string, string> = {
    'Unicorn': unicornIconUrl || unicornIcon,
    'Elephant': elephantIconUrl || elephantIcon, 
    'Eagle': eagleIconUrl || eagleIcon,
    'Important Person': vipIconUrl || vipIcon,
    'Giraffe': giraffeIconUrl || giraffeIcon,
    'Reindeer': reindeerIconUrl || reindeerIcon,
    'Rather not say': questionIconUrl || questionIcon
  };
  useEffect(() => {
    if (isOpen) {
      setStartTime(Date.now());
      setFormData(prev => ({
        ...prev,
        pageUrl: window.location.href
      }));
    }
  }, [isOpen]);
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Check for profanity in text fields
    if (['name', 'email', 'description'].includes(field) && value) {
      if (containsBadWord(value)) {
        setProfanityError('Please use appropriate language in your message.');
        return;
      }
    }
    setProfanityError('');
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim() || !formData.description.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in your name and description.",
        variant: "destructive"
      });
      return;
    }
    if (!formData.whoAreYou) {
      toast({
        title: "Please tell us who you are",
        description: "This helps us know you're not a robot.",
        variant: "destructive"
      });
      return;
    }

    // Check minimum interaction time (3 seconds)
    const interactionTime = Date.now() - startTime;
    if (interactionTime < 3000) {
      toast({
        title: "Please take your time",
        description: "Please spend a moment reviewing your message.",
        variant: "destructive"
      });
      return;
    }

    // Final profanity check
    const fieldsToCheck = [formData.name, formData.email, formData.description];
    if (fieldsToCheck.some(field => containsBadWord(field))) {
      setProfanityError('Please use appropriate language in your message.');
      return;
    }
    setIsSubmitting(true);
    try {
      const {
        error
      } = await supabase.functions.invoke('report-problem', {
        body: {
          ...formData,
          userAgent: navigator.userAgent,
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          timestamp: new Date().toISOString(),
          interactionTime
        }
      });
      if (error) throw error;
      setShowThankYou(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        description: '',
        whoAreYou: '',
        pageUrl: window.location.href
      });
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Submission failed",
        description: "Please try again in a moment.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleClose = () => {
    setShowThankYou(false);
    onClose();
    setProfanityError('');
    // Clear all form data for security
    setFormData({
      name: '',
      email: '',
      subject: '',
      description: '',
      whoAreYou: '',
      pageUrl: window.location.href
    });
  };
  if (showThankYou) {
    return <ThankYouModal isOpen={isOpen} onClose={handleClose} amount="your message" customMessage="Thank you for reaching out! We'll get back to you soon." />;
  }
  return <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto [&>button]:hidden">
        {/* Custom close button with exit icon */}
        <div className="absolute top-2 right-2 z-20">
          <button
            onClick={handleClose}
            className="flex items-center justify-center hover:opacity-80 transition-opacity"
            aria-label="Close dialog"
          >
            {exitIconLoading ? (
              <div className="w-[60px] h-[35px] bg-gray-200 animate-pulse rounded"></div>
            ) : exitIconUrl ? (
              <img 
                src={exitIconUrl} 
                alt="Exit" 
                className="w-[60px] h-[35px] object-contain"
              />
            ) : (
              <X className="w-6 h-6 text-gray-500" />
            )}
          </button>
        </div>
        
        <DialogHeader className="text-left">
        </DialogHeader>

        {/* Webtext section - placeholder for SYS-CGJ */}
        <div className="mb-4">
          <WebTextBox webtextCode="SYS-CGJ" borderColor="#f59e0b" backgroundColor="bg-amber-50" title="Report Guidelines" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-[21px] font-normal" style={{fontFamily: 'Arial, sans-serif'}}>Your Name (optional)</Label>
            <Input id="name" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} placeholder="What should we call you?" className="mt-1 text-[21px] font-normal border-2" style={{fontFamily: 'Arial, sans-serif', borderColor: '#f59e0b'}} />
          </div>

          <div>
            <Label htmlFor="email" className="text-[21px] font-normal" style={{fontFamily: 'Arial, sans-serif'}}>Email (optional)</Label>
            <Input id="email" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} placeholder="Only if you want a reply" className="mt-1 text-[21px] font-normal border-2" style={{fontFamily: 'Arial, sans-serif', borderColor: '#f59e0b'}} />
          </div>


          <div className="relative">
            <Label htmlFor="description" className="text-[21px] font-normal" style={{fontFamily: 'Arial, sans-serif'}}>What can we fix? How can we help?</Label>
            <WordLimitedTextarea id="description" value={formData.description} onChange={e => handleInputChange('description', e.target.value)} placeholder="Write it all here" wordLimit={200} className="mt-1 min-h-[80px] text-[21px] font-normal border-2" style={{fontFamily: 'Arial, sans-serif', borderColor: '#f59e0b'}} />
            
            {/* Dynamic icon display after selection */}
            {formData.whoAreYou && (
              <div className="absolute right-0 flex items-center" style={{bottom: '-38px'}}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <img 
                        src={iconMap[formData.whoAreYou]} 
                        alt={`${formData.whoAreYou} icon`}
                        className="w-16 h-16 object-contain"
                      />
                    </TooltipTrigger>
                    <TooltipContent className="bg-amber-50 border border-amber-200 shadow-md text-amber-900">
                      <p className="font-fun font-bold text-[21px]">
                        {formData.whoAreYou === 'Unicorn' && unicornIconName ? unicornIconName : formData.whoAreYou}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>

          <div>
            <Label className="text-[21px] font-normal" style={{fontFamily: 'Arial, sans-serif'}}>Who are you?</Label>
            <RadioGroup value={formData.whoAreYou} onValueChange={value => handleInputChange('whoAreYou', value)} className="mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  {['Unicorn', 'Elephant', 'Eagle'].map(option => 
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="text-[21px] font-normal" style={{fontFamily: 'Arial, sans-serif'}}>{option}</Label>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Important Person" id="Important Person" />
                    <Label htmlFor="Important Person" className="text-[21px] font-normal" style={{fontFamily: 'Arial, sans-serif'}}>Important Person</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  {['Giraffe', 'Reindeer'].map(option => 
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="text-[21px] font-normal" style={{fontFamily: 'Arial, sans-serif'}}>{option}</Label>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Rather not say" id="Rather not say" />
                    <Label htmlFor="Rather not say" className="text-[21px] font-normal" style={{fontFamily: 'Arial, sans-serif'}}>Rather not say</Label>
                  </div>
                  <div className="flex justify-end space-x-3 pt-2">
                    <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting || !!profanityError} className="bg-primary hover:bg-primary/90">
                      {isSubmitting ? 'Sending...' : 'Send Report'}
                    </Button>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>


          {profanityError && <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center space-x-2">
                <span className="text-red-600 text-sm">{profanityError}</span>
              </div>
            </div>}
        </form>
      </DialogContent>
    </Dialog>;
};