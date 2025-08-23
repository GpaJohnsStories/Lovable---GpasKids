import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Home, BookOpen, Users, MessageSquare, Settings, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";

const AdminSiteMapContent = () => {
  const { userRole } = useUserRole();

  const publicPages = [
    { name: "Home", path: "/", icon: Home, description: "Main landing page with story listings" },
    { name: "Library", path: "/library", icon: BookOpen, description: "Browse all available stories" },
    { name: "About", path: "/about", icon: Users, description: "About the storyteller and website" },
    { name: "Writing Guide", path: "/guide", icon: BookOpen, description: "How to write stories" },
    { name: "Help", path: "/help-gpa", icon: Users, description: "Get help from Grandpa" },
    { name: "Privacy Policy", path: "/security", icon: Settings, description: "Privacy and safety information" }
  ];

  const adminPages = [
    { name: "Admin Overview", path: "/buddys_admin", icon: Settings, description: "Main admin dashboard" },
    { name: "Manage Stories", path: "/buddys_admin/stories", icon: BookOpen, description: "Create and edit stories" },
    { name: "Security Audit", path: "/buddys_admin/security", icon: Settings, description: "Security monitoring and audit" },
    { name: "Admin Reference", path: "/buddys_admin/reference", icon: BookOpen, description: "Icons, colors, and resources" },
    { name: "Site Map", path: "/buddys_admin/sitemap", icon: Settings, description: "This page - site navigation overview" }
  ];

  const utilityPages = [
    { name: "Story Pages", path: "/story/[code]", icon: BookOpen, description: "Individual story display pages" },
    { name: "404 Not Found", path: "*", icon: AlertCircle, description: "Error page for invalid URLs" }
  ];

  const PageCard = ({ 
    pages, 
    title, 
    borderColor 
  }: { 
    pages: typeof publicPages; 
    title: string; 
    borderColor: string;
  }) => (
    <Card className={`border-l-4 ${borderColor}`}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pages.map((page) => {
            const IconComponent = page.icon;
            const isVisitable = !page.path.includes('[') && page.path !== '*';
            
            return (
              <div key={page.path} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <IconComponent className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{page.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {page.path}
                    </Badge>
                    {isVisitable && (
                      <Link 
                        to={page.path}
                        className="text-blue-600 hover:text-blue-800 ml-auto"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{page.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-black mb-2 font-system">
          Site Map
        </h2>
        <p className="text-muted-foreground">
          Complete overview of all pages and sections within the application
        </p>
      </div>

      {userRole === 'viewer' && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have viewer access. Some administrative functions may be limited.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <PageCard 
          pages={publicPages} 
          title="Public Pages" 
          borderColor="border-l-green-500"
        />
        
        <PageCard 
          pages={adminPages} 
          title="Administrative Pages" 
          borderColor="border-l-blue-500"
        />
        
        <PageCard 
          pages={utilityPages} 
          title="Utility & Dynamic Pages" 
          borderColor="border-l-orange-500"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Navigation Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">User Journey:</h4>
              <p className="text-muted-foreground">
                Home → Library (browse stories) → Story pages → About → Help
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Admin Workflow:</h4>
              <p className="text-muted-foreground">
                Admin Login → Stories Management → Security Audit → Reference Materials
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Content Management:</h4>
              <p className="text-muted-foreground">
                Stories created/edited via Admin → Published to Library → Available on Home page
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSiteMapContent;