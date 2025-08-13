import React, { useState } from 'react';
import { uploadIconFromGoogleDrive } from '@/utils/iconUpload';
import { Button } from '@/components/ui/button';

export const UploadIcon = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    setIsUploading(true);
    setMessage('');

    try {
      // Replace this with your actual Google Drive link
      const googleDriveUrl = 'https://drive.google.com/file/d/YOUR_FILE_ID/view';
      
      const result = await uploadIconFromGoogleDrive(
        googleDriveUrl,
        '!ICO-CDY.png',
        'Peppermint candy audio button icon'
      );

      if (result.success) {
        setMessage('✅ Icon uploaded successfully!');
      } else {
        setMessage(`❌ Upload failed: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Unexpected error: ${error}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Upload Peppermint Candy Icon</h1>
      <Button 
        onClick={handleUpload} 
        disabled={isUploading}
        className="mb-4"
      >
        {isUploading ? 'Uploading...' : 'Upload !ICO-CDY.png'}
      </Button>
      {message && (
        <div className="p-4 rounded-lg bg-gray-100">
          {message}
        </div>
      )}
    </div>
  );
};