import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCachedIcon } from '@/hooks/useCachedIcon';

interface CopyrightIconProps {
  copyrightStatus: string;
}

const CopyrightIcon: React.FC<CopyrightIconProps> = ({ copyrightStatus }) => {
  // Map copyright status to icon and navigation target
  const getIconConfig = (status: string) => {
    switch (status) {
      case '©':
        return {
          iconPath: '!CO-CR1.jpg',
          tooltip: '© Full Copyright - All rights reserved. Click for more information'
        };
      case 'L':
        return {
          iconPath: '!CO-CR2.jpg',
          tooltip: 'L Limited Sharing - Gpa John\'s Copyright. Click for more information'
        };
      case 'O':
        return {
          iconPath: '!CO-CR3.jpg',
          tooltip: 'O Open, No Copyright - Free to share. Click for more information'
        };
      default:
        return {
          iconPath: '!CO-CR1.jpg',
          tooltip: '© Full Copyright - All rights reserved. Click for more information'
        };
    }
  };

  const status = copyrightStatus || '©';
  const config = getIconConfig(status);
  const { iconUrl, isLoading, error } = useCachedIcon(config.iconPath);

  // Show loading or error fallback
  if (isLoading) {
    return (
      <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
    );
  }

  if (error || !iconUrl) {
    // Fallback to text display if icon fails to load
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a href="/copyright-info" target="_blank" rel="noopener noreferrer">
          <span className={`text-xs font-bold px-2 py-1 rounded text-white cursor-pointer ${status === '©' ? 'bg-red-500' : status === 'O' ? 'bg-green-500' : 'bg-yellow-500'}`}>
            {status}
          </span>
        </a>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-xs">
          {config.tooltip}
        </div>
      </TooltipContent>
    </Tooltip>
  );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a href="/copyright-info" target="_blank" rel="noopener noreferrer" className="block">
          <div className="w-8 h-8 rounded cursor-pointer hover:scale-110 transition-transform duration-200 shadow-lg border border-gray-300">
            <img 
              src={iconUrl} 
              alt={`Copyright status: ${status}`}
              className="w-full h-full object-cover rounded"
            />
          </div>
        </a>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-xs">
          {config.tooltip}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default CopyrightIcon;