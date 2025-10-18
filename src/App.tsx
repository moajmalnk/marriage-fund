import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { usePrivacyMode } from "@/hooks/usePrivacyMode";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Payments from "./pages/Payments";
import Team from "./pages/Team";
import FundRequests from "./pages/FundRequests";
import Profile from "./pages/Profile";
import ManageUsers from "./pages/ManageUsers";
import Install from "./pages/Install";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  usePrivacyMode();
  
  // Handle fullscreen request on user interaction
  React.useEffect(() => {
    const handleUserInteraction = async () => {
      try {
        // Check if fullscreen is already active
        if (document.fullscreenElement || 
            (document as any).webkitFullscreenElement || 
            (document as any).msFullscreenElement) {
          return;
        }

        // Check if fullscreen is supported
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if ((document.documentElement as any).webkitRequestFullscreen) {
          await (document.documentElement as any).webkitRequestFullscreen();
        } else if ((document.documentElement as any).msRequestFullscreen) {
          await (document.documentElement as any).msRequestFullscreen();
        } else {
          console.log('Fullscreen API not supported in this browser');
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log('Fullscreen request failed:', error.message);
        } else {
          console.log('Fullscreen not supported or denied');
        }
      }
    };

    // Add event listeners for user interactions
    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, []);
  
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/install" element={<Install />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/payments" element={<Layout><Payments /></Layout>} />
        <Route path="/team" element={<Layout><Team /></Layout>} />
        <Route path="/fund-requests" element={<Layout><FundRequests /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/manage-users" element={<Layout><ManageUsers /></Layout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
