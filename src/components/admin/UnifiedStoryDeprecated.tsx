import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from 'lucide-react';

const UnifiedStoryDeprecated = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.error('🚨 DEPRECATED: Unified Story System accessed - this functionality has been moved to Super Text');
    console.error('🚨 Caller should use /buddys_admin/super-text instead');
    console.error('🚨 Auto-redirecting in 3 seconds...');
    
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate('/buddys_admin/super-text');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-[50vh] p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-orange-500" />
          </div>
          <CardTitle className="text-xl font-bold text-orange-600">
            System Deprecated
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            The Unified Story System has been deprecated and replaced with Super Text.
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecting to Super Text in 3 seconds...
          </p>
          <button
            onClick={() => navigate('/buddys_admin/super-text')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Go to Super Text Now
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedStoryDeprecated;