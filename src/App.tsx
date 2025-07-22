
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import About from "./pages/About";
import Story from "./pages/Story";
import Library from "./pages/Library";
import Writing from "./pages/Writing";
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

// Admin components
import AdminLayout from "./components/admin/AdminLayout";
import AdminOverview from "./components/admin/AdminOverview";
import AdminStories from "./components/admin/AdminStories";
import CommentsDashboard from "./components/admin/CommentsDashboard";
import AdminCommentDetail from "./components/admin/AdminCommentDetail";
import CreateAdminComment from "./components/admin/CreateAdminComment";
import SecurityAuditDashboard from "./components/admin/SecurityAuditDashboard";
import AuthorBioManagement from "./components/admin/AuthorBioManagement";
import UnifiedStoryPage from "./components/unified-story/UnifiedStoryPage";

// Security and Auth
import GlobalHelpProvider from "./components/GlobalHelpProvider";
import ContentProtection from "./components/ContentProtection";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import { HelpProvider } from "./contexts/HelpContext";

const queryClient = new QueryClient();

// Component to handle conditional content protection based on route
const ConditionalContentProtection = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/buddys_admin');
  
  return (
    <ContentProtection enableProtection={!isAdminRoute}>
      {children}
    </ContentProtection>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <HelmetProvider>
            <HelpProvider>
              <GlobalHelpProvider>
                <Toaster />
                <BrowserRouter>
                  <ConditionalContentProtection>
                    <ScrollToTop />
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Index />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/story/:id" element={<Story />} />
                      <Route path="/library" element={<Library />} />
                      <Route path="/writing" element={<Writing />} />
                      <Route path="/help" element={<HelpGpa />} />
                      <Route path="/make-comment" element={<MakeComment />} />
                      <Route path="/view-comments" element={<ViewComments />} />
                      <Route path="/comment/:id" element={<CommentDetail />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/robots.txt" element={<RobotsTxt />} />
                      <Route path="/sitemap.xml" element={<SitemapXml />} />
                      <Route path="/voice-preview" element={<VoicePreview />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/author-bios" element={<PublicAuthorBios />} />
                      <Route path="/author-bios-simple" element={<PublicAuthorBiosSimple />} />
                      <Route path="/author/:id" element={<AuthorBio />} />

                      {/* Admin Routes */}
                      <Route path="/buddys_admin" element={<AdminLayout><AdminOverview /></AdminLayout>} />
                      <Route path="/buddys_admin/stories" element={<AdminLayout><AdminStories /></AdminLayout>} />
                      <Route path="/buddys_admin/comments" element={<AdminLayout><CommentsDashboard /></AdminLayout>} />
                      <Route path="/buddys_admin/security" element={<AdminLayout><SecurityAuditDashboard /></AdminLayout>} />
                      <Route path="/buddys_admin/author-bios" element={<AdminLayout><AuthorBioManagement /></AdminLayout>} />
                      <Route path="/buddys_admin/author-bios/add" element={<AdminLayout><AuthorBioManagement /></AdminLayout>} />
                      <Route path="/buddys_admin/author-bios/edit/:id" element={<AdminLayout><AuthorBioManagement /></AdminLayout>} />

                      {/* Unified Story System Routes - These are the only story management routes now */}
                      <Route path="/buddys_admin/unified_story_system/add" element={<AdminLayout><UnifiedStoryPage mode="add" /></AdminLayout>} />
                      <Route path="/buddys_admin/unified_story_system/update/:id" element={<AdminLayout><UnifiedStoryPage mode="update" /></AdminLayout>} />

                      {/* Catch-all route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </ConditionalContentProtection>
                </BrowserRouter>
              </GlobalHelpProvider>
            </HelpProvider>
          </HelmetProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
