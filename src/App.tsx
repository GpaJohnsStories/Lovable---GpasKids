
import { Toaster } from "@/components/ui/sonner";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { IconCacheProvider } from "@/contexts/IconCacheContext";
import { TooltipProvider as CustomTooltipProvider } from "@/contexts/TooltipContext";
import { SuperAVProvider } from '@/contexts/SuperAVContext';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { useProfileEnsurance } from "@/hooks/useProfileEnsurance";
import ReportProblemButton from "./components/ReportProblemButton";
import Index from "./pages/Index";
import About from "./pages/About";
import Story from "./pages/Story";
import Library from "./pages/Library";

import CopyrightInfo from "./pages/CopyrightInfo";
import Guide from "./pages/Guide";
import HelpGpa from "./pages/HelpGpa";

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
import AdminLayout from "./components/admin/AdminLayout";
import AdminStories from "./components/admin/AdminStories";
import SecurityAuditDashboard from "./components/admin/SecurityAuditDashboard";
import AdminManual from "./pages/AdminManual";

// Auth components
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ResetPasswordRequest from "./components/auth/ResetPasswordRequest";

import SuperText from "./pages/SuperText";
import GpasTestPage from "./pages/GpasTestPage";


// Security and Auth
import GlobalHelpProvider from "./components/GlobalHelpProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import CanonicalLink from "./components/seo/CanonicalLink";
import HostRedirect from "./components/seo/HostRedirect";
import { HelpProvider } from "./contexts/HelpContext";
import { AuthProvider } from "./contexts/AuthContext";
import { useVisitTracker } from "./hooks/useVisitTracker";
import FloatingActionStack from "./components/FloatingActionStack";
import { BreakTimerProvider } from "./contexts/BreakTimerContext";
import { AccessibilityEnhancements } from "./components/accessibility/AccessibilityEnhancements";

const queryClient = new QueryClient();

// Component to conditionally render ReportProblemButton
const ConditionalReportButton = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/buddys_admin');
  
  return !isAdminPage ? <ReportProblemButton /> : null;
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
            <Helmet defaultTitle="GpasKids.com | Stories & More for Kids" titleTemplate="%s | GpasKids.com" />
            <HelpProvider>
              <IconCacheProvider>
                <CustomTooltipProvider>
                    <Toaster />
                    <ShadcnToaster />
                  <BrowserRouter>
                    <HostRedirect />
                    <CanonicalLink />
                    <SuperAVProvider>
                        <AuthProvider>
                        <GlobalHelpProvider>
                          <BreakTimerProvider>
                              <AccessibilityEnhancements>
                                <FloatingActionStack />
                         
                                <Routes>
                                  {/* Public Routes */}
                                  <Route path="/" element={<Index />} />
                                  <Route path="/about" element={<About />} />
                                  <Route path="/story/:storyCode" element={<Story />} />
                                  <Route path="/library" element={<Library />} />
                                  
                                  <Route path="/copyright-info" element={<CopyrightInfo />} />
                                  <Route path="/guide" element={<Guide />} />
                                  <Route path="/help-gpa" element={<HelpGpa />} />
                                  <Route path="/club" element={<Club />} />
                                  <Route path="/club/photos" element={<OrangeGangPhotos />} />
                                  
                                  <Route path="/security" element={<Privacy />} />
                                  <Route path="/robots.txt" element={<RobotsTxt />} />
                                  <Route path="/sitemap.xml" element={<SitemapXml />} />
                                  <Route path="/voice-preview" element={<VoicePreview />} />
                                  <Route path="/forgot-password" element={<ForgotPassword />} />
                                  <Route path="/reset-password" element={<ResetPassword />} />
                                  <Route path="/public-author-bios" element={<PublicAuthorBios />} />
                                  <Route path="/author-bios-simple" element={<PublicAuthorBiosSimple />} />
                                  <Route path="/author/:id" element={<AuthorBio />} />
                                   {/* Auth Routes */}
                                  <Route path="/auth/login" element={<Login />} />
                                  <Route path="/auth/register" element={<Register />} />
                                  <Route path="/auth/forgot-password" element={<ResetPasswordRequest />} />
                                  
                                   {/* Protected Routes - Redirect to Admin */}
                                   <Route path="/dashboard" element={<ProtectedRoute><Navigate to="/buddys_admin" replace /></ProtectedRoute>} />

                                  {/* Admin Routes */}
                                   <Route path="/buddys_admin" element={<SecureAdminRoute><AdminOverview /></SecureAdminRoute>} />
                                   <Route path="/buddys_admin/stories" element={<SecureAdminRoute><AdminStories /></SecureAdminRoute>} />
                                    <Route path="/buddys_admin/security" element={<SecureAdminRoute><SecurityAuditDashboard /></SecureAdminRoute>} />
                                   <Route path="/buddys_admin/manual" element={<SecureAdminRoute><AdminManual /></SecureAdminRoute>} />
                                   
                                   <Route path="/buddys_admin/reference" element={<SecureAdminRoute><ReferenceDashboard /></SecureAdminRoute>} />
                                   <Route path="/buddys_admin/sitemap" element={<SecureAdminRoute><AdminSiteMapContent /></SecureAdminRoute>} />
                                   <Route path="/buddys_admin/super-text" element={<SuperText />} />
                                   <Route path="/buddys_admin/gpas-test-page" element={<GpasTestPage />} />

                                  {/* Catch-all route */}
                                  <Route path="*" element={<NotFound />} />
                                </Routes>
                              </AccessibilityEnhancements>
                          </BreakTimerProvider>
                         </GlobalHelpProvider>
                      </AuthProvider>
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
