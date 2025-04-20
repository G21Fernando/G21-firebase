
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Toaster } from '@/components/ui/toaster';
import { ProtectedRoute } from '@/components/routing/ProtectedRoute';
import { AdminRoute } from '@/components/routing/AdminRoute';
import Header from '@/components/Header';
import MainContent from '@/components/MainContent';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import ChordSprinter from '@/pages/ChordSprinter';
import UserProfile from './pages/UserProfile';
import Tutor from './pages/Tutor';
import MobileFooter from './components/MobileFooter';
import Feed from './pages/Feed';
import AdminDashboard from './pages/AdminDashboard';
import Sprinter from './pages/Sprinter';

const App = () => {
  console.log('App rendering...');
  const session = useSession();
  const supabase = useSupabaseClient();
  const [dailyPoints, setDailyPoints] = useState(0);
  const [dailyPracticeTime, setDailyPracticeTime] = useState(0);
  const [profile, setProfile] = useState<any>(null);

  console.log('Session state:', session ? 'Logged in' : 'Not logged in');

  const fetchDailyStats = async () => {
    if (session?.user?.id) {
      console.log('Fetching user stats...');
      const { data, error } = await supabase
        .from('profiles')
        .select('daily_points, daily_practice_time, *')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        console.log('Profile data received:', data);
        setDailyPoints(data.daily_points || 0);
        setDailyPracticeTime(data.daily_practice_time || 0);
        setProfile(data);
      }
    }
  };

  useEffect(() => {
    fetchDailyStats();
  }, [session, supabase]);

  const handlePointsUpdate = (points: number) => {
    setDailyPoints(points);
  };

  const handlePracticeTimeUpdate = (time: number) => {
    setDailyPracticeTime(time);
  };

  const handleProfileUpdate = () => {
    if (session?.user?.id) {
      fetchDailyStats();
    }
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#F5E6DB]">
        {session && (
          <Header 
            profile={profile} 
            onProfileUpdate={handleProfileUpdate} 
          />
        )}
        <div className="flex-1">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/tutor" element={
              <ProtectedRoute>
                <Tutor />
              </ProtectedRoute>
            } />
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
            <Route path="/feed" element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            {/* Fix the /sprinter route to directly use the Sprinter component */}
            <Route path="/sprinter" element={
              <ProtectedRoute>
                <Sprinter />
              </ProtectedRoute>
            } />
            <Route path="/profile/:username" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
        {session && <MobileFooter />}
        <Toaster />
      </div>
    </Router>
  );
};

export default App;
