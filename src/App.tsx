
import { Toaster } from "@/components/ui/sonner";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { IconCacheProvider } from "@/contexts/IconCacheContext";
import { TooltipProvider as CustomTooltipProvider } from "@/contexts/TooltipContext";
import { SuperAVProvider } from '@/contexts/SuperAVContext';
import { HelmetProvider } from 'react-helmet-async';
import { useProfileEnsurance } from "@/hooks/useProfileEnsurance";
import Index from "./pages/Index";
import About from "./pages/About";
import Story from "./pages/Story";
import Library from "./pages/Library";
import Writing from "./pages/Writing";
import Guide from "./pages/Guide";
import HelpGpa from "./pages/HelpGpa";

import MakeComment from "./pages/MakeComment";
import ViewComments from "./pages/ViewComments";
import CommentDetail from "./pages/CommentDetail";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import RobotsTxt from "./pages/RobotsTxt";
import SitemapXml from "./pages/SitemapXml";
import VoicePreview from "./pages/VoicePreview";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PublicAuthorBios from "./pages/PublicAuthorBios";
import PublicAuthorBiosSimple from "./pages/PublicAuthorBiosSimple";
import AuthorBio from "./pages/AuthorBio";
import Club from "./pages/Club";
import OrangeGangPhotos from "./pages/OrangeGangPhotos";

import ReferenceDashboard from "./components/admin/ReferenceDashboard";
import AdminSiteMapContent from "./components/admin/AdminSiteMapContent";

// Admin components
import SecureAdminRoute from "./components/admin/SecureAdminRoute";
import AdminOverview from "./components/admin/AdminOverview";
import AdminStories from "./components/admin/AdminStories";
import CommentsDashboard from "./components/admin/CommentsDashboard";
import AdminCommentDetail from "./components/admin/AdminCommentDetail";
import CreateAdminComment from "./components/admin/CreateAdminComment";
import SecurityAuditDashboard from "./components/admin/SecurityAuditDashboard";

import UnifiedStoryPage from "./components/unified-story/UnifiedStoryPage";

// Security and Auth
import GlobalHelpProvider from "./components/GlobalHelpProvider";
import ContentProtection from "./components/ContentProtection";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import { HelpProvider } from "./contexts/HelpContext";
import { useVisitTracker } from "./hooks/useVisitTracker";
import ActivityTracker from "./components/ActivityTracker";

const queryClient = new QueryClient();

// Component to handle conditional content protection based on route
const ConditionalContentProtection = ({ children }: { children: React.ReactNode }) => {
  // Content protection disabled site-wide to allow copy/paste functionality
  return (
    <ContentProtection enableProtection={false}>
      {children}
    </ContentProtection>
  );
};

function App() {
  // Activate visit tracking for the entire app
  useVisitTracker();
  // Ensure user profiles exist for authenticated users
  useProfileEnsurance();
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <HelmetProvider>
            <HelpProvider>
              <IconCacheProvider>
                <CustomTooltipProvider>
                    <Toaster />
                    <ShadcnToaster />
                  <BrowserRouter>
                    <SuperAVProvider>
                      <GlobalHelpProvider>
                  <ConditionalContentProtection>
                    <ScrollToTop />
                    <ActivityTracker showDebugInfo />
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Index />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/story/:storyCode" element={<Story />} />
                      <Route path="/library" element={<Library />} />
                      <Route path="/writing" element={<Writing />} />
                      <Route path="/guide" element={<Guide />} />
                      <Route path="/help-gpa" element={<HelpGpa />} />
                      <Route path="/club" element={<Club />} />
                      <Route path="/club/photos" element={<OrangeGangPhotos />} />
                      
                      <Route path="/make-comment" element={<MakeComment />} />
                      <Route path="/view-comments" element={<ViewComments />} />
                      <Route path="/comment/:id" element={<CommentDetail />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/robots.txt" element={<RobotsTxt />} />
                      <Route path="/sitemap.xml" element={<SitemapXml />} />
                      <Route path="/voice-preview" element={<VoicePreview />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/public-author-bios" element={<PublicAuthorBios />} />
                      <Route path="/author-bios-simple" element={<PublicAuthorBiosSimple />} />
                      <Route path="/author/:id" element={<AuthorBio />} />

                      {/* Admin Routes */}
                      <Route path="/buddys_admin" element={<SecureAdminRoute><AdminOverview /></SecureAdminRoute>} />
                      <Route path="/buddys_admin/stories" element={<SecureAdminRoute><AdminStories /></SecureAdminRoute>} />
                      <Route path="/buddys_admin/comments" element={<SecureAdminRoute><CommentsDashboard /></SecureAdminRoute>} />
                      <Route path="/buddys_admin/security" element={<SecureAdminRoute><SecurityAuditDashboard /></SecureAdminRoute>} />
                      
                      <Route path="/buddys_admin/reference" element={<SecureAdminRoute><ReferenceDashboard /></SecureAdminRoute>} />
                      <Route path="/buddys_admin/sitemap" element={<SecureAdminRoute><AdminSiteMapContent /></SecureAdminRoute>} />

                      {/* Unified Story System Routes - These are the only story management routes now */}
                      <Route path="/buddys_admin/unified_story_system/add" element={<SecureAdminRoute><UnifiedStoryPage mode="add" /></SecureAdminRoute>} />
                      <Route path="/buddys_admin/unified_story_system/update/:id" element={<SecureAdminRoute><ErrorBoundary><UnifiedStoryPage mode="update" /></ErrorBoundary></SecureAdminRoute>} />

                      {/* Catch-all route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                   </ConditionalContentProtection>
                 </GlobalHelpProvider>
                   </SuperAVProvider>
               </BrowserRouter>
                 </CustomTooltipProvider>
             </IconCacheProvider>
          </HelpProvider>
        </HelmetProvider>
      </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
