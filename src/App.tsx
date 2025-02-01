import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import { AdminRoute } from "./components/routing/AdminRoute";
import Timekeeper from "./pages/Timekeeper";
import Auth from "./pages/Auth";
import Sprinter from "./pages/Sprinter";
import Feed from "./pages/Feed";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Tutor from "./pages/Tutor";
import MobileFooter from "./components/MobileFooter";

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

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#F5E6DB] flex flex-col">
    {children}
  </div>
);

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
              <Route path="/tutor" element={
                <ProtectedRoute>
                  <Tutor />
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