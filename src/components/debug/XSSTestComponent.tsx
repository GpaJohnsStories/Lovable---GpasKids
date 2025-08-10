import React from 'react';
import { createSafeHtml } from '@/utils/xssProtection';
import IsolatedStoryRenderer from '@/components/story/IsolatedStoryRenderer';

/**
 * Debug component to test XSS protection and IsolatedStoryRenderer
 */
const XSSTestComponent: React.FC = () => {
  const testHTML = '<p style="font-size: 32px; font-weight: bold; margin: 16px 0;">This is Big test<br></p>';
  
  console.log('🧪 XSS Test: Testing HTML:', testHTML);
  
  const safeHtml = createSafeHtml(testHTML);
  console.log('🧪 XSS Test: Safe HTML result:', safeHtml);
  
  return (
    <div className="p-4 border-2 border-red-500 bg-red-50">
      <h3 className="font-bold text-red-700 mb-4">XSS Protection Debug Test</h3>
      
      <div className="mb-4">
        <h4 className="font-semibold">Original HTML:</h4>
        <code className="bg-gray-100 p-2 block text-sm">{testHTML}</code>
      </div>
      
      <div className="mb-4">
        <h4 className="font-semibold">Safe HTML Result:</h4>
        <code className="bg-gray-100 p-2 block text-sm">{safeHtml.__html}</code>
      </div>
      
      <div className="mb-4">
        <h4 className="font-semibold">Rendered by IsolatedStoryRenderer:</h4>
        <div className="border border-gray-300 p-4 bg-white">
          <IsolatedStoryRenderer content={testHTML} />
        </div>
      </div>
    </div>
  );
};

export default XSSTestComponent;