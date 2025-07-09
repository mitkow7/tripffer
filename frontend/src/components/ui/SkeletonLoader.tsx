import React from 'react';
import { clsx } from 'clsx';

interface SkeletonLoaderProps {
  className?: string;
  rows?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ className, rows = 1 }) => {
  return (
    <div className="animate-pulse">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className={clsx(
            'bg-gray-200 rounded-md',
            rows > 1 && index < rows - 1 && 'mb-2',
            className || 'h-4 w-full'
          )}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;