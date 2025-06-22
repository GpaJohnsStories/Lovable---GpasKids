
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
          font-size: 16px;
          color: #000000;
        }
        .rich-editor h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        .rich-editor h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        .rich-editor h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }
        .rich-editor ul {
          list-style-type: disc;
          margin: 1em 0;
          padding-left: 2em;
        }
        .rich-editor ol {
          list-style-type: decimal;
          margin: 1em 0;
          padding-left: 2em;
        }
        .rich-editor li {
          margin: 0.25em 0;
        }
        .rich-editor a {
          color: #3b82f6;
          text-decoration: underline;
        }
        .rich-editor p {
          margin: 1em 0;
        }
      `
    }} />
  );
};

export default EditorStyles;
