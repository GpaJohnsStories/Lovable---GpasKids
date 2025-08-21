import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCachedIcon } from '@/hooks/useCachedIcon';

interface PrintIconProps {
  storyCode: string;
}

const PrintIcon: React.FC<PrintIconProps> = ({ storyCode }) => {
  const { iconUrl, isLoading, error } = useCachedIcon('!CO-PTR.gif');

  const handleClick = (e: React.MouseEvent) => {
    console.log('Print icon clicked for story:', storyCode);
    // Don't prevent default - let the Link handle navigation
  };

  // Show loading placeholder
  if (isLoading) {
    return (
      <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
    );
  }

  // Fallback to text display if icon fails to load
  if (error || !iconUrl) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={`/story/${storyCode}?print=1`} target="_blank" rel="noopener noreferrer" onClick={handleClick}>
            <span className="text-xs font-bold px-2 py-1 rounded bg-blue-500 text-white cursor-pointer hover:bg-blue-600">
              Print
            </span>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs">
            Click to create PDF for printing
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link to={`/story/${storyCode}?print=1`} target="_blank" rel="noopener noreferrer" onClick={handleClick}>
          <div className="w-8 h-8 rounded cursor-pointer hover:scale-110 transition-transform duration-200 shadow-lg border border-gray-300">
            <img 
              src={iconUrl} 
              alt="Print this story (PDF)"
              className="w-full h-full object-cover rounded"
            />
          </div>
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-xs">
          Click to create PDF for printing
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default PrintIcon;