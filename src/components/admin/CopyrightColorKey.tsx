import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CopyrightColorKey: React.FC = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold">Copyright Status Key</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white font-bold text-xs">
            ©
          </div>
          <span className="text-sm">Full Copyright</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white font-bold text-xs">
            O
          </div>
          <span className="text-sm">Open, No Copyright</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500 text-white font-bold text-xs">
            S
          </div>
          <span className="text-sm">Limited Sharing</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CopyrightColorKey;