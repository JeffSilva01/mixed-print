import React, { useRef, useState, memo, useCallback } from 'react';
import type { ImageUploadProps } from '../types';
import { useImageUpload } from '../hooks/useImageUpload';

const ImageUpload: React.FC<ImageUploadProps> = memo(({ onImageSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isUploading, error, uploadImage, clearError } = useImageUpload();

  const handleFile = useCallback((file: File) => {
    clearError();
    uploadImage(file, onImageSelect);
  }, [uploadImage, onImageSelect, clearError]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const handleButtonClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div className="space-y-2">
      <div
        className={`
          w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleChange}
          disabled={isUploading}
        />
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          {isUploading ? (
            <>
              <svg 
                className="w-8 h-8 mb-2 animate-spin" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <p className="text-sm">Processando imagem...</p>
            </>
          ) : (
            <>
              <svg 
                className="w-8 h-8 mb-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-sm">
                Clique ou arraste uma imagem aqui
              </p>
              <p className="text-xs text-gray-400">
                JPG, PNG, GIF, WebP até 10MB
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm p-2 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}
    </div>
  );
});

ImageUpload.displayName = 'ImageUpload';

export default ImageUpload;