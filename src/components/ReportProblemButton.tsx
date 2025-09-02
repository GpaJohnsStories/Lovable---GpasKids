import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { ReportProblemDialog } from './ReportProblemDialog';

const ReportProblemButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        className="fixed bottom-4 right-4 z-40 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg rounded-full p-3 h-auto min-h-[48px] min-w-[48px] text-sm font-semibold"
        size="sm"
      >
        <MessageCircle className="h-5 w-5 mr-1" />
        <span className="hidden sm:inline">Report</span>
      </Button>

      <ReportProblemDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default ReportProblemButton;