import React from 'react';

const LegalNotice: React.FC = () => {
  return (
    <div className="bg-yellow-50 border border-yellow-300 rounded p-4 mb-6">
      <p className="text-sm text-yellow-800 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
        <strong>Legal Notice:</strong> By submitting this story, you represent and warrant that: <br />
        (1) you are the original author or have proper authorization to submit this work, <br />
        (2) the story does not infringe upon any copyright, trademark, or other intellectual property rights, <br />
        (3) the content is appropriate for children and does not contain harmful, offensive, or inappropriate material, and <br />
        (4) you grant Gpa's Kids permission to review, edit, and potentially publish your story on our website. All submissions become part of our story collection and may be used for educational and entertainment purposes, and <br />
        (5) you retain the right to have your story removed from Gpa's Kids website at any time by simply sending your request as a comment with the same Personal ID code you are submitting here.
      </p>
    </div>
  );
};

export default LegalNotice;