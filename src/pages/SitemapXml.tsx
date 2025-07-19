
import { useEffect } from 'react';

const SitemapXml = () => {
  useEffect(() => {
    // Set the content type to XML
    document.title = 'sitemap.xml';
  }, []);

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://gpaskids.com/</loc>
    <lastmod>2025-01-19</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://gpaskids.com/library</loc>
    <lastmod>2025-01-19</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://gpaskids.com/about</loc>
    <lastmod>2025-01-19</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://gpaskids.com/make-comment</loc>
    <lastmod>2025-01-19</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://gpaskids.com/view-comments</loc>
    <lastmod>2025-01-19</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://gpaskids.com/writing</loc>
    <lastmod>2025-01-19</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://gpaskids.com/privacy</loc>
    <lastmod>2025-01-19</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://gpaskids.com/help-gpa</loc>
    <lastmod>2025-01-19</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
</urlset>`;

  // Return the content as XML
  return (
    <pre style={{ 
      fontFamily: 'monospace', 
      whiteSpace: 'pre-wrap',
      margin: 0,
      padding: 0
    }}>
      {sitemapContent}
    </pre>
  );
};

export default SitemapXml;
</tml>

Now let's add these routes to your App.tsx file:

<lov-write file_path="src/App.tsx">
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import ActivityTracker from "@/components/ActivityTracker";
import ActivityTrackerDemo from "@/components/ActivityTrackerDemo";
import { useVisitTracker } from "@/hooks/useVisitTracker";
import Index from "./pages/Index";
import Story from "./pages/Story";
import Library from "./pages/Library";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Writing from "./pages/Writing";
import MakeComment from "./pages/MakeComment";
import ViewComments from "./pages/ViewComments";
import CommentDetail from "./pages/CommentDetail";
import BuddysAdmin from "./pages/BuddysAdmin";
import SimpleAdmin from "./pages/SimpleAdmin";
import VoicePreview from "./pages/VoicePreview";
import AdminAccess from "./pages/AdminAccess";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import AuthorBio from "./pages/AuthorBio";
import HelpGpa from "./pages/HelpGpa";
import StoryContentTest from "./pages/StoryContentTest";
import RobotsTxt from "./pages/RobotsTxt";
import SitemapXml from "./pages/SitemapXml";

const queryClient = new QueryClient();

// Component to conditionally render activity trackers and visit tracking
const ConditionalActivityTrackers = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/buddys_admin');
  
  // Track visits for non-admin pages
  useVisitTracker();
  
  // Don't show activity trackers on admin pages
  if (isAdminPage) {
    return null;
  }
  
  return (
    <>
      <ActivityTracker />
      <ActivityTrackerDemo />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/story/:id" element={<Story />} />
            <Route path="/library" element={<Library />} />
            <Route path="/about" element={<About />} />
            <Route path="/make-comment" element={<MakeComment />} />
            <Route path="/view-comments" element={<ViewComments />} />
            <Route path="/comment/:id" element={<CommentDetail />} />
            <Route path="/author/:authorName" element={<AuthorBio />} />
            <Route path="/admin" element={<SimpleAdmin />} />
            <Route path="/admin-access" element={<AdminAccess />} />
            <Route path="/buddys_admin/*" element={<BuddysAdmin />} />
            <Route path="/simple-admin" element={<SimpleAdmin />} />
            <Route path="/dashboard" element={<Navigate to="/buddys_admin/dashboard" replace />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/writing" element={<Writing />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/help-gpa" element={<HelpGpa />} />
            <Route path="/story-content-test" element={<StoryContentTest />} />
            
            {/* SEO Routes */}
            <Route path="/robots.txt" element={<RobotsTxt />} />
            <Route path="/sitemap.xml" element={<SitemapXml />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ConditionalActivityTrackers />
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
