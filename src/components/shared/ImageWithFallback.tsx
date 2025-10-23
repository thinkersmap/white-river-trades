'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
}

export function ImageWithFallback({ 
  src, 
  alt, 
  fill = false, 
  className = '', 
  width, 
  height, 
  placeholder = '/placeholder.png' 
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    console.log('Image failed to load:', src, 'falling back to:', placeholder);
    setImgSrc(placeholder);
    setHasError(true);
  };

  if (fill) {
    return (
      <div className="relative w-full h-full">
        <Image
          src={imgSrc}
          alt={alt}
          fill
          className={className}
          onError={handleError}
          priority
        />
        {hasError && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl">🏠</span>
              </div>
              <p className="text-sm">Image placeholder</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={handleError}
        priority
      />
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <span className="text-2xl">🏠</span>
            </div>
            <p className="text-sm">Image placeholder</p>
          </div>
        </div>
      )}
    </div>
  );
}
