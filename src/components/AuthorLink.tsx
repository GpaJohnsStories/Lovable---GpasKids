import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface AuthorLinkProps {
  authorName: string;
  variant?: "button" | "link";
  size?: "sm" | "default";
}

const AuthorLink = ({ authorName, variant = "button", size = "sm" }: AuthorLinkProps) => {
  const encodedAuthorName = encodeURIComponent(authorName);

  if (variant === "link") {
    return (
      <Link 
        to={`/author/${encodedAuthorName}`}
        className="text-amber-600 hover:text-amber-800 underline text-sm font-medium"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        by {authorName}
      </Link>
    );
  }

  return (
    <Link to={`/author/${encodedAuthorName}`}>
      <div 
        className="inline-flex items-center h-auto py-1 px-2 text-xs border border-amber-300 text-amber-700 hover:bg-amber-50 rounded cursor-pointer transition-colors"
        title={`View ${authorName}'s biography`}
      >
        Bio
      </div>
    </Link>
  );
};

export default AuthorLink;