import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { ReportProblemDialog } from './ReportProblemDialog';
import { useCachedIcon } from '@/hooks/useCachedIcon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ReportProblemButtonProps {
  inline?: boolean;
}

const ReportProblemButton: React.FC<ReportProblemButtonProps> = ({ inline = false }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { iconUrl, isLoading } = useCachedIcon('!CO-CUS.gif');

  const buttonContent = (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => setIsDialogOpen(true)}
            variant="link"
            className="p-0 m-0 bg-transparent hover:bg-transparent border-none shadow-none h-auto w-auto focus:ring-0 focus:outline-none no-underline hover:no-underline cursor-pointer"
            aria-label="Contact us"
          >
            <div className="w-[65px] h-[65px] flex items-center justify-center">
              {iconUrl ? (
                <img 
                  src={iconUrl} 
                  alt="Contact us" 
                  className="h-[65px] w-[65px] block"
                />
              ) : (
                <MessageCircle className="h-8 w-8 text-orange-500" />
              )}
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-[#F97316] border-[#F97316]">
          <p className="font-fun text-21px font-bold text-white" style={{
            textShadow: '2px 2px 0px #666, 4px 4px 0px #333, 6px 6px 8px rgba(0,0,0,0.3)',
            fontFamily: 'Arial, sans-serif'
          }}>Contact Us</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <>
      {inline ? (
        buttonContent
      ) : (
        <div className="fixed bottom-20 left-4 z-40">
          {buttonContent}
        </div>
      )}

      <ReportProblemDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default ReportProblemButton;