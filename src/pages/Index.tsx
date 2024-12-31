import { useState } from 'react';
import MetronomeControl from '@/components/MetronomeControl';
import StatsCard from '@/components/StatsCard';
import LeaderboardCard from '@/components/LeaderboardCard';

const Index = () => {
  const [points, setPoints] = useState(0);
  const [practiceTime, setPracticeTime] = useState(0);
  const [showSignUpMessage, setShowSignUpMessage] = useState(false);

  const handlePracticeTimeUpdate = (time: number) => {
    setPracticeTime(time);
    if (time > 0 && !showSignUpMessage) {
      setShowSignUpMessage(true);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F5E6DB' }}>
      <h1 className="text-4xl font-bold text-[#1A1F2C] mb-8 text-center">
        Stop scrolling Start strumming
      </h1>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Card Section - Left */}
        <div className="bg-[#E2D1C3] p-6 rounded-lg shadow-md">
          <StatsCard 
            points={points}
            practiceTime={practiceTime}
          />
        </div>

        {/* Metronome Section - Center */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <MetronomeControl 
            onPointsUpdate={setPoints}
            onPracticeTimeUpdate={handlePracticeTimeUpdate}
          />
          {showSignUpMessage && (
            <div className="mt-4 p-4 bg-[#E2D1C3] rounded-lg text-[#1A1F2C] text-sm">
              Sign up for free to join the community and track your progress
            </div>
          )}
        </div>

        {/* Leaderboard Section - Right */}
        <div className="bg-[#f3f3f3] p-6 rounded-lg shadow-md">
          <LeaderboardCard />
        </div>
      </div>
    </div>
  );
};

export default Index;