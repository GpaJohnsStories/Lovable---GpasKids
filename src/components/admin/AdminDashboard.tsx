
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Plus, Edit, Trash2, Users, BookOpen, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminDashboardProps {
  onLogout: () => void;
}

interface Story {
  id: string;
  title: string;
  category: string;
  author: string;
  read_count: number;
  created_at: string;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('stories');
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (activeTab === 'stories') {
      fetchStories();
    }
  }, [activeTab]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stories')
        .select('id, title, category, author, read_count, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast({
        title: "Error",
        description: "Failed to load stories",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    onLogout();
  };

  const handleDeleteStory = async (storyId: string, storyTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${storyTitle}"?`)) return;

    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Story deleted successfully"
      });
      
      fetchStories(); // Refresh the list
    } catch (error) {
      console.error('Error deleting story:', error);
      toast({
        title: "Error",
        description: "Failed to delete story",
        variant: "destructive"
      });
    }
  };

  const TabButton = ({ id, label, icon: Icon, active }: any) => (
    <Button
      variant={active ? "default" : "ghost"}
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 ${active ? 'bg-amber-600 text-white' : 'text-amber-700'}`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-amber-800">Admin Dashboard</h1>
              <p className="text-amber-600">Grandpa's Story Corner Management</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-700 border-green-700">
                🍪 Cookie-Free Session
              </Badge>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-6">
          <TabButton id="stories" label="Stories" icon={BookOpen} active={activeTab === 'stories'} />
          <TabButton id="security" label="Security Policy" icon={Shield} active={activeTab === 'security'} />
        </div>

        {/* Stories Management */}
        {activeTab === 'stories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-amber-800">Story Management</h2>
              <Button 
                className="bg-amber-600 hover:bg-amber-700 flex items-center space-x-2"
                onClick={() => navigate('/admin/story/new')}
              >
                <Plus className="h-4 w-4" />
                <span>Add New Story</span>
              </Button>
            </div>

            {loading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-amber-600">Loading stories...</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {stories.map((story) => (
                  <Card key={story.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <h3 className="font-semibold text-amber-800">{story.title}</h3>
                          <Badge variant="secondary">{story.category}</Badge>
                          <Badge variant="outline">
                            📖 {story.read_count} reads
                          </Badge>
                          <span className="text-sm text-gray-500">
                            by {story.author}
                          </span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/admin/story/${story.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600"
                            onClick={() => handleDeleteStory(story.id, story.title)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {stories.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-amber-600 mb-4">No stories found</p>
                      <Button 
                        className="bg-amber-600 hover:bg-amber-700"
                        onClick={() => navigate('/admin/story/new')}
                      >
                        Create your first story
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}

        {/* Security Policy */}
        {activeTab === 'security' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-amber-800">Cookie-Free Security Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">🍪 Zero Cookies for Visitors</h3>
                <p className="text-green-700">
                  Your website operates with a strict no-cookies policy for all visitors. 
                  Stories and content are freely accessible without any tracking or session management.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">🔒 Admin Authentication</h3>
                <p className="text-blue-700">
                  Admin access uses localStorage for session management, which is:
                </p>
                <ul className="list-disc list-inside mt-2 text-blue-700">
                  <li>Stored only on the local device</li>
                  <li>Not transmitted to servers</li>
                  <li>Automatically expires after 24 hours</li>
                  <li>Can be manually cleared anytime</li>
                </ul>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-semibold text-amber-800 mb-2">📊 Privacy Commitment</h3>
                <p className="text-amber-700">
                  Grandpa's Story Corner is committed to providing a completely private, 
                  cookie-free experience for all story readers while maintaining secure 
                  administrative capabilities for content management.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
