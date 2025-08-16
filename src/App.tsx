
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { IconCacheProvider } from "@/contexts/IconCacheContext";
import { TooltipProvider as CustomTooltipProvider } from "@/contexts/TooltipContext";
import { SuperAVProvider } from '@/contexts/SuperAVContext';
import { HelmetProvider } from 'react-helmet-async';
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy-loaded public pages
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Story = lazy(() => import("./pages/Story"));
const Library = lazy(() => import("./pages/Library"));
const Writing = lazy(() => import("./pages/Writing"));
const Guide = lazy(() => import("./pages/Guide"));
const HelpGpa = lazy(() => import("./pages/HelpGpa"));
const MakeComment = lazy(() => import("./pages/MakeComment"));
const ViewComments = lazy(() => import("./pages/ViewComments"));
const CommentDetail = lazy(() => import("./pages/CommentDetail"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const RobotsTxt = lazy(() => import("./pages/RobotsTxt"));
const SitemapXml = lazy(() => import("./pages/SitemapXml"));
const VoicePreview = lazy(() => import("./pages/VoicePreview"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const PublicAuthorBios = lazy(() => import("./pages/PublicAuthorBios"));
const PublicAuthorBiosSimple = lazy(() => import("./pages/PublicAuthorBiosSimple"));
const AuthorBio = lazy(() => import("./pages/AuthorBio"));

// Lazy-loaded admin components
const ReferenceDashboard = lazy(() => import("./components/admin/ReferenceDashboard"));
const AdminSiteMapContent = lazy(() => import("./components/admin/AdminSiteMapContent"));
const SecureAdminRoute = lazy(() => import("./components/admin/SecureAdminRoute"));
const AdminOverview = lazy(() => import("./components/admin/AdminOverview"));
const AdminStories = lazy(() => import("./components/admin/AdminStories"));
const CommentsDashboard = lazy(() => import("./components/admin/CommentsDashboard"));
const AdminCommentDetail = lazy(() => import("./components/admin/AdminCommentDetail"));
const CreateAdminComment = lazy(() => import("./components/admin/CreateAdminComment"));
const SecurityAuditDashboard = lazy(() => import("./components/admin/SecurityAuditDashboard"));
const UnifiedStoryPage = lazy(() => import("./components/unified-story/UnifiedStoryPage"));

// Security and Auth
import GlobalHelpProvider from "./components/GlobalHelpProvider";
import ContentProtection from "./components/ContentProtection";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import { HelpProvider } from "./contexts/HelpContext";
import { useVisitTracker } from "./hooks/useVisitTracker";

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
                    <Suspense fallback={<LoadingSpinner message="Loading..." />}>
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Index />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/story/:storyCode" element={<Story />} />
                        <Route path="/library" element={<Library />} />
                        <Route path="/writing" element={<Writing />} />
                        <Route path="/guide" element={<Guide />} />
                        <Route path="/help-gpa" element={<HelpGpa />} />
                        
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
                    </Suspense>
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
