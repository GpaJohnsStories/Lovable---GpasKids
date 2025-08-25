import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const EmergencyAdminPanel: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Emergency Administration</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Emergency management tools will be implemented here.</p>
      </CardContent>
    </Card>
  );
};