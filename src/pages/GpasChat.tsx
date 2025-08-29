import React from 'react';
import { Helmet } from 'react-helmet-async';

const GpasChat: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Gpa's Chat Room | GpasKids.com</title>
        <meta 
          name="description" 
          content="A safe, secure chat room for children at GpasKids.com - where kids can chat in Grandpa's virtual living room." 
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-secondary/10 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg border-2 border-primary p-8 shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-primary mb-4 family-display">
                🏠 Gpa's Chat Room 💬
              </h1>
              <p className="text-xl text-foreground/80 family-text">
                Welcome to Grandpa's virtual living room! A safe place for kids to chat and share stories.
              </p>
            </div>

            <div className="bg-primary/5 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-primary mb-4 family-display">
                🛡️ Chat Room Rules
              </h2>
              <ul className="space-y-2 text-lg family-text">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Be kind and respectful to everyone</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>No sharing personal information (real names, addresses, phone numbers)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Use appropriate language - keep it family-friendly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Have fun sharing stories and making friends!</span>
                </li>
              </ul>
            </div>

            <div className="bg-secondary/10 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-secondary mb-4 family-display">
                🚧 Coming Soon!
              </h2>
              <p className="text-lg family-text text-foreground/80">
                Grandpa is still setting up the chat room to make sure it's the safest place possible for kids. 
                Check back soon for live chat features!
              </p>
            </div>

            <div className="text-center">
              <div className="inline-block bg-primary/10 rounded-full p-6">
                <span className="text-6xl">👴</span>
              </div>
              <p className="mt-4 text-lg family-text text-foreground/80">
                "In my living room, every child is welcome and every story matters!" - Grandpa
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GpasChat;