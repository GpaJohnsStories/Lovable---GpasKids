import React from "react";
import IsolatedStoryRenderer from "@/components/story/IsolatedStoryRenderer";

const LibraryInstructions: React.FC = () => {
  // For now, use static fallback content to avoid the TypeScript compilation issue
  // This can be updated later when the TS issue is resolved
  const content = `
    <div style="margin-bottom: 16px; text-align: center;">
      Hover over a story title and it will turn red.<br />Click on a story title and it will take you to the story page where you may enjoy it.
    </div>
    <div style="margin-bottom: 16px; text-align: center;">
      Click on any column heading to sort the library by that column.<br />The first click will always sort down and the next click will sort up.
    </div>
    <div style="text-align: center;">
      As more stories are loaded, you may want to keep a note on your device or even use<br />pencil and paper to record the Story Code so you can find it easily in the future.
    </div>
  `;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 relative">
      <div className="text-18-system">
        <IsolatedStoryRenderer 
          content={content}
          category="WebText"
          fontSize={18}
          showHeaderPreview={false}
        />
      </div>
      
      {/* Web-text code indicator */}
      <div className="code-indicator">
        SYS-LIB
      </div>
    </div>
  );
};

export default LibraryInstructions;