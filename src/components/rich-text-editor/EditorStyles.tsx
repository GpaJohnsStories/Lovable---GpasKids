
import React from 'react';

const EditorStyles: React.FC = () => {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: italic;
        }
        
        .rich-editor {
          font-family: Georgia, serif;
          font-size: 18px;
          color: #000000;
          line-height: 1.6;
          font-weight: normal;
          font-style: normal;
        }
        
        .rich-editor * {
          font-family: Georgia, serif !important;
          font-size: 18px !important;
          color: #000000 !important;
          line-height: 1.6 !important;
        }
        
        .rich-editor p {
          margin: 0 0 1.5em 0;
          font-family: Georgia, serif;
          font-size: 18px;
          color: #000000;
          line-height: 1.6;
          font-weight: normal;
          font-style: normal;
          min-height: 1.6em;
        }
        
        .rich-editor p:last-child {
          margin-bottom: 0;
        }
        
        .rich-editor p:empty {
          min-height: 1.6em;
          margin: 0 0 1.5em 0;
        }
        
        .rich-editor div {
          font-family: Georgia, serif;
          font-size: 18px;
          color: #000000;
          line-height: 1.6;
          margin: 0 0 1.5em 0;
          min-height: 1.6em;
        }
        
        .rich-editor div:empty {
          min-height: 1.6em;
          margin: 0 0 1.5em 0;
        }
        
        .rich-editor br {
          line-height: 1.6;
        }
        
        .rich-editor h1 {
          font-size: 2em !important;
          font-weight: bold !important;
          margin: 0 0 1.5em 0 !important;
          font-family: Georgia, serif !important;
          color: #000000 !important;
          line-height: 1.6 !important;
        }
        
        .rich-editor h2 {
          font-size: 1.5em !important;
          font-weight: bold !important;
          margin: 0 0 1.5em 0 !important;
          font-family: Georgia, serif !important;
          color: #000000 !important;
          line-height: 1.6 !important;
        }
        
        .rich-editor h3 {
          font-size: 1.17em !important;
          font-weight: bold !important;
          margin: 0 0 1.5em 0 !important;
          font-family: Georgia, serif !important;
          color: #000000 !important;
          line-height: 1.6 !important;
        }
        
        .rich-editor ul {
          list-style-type: disc;
          margin: 0 0 1.5em 0;
          padding-left: 2em;
          font-family: Georgia, serif;
          font-size: 18px;
          color: #000000;
          line-height: 1.6;
        }
        
        .rich-editor ol {
          list-style-type: decimal;
          margin: 0 0 1.5em 0;
          padding-left: 2em;
          font-family: Georgia, serif;
          font-size: 18px;
          color: #000000;
          line-height: 1.6;
        }
        
        .rich-editor li {
          margin: 0.25em 0;
          font-family: Georgia, serif;
          font-size: 18px;
          color: #000000;
          line-height: 1.6;
        }
        
        .rich-editor a {
          color: #3b82f6 !important;
          text-decoration: underline;
          font-family: Georgia, serif !important;
          font-size: 18px !important;
          line-height: 1.6 !important;
        }
        
        .rich-editor strong,
        .rich-editor b {
          font-weight: bold !important;
          font-family: Georgia, serif !important;
          font-size: 18px !important;
          color: #000000 !important;
          line-height: 1.6 !important;
        }
        
        .rich-editor em,
        .rich-editor i {
          font-style: italic !important;
          font-family: Georgia, serif !important;
          font-size: 18px !important;
          color: #000000 !important;
          line-height: 1.6 !important;
        }
        
        .rich-editor u {
          text-decoration: underline !important;
          font-family: Georgia, serif !important;
          font-size: 18px !important;
          color: #000000 !important;
          line-height: 1.6 !important;
        }
      `
    }} />
  );
};

export default EditorStyles;
