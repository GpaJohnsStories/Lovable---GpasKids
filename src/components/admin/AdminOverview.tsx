import AdminHeader from "./AdminHeader";
import AdminLayout from "./AdminLayout";
import EmergencyAdminTools from "./EmergencyAdminTools";
import SecurityAuditDashboard from "./SecurityAuditDashboard";
import AdvancedSecurityDashboard from "./AdvancedSecurityDashboard";
import AdminPasswordChange from "./AdminPasswordChange";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Shield, Key, BookOpen, Eye, EyeOff, Tag, Video, Volume2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { adminClient } from "@/integrations/supabase/clients";

const AdminOverview = () => {
  const { data: storyCounts } = useQuery({
    queryKey: ['story-counts'],
    queryFn: async () => {
      const [allResult, publishedResult, newStoriesResult, unpublishedResult, categoriesResult, videosResult, audioResult] = await Promise.all([
        // Exclude System category from all counts
        adminClient.from('stories').select('id', { count: 'exact', head: true }).not('category', 'eq', 'System'),
        adminClient.from('stories').select('id', { count: 'exact', head: true }).eq('published', 'Y').not('category', 'eq', 'System'),
        // New stories created in the last 7 days
        adminClient.from('stories').select('id', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()).not('category', 'eq', 'System'),
        // Include Story category in unpublished, exclude System
        adminClient.from('stories').select('id', { count: 'exact', head: true }).eq('published', 'N').not('category', 'eq', 'System'),
        // Get all stories with categories (including System for category display)
        adminClient.from('stories').select('category'),
        // Count stories with video URLs
        adminClient.from('stories').select('id', { count: 'exact', head: true }).not('video_url', 'is', null),
        // Count stories with audio URLs
        adminClient.from('stories').select('id', { count: 'exact', head: true }).not('audio_url', 'is', null)
      ]);

      // Count stories by category
      const categoryCounts = categoriesResult.data?.reduce((acc: Record<string, number>, story) => {
        const category = story.category;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {}) || {};

      return {
        all: allResult.count || 0,
        published: publishedResult.count || 0,
        newStories: newStoriesResult.count || 0,
        unpublished: unpublishedResult.count || 0,
        categories: categoryCounts,
        videos: videosResult.count || 0,
        audio: audioResult.count || 0
      };
    },
  });

  return (
    <AdminLayout>
      <div className="mb-0">
        <h1 className="text-3xl font-bold text-black" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Admin Dashboard
        </h1>
      </div>
      
      {/* Security Audit - Wide box with green border */}
      <Card className="mb-6 border-green-500 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Shield className="h-5 w-5" />
            Security Audit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AdvancedSecurityDashboard />
        </CardContent>
      </Card>
      
      {/* Story Statistics - Wide box with purple border */}
      <Card className="mb-6 border-purple-500 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <BookOpen className="h-5 w-5" />
            Story Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3 mb-3">
            <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-xl font-bold text-blue-600">
                {storyCounts?.all || 0}
              </div>
              <div className="text-xs text-blue-700 font-medium">Total Story Files</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded-lg border border-green-200">
              <div className="text-xl font-bold text-green-600 flex items-center justify-center gap-1">
                <Eye className="h-4 w-4" />
                {storyCounts?.published || 0}
              </div>
              <div className="text-xs text-green-700 font-medium">Published</div>
            </div>
            <div className="text-center p-2 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-xl font-bold text-yellow-600">
                {storyCounts?.newStories || 0}
              </div>
              <div className="text-xs text-yellow-700 font-medium">New Stories</div>
            </div>
            <div className="text-center p-2 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-xl font-bold text-orange-600 flex items-center justify-center gap-1">
                <EyeOff className="h-4 w-4" />
                {storyCounts?.unpublished || 0}
              </div>
              <div className="text-xs text-orange-700 font-medium">Unpublished</div>
            </div>
          </div>
          
          {/* Category counts */}
          <div className="grid grid-cols-6 gap-2 mb-2">
            {['Fun', 'Life', 'North Pole', 'World Changers', 'STORY', 'System'].map((category) => (
              <div key={category} className="text-center p-1 bg-purple-50 rounded border border-purple-200">
                <div className="text-lg font-bold text-purple-600 flex items-center justify-center gap-1">
                  <Tag className="h-3 w-3" />
                  {storyCounts?.categories?.[category] || 0}
                </div>
                <div className="text-xs text-purple-700 font-medium">{category}</div>
              </div>
            ))}
          </div>
          
          {/* Media counts */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="text-xl font-bold text-indigo-600 flex items-center justify-center gap-1">
                <Video className="h-4 w-4" />
                {storyCounts?.videos || 0}
              </div>
              <div className="text-xs text-indigo-700 font-medium">With Videos</div>
            </div>
            <div className="text-center p-2 bg-teal-50 rounded-lg border border-teal-200">
              <div className="text-xl font-bold text-teal-600 flex items-center justify-center gap-1">
                <Volume2 className="h-4 w-4" />
                {storyCounts?.audio || 0}
              </div>
              <div className="text-xs text-teal-700 font-medium">With Audio</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Management - Wide box with orange border */}
      <Card className="mb-6 border-orange-500 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <Key className="h-5 w-5" />
            Password Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AdminPasswordChange />
        </CardContent>
      </Card>

      {/* System Tools - Wide box with blue border */}
      <Card className="mb-6 border-blue-500 border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Settings className="h-5 w-5" />
            System Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmergencyAdminTools />
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminOverview;