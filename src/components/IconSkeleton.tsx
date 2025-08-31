import React from 'react';
import { cn } from '@/lib/utils';

interface IconSkeletonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const IconSkeleton: React.FC<IconSkeletonProps> = ({ 
  className,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div 
      className={cn(
        'animate-pulse bg-muted rounded',
        sizeClasses[size],
        className
      )}
      aria-label="Loading icon..."
    />
  );
};