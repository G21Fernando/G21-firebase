import { Routes, Route, Navigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import Header from '@/components/Header';
import MobileFooter from '@/components/MobileFooter';
import Challenge from '@/pages/Challenge';
import Dashboard from '@/pages/Dashboard';
import Feed from '@/pages/Feed';
import Roadmap from '@/pages/Roadmap';

const MainApp = () => {
  const session = useSession();

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen pb-16 md:pb-0" style={{ backgroundColor: '#F5E6DB' }}>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/roadmap" replace />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/challenge" element={<Challenge />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/feed" element={<Feed />} />
      </Routes>
      <MobileFooter />
    </div>
  );
};

export default MainApp;