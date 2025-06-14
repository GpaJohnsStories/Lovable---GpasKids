
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BookOpen, LogOut, Trash2, Upload, FileText } from "lucide-react";
import { toast } from "sonner";

const BuddysAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ADMIN_EMAIL = "gpajohn.buddy@gmail.com";
  const ADMIN_PASSWORD = "gpaj0hn#bUdDy1o0s6e";

  const { data: stories, isLoading: storiesLoading, refetch } = useQuery({
    queryKey: ['admin-stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAuthenticated,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success("Successfully logged in!");
    } else {
      toast.error("Invalid credentials");
    }
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
    toast.success("Logged out successfully");
  };

  const handleDeleteStory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this story?")) return;

    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Error deleting story");
      console.error(error);
    } else {
      toast.success("Story deleted successfully");
      refetch();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/html') {
      toast.error("Please select an HTML file");
      return;
    }

    setIsUploading(true);

    try {
      const content = await file.text();
      
      // Extract title from HTML (look for <title> tag or first <h1>)
      const titleMatch = content.match(/<title[^>]*>(.*?)<\/title>/i) || 
                        content.match(/<h1[^>]*>(.*?)<\/h1>/i);
      const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : file.name.replace('.html', '');
      
      // Extract meta information if available
      const authorMatch = content.match(/<meta[^>]*name=['"]author['"][^>]*content=['"]([^'"]*)['"]/i);
      const categoryMatch = content.match(/<meta[^>]*name=['"]category['"][^>]*content=['"]([^'"]*)['"]/i);
      
      const storyData = {
        title: title,
        author: authorMatch ? authorMatch[1] : 'Grandpa John',
        category: (categoryMatch ? categoryMatch[1] : 'Fun') as "Fun" | "Life" | "North Pole" | "World Changers",
        content: content,
        story_code: '',
        tagline: '',
        excerpt: '',
        google_drive_link: '',
        photo_link_1: '',
        photo_link_2: '',
        photo_link_3: ''
      };

      const { error } = await supabase
        .from('stories')
        .insert([storyData]);

      if (error) {
        console.error('Upload error:', error);
        toast.error("Error uploading story");
      } else {
        toast.success("Story uploaded successfully!");
        refetch();
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('File processing error:', error);
      toast.error("Error processing file");
    } finally {
      setIsUploading(false);
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "Fun":
        return "bg-blue-500";
      case "Life":
        return "bg-green-500";
      case "North Pole":
        return "bg-red-600";
      case "World Changers":
        return "bg-amber-400 text-amber-900";
      default:
        return "bg-amber-200 text-amber-800";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-orange-800 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2" />
              Buddy's Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full cozy-button"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-orange-800">Buddy's Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline" className="cozy-button">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-orange-800">Upload New Story</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".html"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
              <div className="flex items-center text-sm text-orange-600">
                <FileText className="h-4 w-4 mr-2" />
                HTML files only
              </div>
              {isUploading && (
                <div className="flex items-center text-sm text-orange-600">
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-orange-800">Stories Management</CardTitle>
          </CardHeader>
          <CardContent>
            {storiesLoading ? (
              <div className="text-center py-8">
                <BookOpen className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-4" />
                <p>Loading stories...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Read Count</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stories?.map((story) => (
                    <TableRow key={story.id}>
                      <TableCell className="font-medium">{story.title}</TableCell>
                      <TableCell>{story.author}</TableCell>
                      <TableCell>
                        <Badge className={getCategoryBadgeColor(story.category)}>
                          {story.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{story.read_count}</TableCell>
                      <TableCell>
                        {new Date(story.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteStory(story.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BuddysAdmin;
