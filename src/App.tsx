import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider, useSession } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Challenge from "./pages/Challenge";
import Feed from "./pages/Feed";
import Dashboard from "./pages/Dashboard";
import Roadmap from "./pages/Roadmap";
import AdminDashboard from "./pages/AdminDashboard";
import MobileFooter from "./components/MobileFooter";
import { useEffect, useRef } from "react";
import { useToast } from "./components/ui/use-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const { toast } = useToast();
  const hadInitialSession = useRef(false);

  useEffect(() => {
    // Only set initial session state once
    if (session && !hadInitialSession.current) {
      hadInitialSession.current = true;
    }
    
    // Only show expired message if we previously had a session
    if (!session && hadInitialSession.current) {
      toast({
        title: "Session expired",
        description: "Please sign in again",
        variant: "destructive",
      });
      hadInitialSession.current = false; // Reset the flag
    }
  }, [session, toast]);

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      {children}
      <MobileFooter />
    </>
  );
};

// Admin route wrapper
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (session?.user) {
        const { data } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', session.user.id)
          .single();

        if (!data) {
          toast({
            title: "Access denied",
            description: "You need admin privileges to access this page",
            variant: "destructive",
          });
        }
      }
    };

    checkAdminStatus();
  }, [session, toast]);

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      {children}
      <MobileFooter />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider 
      supabaseClient={supabase}
      initialSession={null}
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/feed" element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            } />
            <Route path="/challenge" element={
              <ProtectedRoute>
                <Challenge />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/roadmap" element={
              <ProtectedRoute>
                <Roadmap />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SessionContextProvider>
  </QueryClientProvider>
);

export default App;