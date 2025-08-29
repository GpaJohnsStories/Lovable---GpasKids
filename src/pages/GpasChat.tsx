import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const GpasChat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('chat-with-gpa', {
        body: { message: message.trim() }
      });

      if (error) throw error;

      // Replace user message with Grandpa's response
      setMessage(data.response || "Sorry kiddo, Grandpa didn't catch that. Can you say that again?");
    } catch (error) {
      console.error('Error sending message:', error);
      setMessage("Oh my, Grandpa's having trouble hearing you right now. Try again in a moment, kiddo!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Gpa's Chat Room | GpasKids.com</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <textarea 
          className="w-1/2 h-1/2 border-2 border-primary rounded-lg p-4 text-lg family-text resize-none"
          placeholder="Type your message to Grandpa here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        
        <Button 
          variant="default"
          className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold text-xl px-8 py-4 disabled:opacity-50"
          style={{ fontSize: '21px', fontFamily: 'Arial', fontWeight: 'bold' }}
          onClick={handleSendMessage}
          disabled={isLoading || !message.trim()}
        >
          {isLoading ? 'Grandpa is thinking...' : 'Your Turn'}
        </Button>
      </div>
    </>
  );
};

export default GpasChat;