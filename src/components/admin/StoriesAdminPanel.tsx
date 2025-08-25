import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const StoriesAdminPanel: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stories Administration</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Story management tools will be implemented here.</p>
      </CardContent>
    </Card>
  );
};