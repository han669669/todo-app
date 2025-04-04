import React from 'react';
import { Icon } from '@iconify/react';

interface LoadingIndicatorProps {
  fullScreen?: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  fullScreen = false,
  message = 'Loading...',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'h-screen' : ''}`}>
      <div className={`animate-spin ${sizeClasses[size]}`}>
        <Icon icon="lucide:loader" />
      </div>
      {message && <p className="mt-2 text-default-500">{message}</p>}
    </div>
  );
};