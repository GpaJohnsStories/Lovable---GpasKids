import React from 'react';
import { Link } from 'react-router-dom';
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
          tooltip: '© Full Copyright - All rights reserved. Click for more information',
          fragment: '#what-is-copyright'
        };
      case 'L':
        return {
          iconPath: '!CO-CR2.jpg',
          tooltip: 'L Limited Sharing - Gpa John\'s Copyright. Click for more information',
          fragment: '#what-is-limited-access'
        };
      case 'O':
        return {
          iconPath: '!CO-CR3.jpg',
          tooltip: 'O Open, No Copyright - Free to share. Click for more information',
          fragment: '#copyright-information-part-3'
        };
      default:
        return {
          iconPath: '!CO-CR1.jpg',
          tooltip: '© Full Copyright - All rights reserved. Click for more information',
          fragment: '#what-is-copyright'
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
          <Link to={`/writing${config.fragment}`}>
            <span className={`text-xs font-bold px-2 py-1 rounded text-white cursor-pointer ${status === '©' ? 'bg-red-500' : status === 'O' ? 'bg-green-500' : 'bg-yellow-500'}`}>
              {status}
            </span>
          </Link>
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
        <Link to={`/writing${config.fragment}`}>
          <div className="w-8 h-8 rounded cursor-pointer hover:scale-110 transition-transform duration-200 shadow-lg border border-gray-300">
            <img 
              src={iconUrl} 
              alt={`Copyright status: ${status}`}
              className="w-full h-full object-cover rounded"
            />
          </div>
        </Link>
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