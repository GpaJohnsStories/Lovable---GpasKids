import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { useUserRole } from '@/hooks/useUserRole';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Home, Book, MessageSquare, User, Shield, Map, FileText, HelpCircle, Lock, Eye } from 'lucide-react';

const AdminSiteMap = () => {
  const { userRole, isLoading } = useUserRole();

  if (isLoading) {
    return (
      <div className="animate-pulse bg-muted rounded h-64 w-full"></div>
    );
  }

  if (userRole !== 'admin' && userRole !== 'viewer') {
    return (
      <>
        <Helmet>
          <title>Access Denied - Site Map</title>
        </Helmet>
        <Alert className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Admin access required to view site map.
          </AlertDescription>
        </Alert>
      </>
    );
  }

  const publicPages = [
    { name: 'Home', path: '/', icon: Home, description: 'Main landing page with welcome content' },
    { name: 'Stories Library', path: '/library', icon: Book, description: 'Browse all published stories' },
    { name: 'Story Detail', path: '/story/:code', icon: FileText, description: 'Individual story viewing page' },
    { name: 'View Comments', path: '/view-comments/:storyCode', icon: MessageSquare, description: 'View comments for a story' },
    { name: 'Make Comment', path: '/make-comment/:storyCode', icon: MessageSquare, description: 'Create new comment on a story' },
    { name: 'Comment Detail', path: '/comment/:id', icon: Eye, description: 'View individual comment details' },
    { name: 'About Grandpa John', path: '/about', icon: User, description: 'About the storyteller' },
    { name: 'Author Bios', path: '/author-bios', icon: User, description: 'Public author biographies' },
    { name: 'Author Bio Simple', path: '/author-bio/:id', icon: User, description: 'Individual author bio page' },
    { name: 'Help from Grandpa', path: '/help-gpa', icon: HelpCircle, description: 'Help and instructions' },
    { name: 'How To Use Site', path: '/how-to', icon: HelpCircle, description: 'Site usage instructions' },
    { name: 'Writing Stories', path: '/writing', icon: FileText, description: 'Story submission form' },
    { name: 'Voice Preview', path: '/voice-preview', icon: FileText, description: 'Preview story voices' },
    { name: 'Privacy Policy', path: '/privacy', icon: Lock, description: 'Privacy policy and terms' },
  ];

  const adminPages = [
    { name: 'Admin Dashboard', path: '/buddys_admin', icon: Shield, description: 'Main admin overview and statistics' },
    { name: 'Stories Management', path: '/buddys_admin/stories', icon: Book, description: 'Manage all stories (published/unpublished)' },
    { name: 'Comments Dashboard', path: '/buddys_admin/comments', icon: MessageSquare, description: 'Moderate and manage comments' },
    { name: 'Admin Reference', path: '/buddys_admin/reference', icon: FileText, description: 'Icons, colors, and admin resources' },
    { name: 'Site Map', path: '/buddys_admin/sitemap', icon: Map, description: 'Visual map of all site pages (current page)' },
    { name: 'Unified Story System', path: '/buddys_admin/unified-story/:id', icon: FileText, description: 'Enhanced story editing interface' },
  ];

  const utilityPages = [
    { name: 'Not Found (404)', path: '*', icon: AlertCircle, description: 'Error page for invalid routes' },
    { name: 'Forgot Password', path: '/forgot-password', icon: Lock, description: 'Password recovery page' },
    { name: 'Reset Password', path: '/reset-password', icon: Lock, description: 'Password reset confirmation' },
    { name: 'Robots.txt', path: '/robots.txt', icon: FileText, description: 'Search engine crawler instructions' },
    { name: 'Sitemap.xml', path: '/sitemap.xml', icon: Map, description: 'XML sitemap for search engines' },
  ];

  const PageCard = ({ pages, title, borderColor }: { pages: typeof publicPages, title: string, borderColor: string }) => (
    <Card className={`border-2 ${borderColor}`}>
      <CardHeader>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {pages.map((page, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <page.icon className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{page.name}</span>
                  {page.path !== '*' && !page.path.includes(':') ? (
                    <Link 
                      to={page.path} 
                      className="text-xs text-primary hover:underline bg-primary/10 px-2 py-1 rounded"
                      target={page.path.startsWith('/buddys_admin') ? '_self' : '_blank'}
                    >
                      Visit
                    </Link>
                  ) : (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      {page.path.includes(':') ? 'Dynamic' : 'Error Page'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{page.description}</p>
                <code className="text-xs text-muted-foreground bg-background px-1 rounded">{page.path}</code>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>Site Map - Admin Dashboard</title>
        <meta name="description" content="Complete map of all site pages and navigation" />
      </Helmet>
      
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Site Map
            </h1>
            <p className="text-muted-foreground">
              Complete overview of all pages and navigation structure
            </p>
            {userRole === 'viewer' && (
              <Alert className="mt-4">
                <Eye className="h-4 w-4" />
                <AlertDescription>
                  You are viewing in read-only mode as a viewer.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <PageCard 
              pages={publicPages} 
              title="Public Pages" 
              borderColor="border-green-500"
            />
            
            <PageCard 
              pages={adminPages} 
              title="Admin Pages" 
              borderColor="border-red-500"
            />
          </div>

          <PageCard 
            pages={utilityPages} 
            title="Utility & Error Pages" 
            borderColor="border-yellow-500"
          />

          <Card className="border-blue-500 border-2">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Navigation Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <p><strong>Main Navigation:</strong> Home → Stories Library → Individual Stories → Comments</p>
                <p><strong>Admin Flow:</strong> Dashboard → Stories Management → Comments Dashboard → Reference</p>
                <p><strong>Content Creation:</strong> Writing → Story Submission → Admin Review → Publication</p>
                <p><strong>User Journey:</strong> Home → Help/How-To → Stories → Comments → About</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminSiteMap;