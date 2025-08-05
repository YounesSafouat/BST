"use client";

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
     src: string;
     alt: string;
     width?: number;
     height?: number;
     className?: string;
     priority?: boolean;
     sizes?: string;
     quality?: number;
}

export default function OptimizedImage({
     src,
     alt,
     width = 800,
     height = 600,
     className = '',
     priority = false,
     sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
     quality = 85
}: OptimizedImageProps) {
     const [isLoading, setIsLoading] = useState(true);
     const [error, setError] = useState(false);

     const handleLoad = () => {
          setIsLoading(false);
     };

     const handleError = () => {
          setError(true);
          setIsLoading(false);
     };

     if (error) {
          return (
               <div
                    className={`bg-gray-200 flex items-center justify-center ${className}`}
                    style={{ width: width, height: height }}
               >
                    <span className="text-gray-500 text-sm">Image non disponible</span>
               </div>
          );
     }

     return (
          <div className={`relative ${className}`}>
               {isLoading && (
                    <div
                         className="absolute inset-0 bg-gray-200 animate-pulse"
                         style={{ width: width, height: height }}
                    />
               )}
               <Image
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'
                         }`}
                    priority={priority}
                    sizes={sizes}
                    quality={quality}
                    onLoad={handleLoad}
                    onError={handleError}
                    loading={priority ? 'eager' : 'lazy'}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
               />
          </div>
     );
} 