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
    <div className="min-h-screen p-6 bg-white">
      <h1 className="text-4xl font-bold text-[#8B5CF6] mb-8 text-center">
        Stop scrolling Start strumming
      </h1>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metronome Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <MetronomeControl 
            onPointsUpdate={setPoints}
            onPracticeTimeUpdate={handlePracticeTimeUpdate}
          />
          {showSignUpMessage && (
            <div className="mt-4 p-4 bg-[#E2D1C3] rounded-lg text-gray-700 text-sm">
              Sign up for free to join the community and track your progress
            </div>
          )}
        </div>

        {/* Stats Card Section */}
        <div className="bg-[#E2D1C3] p-6 rounded-lg shadow-md">
          <StatsCard 
            points={points}
            practiceTime={practiceTime}
          />
        </div>

        {/* Leaderboard Section */}
        <div className="bg-[#f3f3f3] p-6 rounded-lg shadow-md">
          <LeaderboardCard />
        </div>
      </div>
    </div>
  );
};

export default Index;