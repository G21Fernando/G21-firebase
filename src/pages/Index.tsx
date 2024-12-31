import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import MetronomeControl from '@/components/MetronomeControl';
import StatsCard from '@/components/StatsCard';
import LeaderboardCard from '@/components/LeaderboardCard';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [points, setPoints] = useState(0);
  const [practiceTime, setPracticeTime] = useState(0);
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  const handlePracticeTimeUpdate = async (time: number) => {
    setPracticeTime(time);
    if (session?.user) {
      await supabase
        .from('profiles')
        .update({ practice_time: time, points })
        .eq('id', session.user.id);
    }
  };

  const handlePointsUpdate = async (newPoints: number) => {
    setPoints(newPoints);
    if (session?.user) {
      await supabase
        .from('profiles')
        .update({ points: newPoints })
        .eq('id', session.user.id);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F5E6DB' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex-grow text-center">
            <h1 className="text-4xl font-bold text-[#1A1F2C]">
              Stop scrolling Start strumming
            </h1>
          </div>
          <div className="flex-shrink-0">
            {session ? (
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="bg-[#1A1F2C] text-white hover:bg-[#2A2F3C]"
              >
                Sign Out
              </Button>
            ) : (
              <Button 
                onClick={() => navigate('/auth')}
                variant="outline"
                className="bg-[#1A1F2C] text-white hover:bg-[#2A2F3C]"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#E2D1C3] p-6 rounded-lg shadow-md">
            <StatsCard 
              points={points}
              practiceTime={practiceTime}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <MetronomeControl 
              onPointsUpdate={handlePointsUpdate}
              onPracticeTimeUpdate={handlePracticeTimeUpdate}
            />
          </div>

          <div className="bg-[#f3f3f3] p-6 rounded-lg shadow-md">
            <LeaderboardCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;