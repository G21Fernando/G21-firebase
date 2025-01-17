import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Auth from './pages/Auth';
import UsersPage from './pages/admin/Users';
import ContentPage from './pages/admin/Content';
import MainApp from './MainApp';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Auth Route */}
          <Route path="/auth" element={<Auth />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute><Navigate to="/admin/users" replace /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
          <Route path="/admin/content" element={<ProtectedRoute><ContentPage /></ProtectedRoute>} />

          {/* Main App Routes */}
          <Route path="/*" element={<MainApp />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;