import { sanitizeCommentContent, sanitizeCommentSubject, sanitizePersonalId } from "@/utils/xssProtection";

interface SecureCommentDisplayProps {
  subject: string;
  content: string;
  personalId: string;
  createdAt: string;
  className?: string;
  isAnnouncement?: boolean;
}

/**
 * Secure comment display component that prevents XSS attacks
 * All user-generated content is properly sanitized before display
 */
const SecureCommentDisplay = ({ 
  subject, 
  content, 
  personalId, 
  createdAt,
  className = "",
  isAnnouncement = false 
}: SecureCommentDisplayProps) => {
  // Sanitize all user inputs to prevent XSS
  const safeSubject = sanitizeCommentSubject(subject);
  const safeContent = sanitizeCommentContent(content);
  const safePersonalId = sanitizePersonalId(personalId);

  const getPersonalIdDisplay = () => {
    if (isAnnouncement || safePersonalId === '0000FF') {
      return (
        <span className="text-blue-600 font-semibold font-fun">GpaJohn</span>
      );
    }
    return <span className="font-fun text-orange-600">{safePersonalId}</span>;
  };

  return (
    <div 
      className={`p-4 rounded-lg border ${
        isAnnouncement 
          ? 'bg-blue-50/60 border-blue-200' 
          : 'bg-white/60 border-orange-100'
      } ${className}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-4 text-sm">
          <span className="font-semibold">
            By: {getPersonalIdDisplay()}
          </span>
          <span className={`font-fun ${isAnnouncement ? 'text-blue-600' : 'text-orange-600'}`}>
            {createdAt}
          </span>
        </div>
      </div>
      
      <h3 className={`font-semibold mb-2 font-fun text-lg ${
        isAnnouncement ? 'text-blue-900' : 'text-orange-800'
      }`}>
        {safeSubject}
      </h3>
      
      <div className={`whitespace-pre-wrap font-fun leading-relaxed text-lg ${
        isAnnouncement ? 'text-blue-800' : 'text-gray-800'
      }`}>
        {safeContent}
      </div>
    </div>
  );
};

export default SecureCommentDisplay;