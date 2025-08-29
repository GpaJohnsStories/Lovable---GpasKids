import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';

const GpasChat: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Gpa's Chat Room | GpasKids.com</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <textarea 
          className="w-1/2 h-1/2 border-2 border-primary rounded-lg p-4 text-lg family-text resize-none"
          placeholder=""
        />
        
        <Button 
          variant="default"
          className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold text-xl px-8 py-4"
          style={{ fontSize: '21px', fontFamily: 'Arial', fontWeight: 'bold' }}
        >
          Your Turn
        </Button>
      </div>
    </>
  );
};

export default GpasChat;