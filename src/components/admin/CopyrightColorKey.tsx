import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const CopyrightColorKey: React.FC = () => {
  return (
    <Card className="w-full max-w-sm bg-white shadow-lg rounded-2xl border-2 border-gray-200">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-red-500 text-white font-bold text-sm">
            ©
          </div>
          <span className="text-sm font-medium text-gray-800">Full Copyright</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-green-500 text-white font-bold text-sm">
            O
          </div>
          <span className="text-sm font-medium text-green-600">Open, No Copyright</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-yellow-500 text-white font-bold text-sm">
            S
          </div>
          <span className="text-sm font-medium text-yellow-600">Limited Sharing</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CopyrightColorKey;