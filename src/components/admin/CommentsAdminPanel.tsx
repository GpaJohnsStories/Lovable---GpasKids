import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CommentsAdminPanel: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments Administration</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Comment management tools will be implemented here.</p>
      </CardContent>
    </Card>
  );
};