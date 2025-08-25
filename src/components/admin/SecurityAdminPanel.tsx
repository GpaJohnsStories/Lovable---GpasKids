import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SecurityAdminPanel: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Administration</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Security management tools will be implemented here.</p>
      </CardContent>
    </Card>
  );
};