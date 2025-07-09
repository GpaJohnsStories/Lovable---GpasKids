import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ActivityTracker from "@/components/ActivityTracker";
import ActivityTrackerDemo from "@/components/ActivityTrackerDemo";
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
import VoicePreview from "./pages/VoicePreview";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import AuthorBio from "./pages/AuthorBio";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/story/:id" element={<Story />} />
          <Route path="/stories" element={<Navigate to="/library" replace />} />
          <Route path="/library" element={<Library />} />
          <Route path="/about" element={<About />} />
          <Route path="/make-comment" element={<MakeComment />} />
          <Route path="/view-comments" element={<ViewComments />} />
          <Route path="/comment/:id" element={<CommentDetail />} />
          <Route path="/author/:authorName" element={<AuthorBio />} />
          <Route path="/buddys_admin/*" element={<BuddysAdmin />} />
          <Route path="/buddys_admin" element={<Navigate to="/buddys_admin/dashboard" replace />} />
          <Route path="/dashboard" element={<Navigate to="/buddys_admin/dashboard" replace />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/privacy" element={<Privacy />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ActivityTracker />
        <ActivityTrackerDemo />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;