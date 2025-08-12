
import { BookOpen } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner = ({ message = "Loading..." }: LoadingSpinnerProps) => {
  return (
    <div className="flex items-center justify-center min-h-content">
      <div className="text-center">
        <BookOpen className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
        <p className="text-orange-700 text-lg">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
