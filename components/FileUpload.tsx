'use client';

import { useState, useRef } from 'react';

interface FileUploadProps {
  uploadType: 'lesson-plan' | 'test' | 'student-photo';
  onUploadComplete: (fileData: { url: string; filename: string }) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export default function FileUpload({ 
  uploadType, 
  onUploadComplete, 
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSize = 10,
  className = ''
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', uploadType);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      setUploadProgress(100);
      
      setTimeout(() => {
        onUploadComplete({
          url: result.url,
          filename: result.filename
        });
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);

    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const getUploadIcon = () => {
    switch (uploadType) {
      case 'lesson-plan':
      case 'test':
        return '📄';
      case 'student-photo':
        return '📷';
      default:
        return '📎';
    }
  };

  const getUploadText = () => {
    switch (uploadType) {
      case 'lesson-plan':
        return 'Upload lesson plan PDF';
      case 'test':
        return 'Upload test PDF';
      case 'student-photo':
        return 'Upload student photo';
      default:
        return 'Upload file';
    }
  };

  return (
    <div className={className}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        <div className="text-4xl mb-4">{getUploadIcon()}</div>

        {isUploading ? (
          <div>
            <p className="text-sm text-gray-600 mb-2">Uploading...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-2">
              {dragActive ? 'Drop file here' : getUploadText()}
            </p>
            <p className="text-xs text-gray-500">
              Drag and drop or click to browse • Max {maxSize}MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
