import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectionTestPanel } from './ConnectionTestPanel';

export const DiagnosticsAdminPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <ConnectionTestPanel />
      
      <Card>
        <CardHeader>
          <CardTitle>System Diagnostics</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Additional diagnostic tools will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};