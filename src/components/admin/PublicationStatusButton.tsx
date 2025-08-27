import React from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PublicationStatusButtonProps {
  storyId: string;
  currentStatus: number;
  onStatusChange?: () => void;
}

const PublicationStatusButton: React.FC<PublicationStatusButtonProps> = ({ 
  storyId, 
  currentStatus, 
  onStatusChange 
}) => {
  const getNextStatus = (current: number): number => {
    // Cycle: 5 → 4 → 3 → 2 → 1 → 0 → 5
    switch (current) {
      case 5: return 4;
      case 4: return 3;
      case 3: return 2;
      case 2: return 1;
      case 1: return 0;
      case 0: return 5;
      default: return 5;
    }
  };

  const getStatusButtonStyle = (status: number) => {
    const baseStyle = {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      border: '3px solid #333',
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold' as const,
      cursor: 'pointer' as const,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.3)',
      transition: 'all 0.2s ease',
      transform: 'translateY(0px)'
    };

    const hoverStyle = {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 12px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.4)'
    };

    switch (status) {
      case 0:
        return {
          ...baseStyle,
          backgroundColor: '#228B22', // Forest Green
          color: 'white'
        };
      case 1:
        return {
          ...baseStyle,
          backgroundColor: '#10b981', // Green Emerald
          color: 'white'
        };
      case 2:
        return {
          ...baseStyle,
          backgroundColor: '#FFD700', // Golden Yellow
          color: '#228B22' // Forest Green text
        };
      case 3:
        return {
          ...baseStyle,
          backgroundColor: '#3b82f6', // Blue Primary
          color: 'white'
        };
      case 4:
        return {
          ...baseStyle,
          backgroundColor: '#9c441a', // Brown Earth
          color: 'white'
        };
      default: // 5
        return {
          ...baseStyle,
          backgroundColor: '#DC143C', // Red Crimson
          color: '#FFD700' // Golden Yellow text
        };
    }
  };

  const getStatusDescription = (status: number): string => {
    const statusLabels = [
      "0 - Ready to be Saved & Published — Approved and Reviewed",
      "1 - Ready to be Saved & Published — Approved Only", 
      "2 - Saved, NOT PUBLISHED — Not Reviewed by CoPilot",
      "3 - Saved — NOT APPROVED by Gpa",
      "4 - Saved — Still being formatted",
      "5 - FILE NOT SAVED"
    ];
    return statusLabels[status] || statusLabels[5];
  };

  const getTooltipStyle = (status: number) => {
    const statusStyle = getStatusButtonStyle(status);
    return {
      backgroundColor: statusStyle.backgroundColor,
      color: statusStyle.color,
      fontSize: '21px',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '4px'
    };
  };

  const handleClick = async () => {
    const nextStatus = getNextStatus(currentStatus);
    
    try {
      const { error } = await supabase
        .from('stories')
        .update({ publication_status_code: nextStatus })
        .eq('id', storyId);

      if (error) {
        console.error('Error updating publication status:', error);
        toast.error('Failed to update publication status');
        return;
      }

      toast.success(`Status updated to ${nextStatus}`);
      onStatusChange?.();
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Failed to update publication status');
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
            style={getStatusButtonStyle(currentStatus)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.3)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(1px)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.2)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.4)';
            }}
          >
            {currentStatus}
          </button>
        </TooltipTrigger>
        <TooltipContent style={getTooltipStyle(currentStatus)}>
          {getStatusDescription(currentStatus)}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PublicationStatusButton;