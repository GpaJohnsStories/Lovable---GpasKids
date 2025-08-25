import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const OverviewAdminPanel: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview Administration</CardTitle>
      </CardHeader>
      <CardContent>
        <p>System overview and statistics will be displayed here.</p>
      </CardContent>
    </Card>
  );
};