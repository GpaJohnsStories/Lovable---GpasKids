import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import ActivityTracker from "@/components/ActivityTracker";
import { useVisitTracker } from "@/hooks/useVisitTracker";
import { HelpProvider } from "@/contexts/HelpContext";
import ErrorBoundary from "@/components/ErrorBoundary";
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
import PublicAuthorBios from "./pages/PublicAuthorBios";
import PublicAuthorBiosSimple from "./pages/PublicAuthorBiosSimple";
import HelpGpa from "./pages/HelpGpa";
import RobotsTxt from "./pages/RobotsTxt";
import SitemapXml from "./pages/SitemapXml";
import GlobalHelpProvider from "@/components/GlobalHelpProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        console.log('🔍 Query retry attempt:', failureCount, error);
        return failureCount < 2;
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Component to conditionally render activity tracker and visit tracking
const ConditionalActivityTracker = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/buddys_admin');
  
  // Track visits for non-admin pages
  useVisitTracker();
  
  // Don't show activity tracker on admin pages
  if (isAdminPage) {
    return null;
  }
  
  return <ActivityTracker showDebugInfo={true} />;
};

const App = () => {
  console.log('🔍 App: Component mounting');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <HelpProvider>
              <BrowserRouter>
                <GlobalHelpProvider>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/story/:id" element={<Story />} />
                    <Route path="/library" element={<Library />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/make-comment" element={<MakeComment />} />
                    <Route path="/view-comments" element={<ViewComments />} />
                    <Route path="/comment/:id" element={<CommentDetail />} />
                    <Route path="/author/:authorName" element={<AuthorBio />} />
                    
                    {/* Use full version with View Bio functionality */}
                    <Route path="/authors" element={
                      <ErrorBoundary>
                        <PublicAuthorBios />
                      </ErrorBoundary>
                    } />
                    
                    {/* Keep original route as backup */}
                    <Route path="/authors-full" element={
                      <ErrorBoundary>
                        <PublicAuthorBios />
                      </ErrorBoundary>
                    } />
                    
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
                    
                    {/* SEO Routes */}
                    <Route path="/robots.txt" element={<RobotsTxt />} />
                    <Route path="/sitemap.xml" element={<SitemapXml />} />
                    
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </GlobalHelpProvider>
                <ConditionalActivityTracker />
              </BrowserRouter>
            </HelpProvider>
          </TooltipProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
