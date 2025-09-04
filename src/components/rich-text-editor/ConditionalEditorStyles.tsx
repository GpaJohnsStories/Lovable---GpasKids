import React from 'react';

interface ConditionalEditorStylesProps {
  category?: "Fun" | "Life" | "North Pole" | "World Changers" | "WebText" | "BioText" | "STORY" | "Admin";
}

const ConditionalEditorStyles: React.FC<ConditionalEditorStylesProps> = ({ category }) => {
  const isWebText = category === "WebText";
  
  const baseFontFamily = isWebText 
    ? "'Kalam', 'Comic Sans MS', 'Arial', sans-serif" 
    : "'Georgia', serif";

  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        .story-content[contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: italic;
        }
        
        /* Force the admin editor to match category-specific styling */
         .story-content[contenteditable] {
           font-family: ${baseFontFamily} !important;
           font-size: 18px !important;
           color: #000000 !important;
           line-height: 1.5 !important;
           font-weight: normal !important;
           font-style: normal !important;
         }
        
         .story-content[contenteditable] * {
           font-family: ${baseFontFamily} !important;
           color: #000000 !important;
           line-height: 1.5 !important;
         }
        
         .story-content[contenteditable] span {
           font-family: ${baseFontFamily} !important;
           font-size: 18px !important;
           color: #000000 !important;
           line-height: 1.5 !important;
         }
        
         .story-content[contenteditable] p {
           font-family: ${baseFontFamily} !important;
           font-size: 18px !important;
           color: #000000 !important;
           line-height: 1.5 !important;
           font-weight: normal !important;
           font-style: normal !important;
           margin: 0 0 0.5em 0 !important;
           min-height: 1.5em !important;
         }
        
         .story-content[contenteditable] div {
           font-family: ${baseFontFamily} !important;
           font-size: 18px !important;
           color: #000000 !important;
           line-height: 1.5 !important;
           margin: 0 0 0.5em 0 !important;
           min-height: 1.5em !important;
         }
        
         /* Preserve text alignment styles */
         .story-content[contenteditable] p[style*="text-align"],
         .story-content[contenteditable] div[style*="text-align"] {
           /* Keep alignment but force other styles */
           font-family: ${baseFontFamily} !important;
           font-size: 18px !important;
           color: #000000 !important;
           line-height: 1.5 !important;
         }
        
        /* Force heading styles to match */
        .story-content[contenteditable] h1 {
          font-size: 2em !important;
          font-weight: bold !important;
          margin: 0 0 1.5em 0 !important;
          font-family: ${baseFontFamily} !important;
          color: #000000 !important;
          line-height: 1.6 !important;
        }
        
        .story-content[contenteditable] h2 {
          font-size: 1.5em !important;
          font-weight: bold !important;
          margin: 0 0 1.5em 0 !important;
          font-family: ${baseFontFamily} !important;
          color: #000000 !important;
          line-height: 1.6 !important;
        }
        
        .story-content[contenteditable] h3 {
          font-size: 1.17em !important;
          font-weight: bold !important;
          margin: 0 0 1.5em 0 !important;
          font-family: ${baseFontFamily} !important;
          color: #000000 !important;
          line-height: 1.6 !important;
        }
        
        .story-content[contenteditable] strong,
        .story-content[contenteditable] b {
          font-weight: bold !important;
          font-family: ${baseFontFamily} !important;
          font-size: 18px !important;
          color: #000000 !important;
          line-height: 1.6 !important;
        }
        
        .story-content[contenteditable] em,
        .story-content[contenteditable] i {
          font-style: italic !important;
          font-family: ${baseFontFamily} !important;
          font-size: 18px !important;
          color: #000000 !important;
          line-height: 1.6 !important;
        }
        
        .story-content[contenteditable] u {
          text-decoration: underline !important;
          font-family: ${baseFontFamily} !important;
          font-size: 18px !important;
          color: #000000 !important;
          line-height: 1.6 !important;
        }
        
        .story-content[contenteditable] ul {
          list-style-type: disc !important;
          margin: 0 0 1.5em 0 !important;
          padding-left: 2em !important;
          font-family: ${baseFontFamily} !important;
          font-size: 18px !important;
          color: #000000 !important;
          line-height: 1.6 !important;
        }
        
        .story-content[contenteditable] ol {
          list-style-type: decimal !important;
          margin: 0 0 1.5em 0 !important;
          padding-left: 2em !important;
          font-family: ${baseFontFamily} !important;
          font-size: 18px !important;
          color: #000000 !important;
          line-height: 1.6 !important;
        }
        
        .story-content[contenteditable] li {
          margin: 0.5em 0 !important;
          font-family: ${baseFontFamily} !important;
          font-size: 18px !important;
          color: #000000 !important;
          line-height: 1.6 !important;
        }
      `
    }} />
  );
};

export default ConditionalEditorStyles;