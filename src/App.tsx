import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import MainContent from '@/components/MainContent';
import AuthPage from '@/pages/AuthPage';
import Dashboard from '@/pages/Dashboard';
import ChordSprinter from '@/pages/ChordSprinter';
import UserProfile from './pages/UserProfile';

const App = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [dailyPoints, setDailyPoints] = useState(0);
  const [dailyPracticeTime, setDailyPracticeTime] = useState(0);

  useEffect(() => {
    const fetchDailyStats = async () => {
      if (session?.user?.id) {
        const { data } = await supabase
          .from('profiles')
          .select('daily_points, daily_practice_time')
          .eq('id', session.user.id)
          .single();

        if (data) {
          setDailyPoints(data.daily_points || 0);
          setDailyPracticeTime(data.daily_practice_time || 0);
        }
      }
    };

    fetchDailyStats();
  }, [session, supabase]);

  const handlePointsUpdate = (points: number) => {
    setDailyPoints(points);
  };

  const handlePracticeTimeUpdate = (time: number) => {
    setDailyPracticeTime(time);
  };

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <MainContent
              dailyPoints={dailyPoints}
              dailyPracticeTime={dailyPracticeTime}
              onPointsUpdate={handlePointsUpdate}
              onPracticeTimeUpdate={handlePracticeTimeUpdate}
            />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/chord-sprinter" element={
          <ProtectedRoute>
            <ChordSprinter />
          </ProtectedRoute>
        } />
        <Route path="/profile/:username" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;