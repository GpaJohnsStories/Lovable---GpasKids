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
        className="font-system text-green-600 hover:text-green-800 hover:underline transition-colors duration-200"
      >
        by {authorName}
      </Link>
    );
  }

  // Bio button commented out per user request
  // return (
  //   <Link to={`/author/${encodedAuthorName}`}>
  //     <div 
  //       className="inline-flex items-center h-auto py-1 px-2 text-xs border-2 border-amber-300 bg-white text-amber-700 hover:bg-amber-50 rounded cursor-pointer transition-colors font-bold"
  //       title={`View ${authorName}'s biography`}
  //     >
  //       Bio
  //     </div>
  //   </Link>
  // );
  
  return null;
};

export default AuthorLink;