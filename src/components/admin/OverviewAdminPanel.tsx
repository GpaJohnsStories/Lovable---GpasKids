import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const OverviewAdminPanel: React.FC = () => {
  return (
    <>
      <Helmet><title>Dashboard</title></Helmet>
      <Card>
      <CardHeader>
        <CardTitle>Overview Administration</CardTitle>
      </CardHeader>
      <CardContent>
        <p>System overview and statistics will be displayed here.</p>
      </CardContent>
    </Card>
    </>
  );
};