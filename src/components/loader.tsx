import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
}
const Loader: React.FC<LoaderProps> = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={` ${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-blue-500`}
      />
    </div>
  );
};

export default Loader;
