import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { SessionContextProvider, useSession } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import Timekeeper from "./pages/Timekeeper";
import Auth from "./pages/Auth";
import Sprinter from "./pages/Sprinter";
import Feed from "./pages/Feed";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MobileFooter from "./components/MobileFooter";
import { useEffect, useRef } from "react";
import { useToast } from "./components/ui/use-toast";
import { useAdmin } from "@/hooks/useAdmin";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: 1000,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      staleTime: 1000 * 30,
      networkMode: 'always',
    },
  },
});

// Root Layout wrapper to ensure consistent styling
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#F5E6DB] flex flex-col">
      {children}
    </div>
  );
};

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
          description: "Please log in again to continue",
          variant: "destructive",
        });
      }, 100);
    }
  }, [session, toast]);

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const { isAdmin, isLoading } = useAdmin();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast({
        title: "Access denied",
        description: "You need admin privileges to access this page",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAdmin, isLoading, toast, navigate]);

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider 
      supabaseClient={supabase}
      initialSession={null}
    >
      <TooltipProvider>
        <RootLayout>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <Timekeeper />
                </ProtectedRoute>
              } />
              <Route path="/feed" element={
                <ProtectedRoute>
                  <Feed />
                </ProtectedRoute>
              } />
              <Route path="/sprinter" element={
                <ProtectedRoute>
                  <Sprinter />
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
            <MobileFooter />
          </BrowserRouter>
        </RootLayout>
      </TooltipProvider>
    </SessionContextProvider>
  </QueryClientProvider>
);

export default App;
