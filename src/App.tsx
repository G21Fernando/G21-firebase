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
  const hadSession = useRef(false);
  const sessionCheckTimeout = useRef<NodeJS.Timeout>();
  const initialCheckDone = useRef(false);

  useEffect(() => {
    if (!initialCheckDone.current) {
      if (session) {
        hadSession.current = true;
      }
      initialCheckDone.current = true;
      return;
    }

    if (sessionCheckTimeout.current) {
      clearTimeout(sessionCheckTimeout.current);
    }

    if (!session && hadSession.current) {
      sessionCheckTimeout.current = setTimeout(() => {
        toast({
          title: "Session expired",
          description: "Please sign in again",
          variant: "destructive",
        });
        hadSession.current = false;
      }, 2000);
    }

    if (session) {
      hadSession.current = true;
    }

    return () => {
      if (sessionCheckTimeout.current) {
        clearTimeout(sessionCheckTimeout.current);
      }
    };
  }, [session, toast]);

  if (!initialCheckDone.current) {
    return null;
  }

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