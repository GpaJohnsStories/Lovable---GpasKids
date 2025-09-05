import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminLayout from './AdminLayout';
import { SecurityAdminPanel } from './SecurityAdminPanel';
import { ReferenceAdminPanel } from './ReferenceAdminPanel';
import { DiagnosticsAdminPanel } from './DiagnosticsAdminPanel';
import { EmergencyAdminPanel } from './EmergencyAdminPanel';
import { OverviewAdminPanel } from './OverviewAdminPanel';
import { StoriesAdminPanel } from './StoriesAdminPanel';
import { BackupCenter } from './BackupCenter';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <AdminLayout>
      <div className="p-6">
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stories">Stories</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="reference">Reference</TabsTrigger>
            <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewAdminPanel />
          </TabsContent>

          <TabsContent value="stories" className="space-y-6">
            <StoriesAdminPanel />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecurityAdminPanel />
          </TabsContent>

          <TabsContent value="reference" className="space-y-6">
            <ReferenceAdminPanel />
          </TabsContent>

          <TabsContent value="diagnostics" className="space-y-6">
            <DiagnosticsAdminPanel />
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <BackupCenter />
          </TabsContent>

          <TabsContent value="emergency" className="space-y-6">
            <EmergencyAdminPanel />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};
