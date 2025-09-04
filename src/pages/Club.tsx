import React from 'react';
import WelcomeHeader from "@/components/WelcomeHeader";
import CookieFreeFooter from "@/components/CookieFreeFooter";

import { WebTextBox } from "@/components/WebTextBox";
import ClubPersonalIdSection from "@/components/ClubPersonalIdSection";
import ClubNicknameSection from "@/components/ClubNicknameSection";
import { usePersonalId } from "@/hooks/usePersonalId";

const Club = () => {
  const { personalId, setPersonalId } = usePersonalId();

  const handlePersonalIdGenerated = (newPersonalId: string) => {
    setPersonalId(newPersonalId);
    // Store in sessionStorage for other forms
    sessionStorage.setItem('tempPersonalId', newPersonalId);
  };

  const handleNicknameSet = (nickname: string) => {
    // Store in sessionStorage for other forms
    sessionStorage.setItem('tempNickname', nickname);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <WelcomeHeader />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Welcome Text */}
        <WebTextBox
          webtextCode="SYS-CLB"
          borderColor="border-amber-200"
          backgroundColor="bg-white/80"
          title="Welcome to Grandpa's Club!"
        />

        {/* Personal ID Section */}
        <div className="mt-8 bg-white/90 rounded-lg shadow-sm border border-amber-200 p-6">
          <ClubPersonalIdSection 
            onPersonalIdGenerated={handlePersonalIdGenerated}
            showExplanation={true}
            className="space-y-4"
          />
        </div>

        {/* Nickname Section - Only show if Personal ID exists */}
        {personalId && personalId.length === 6 && (
          <div className="mt-8 bg-white/90 rounded-lg shadow-sm border border-amber-200 p-6">
            <ClubNicknameSection
              personalId={personalId}
              onNicknameSet={handleNicknameSet}
            />
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            What can you do with your Personal ID and Friend Name?
          </h3>
          <ul className="list-disc list-inside text-blue-700 space-y-1">
            <li>Write comments and questions about Grandpa's stories</li>
            <li>See your friend name instead of your Personal ID when viewing comments</li>
            <li>Keep your identity private and safe</li>
            <li>Join the conversation with other young readers</li>
          </ul>
          <p className="text-sm text-blue-600 mt-3">
            Remember: You can always come back here to change your friend name anytime!
          </p>
        </div>
      </main>
      
      <CookieFreeFooter />
    </div>
  );
};

export default Club;