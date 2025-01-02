import StatsCard from './StatsCard';
import MetronomeControl from './MetronomeControl';
import LeaderboardCard from './LeaderboardCard';

interface MainContentProps {
  dailyPoints: number;
  dailyPracticeTime: number;
  onPointsUpdate: (points: number) => void;
  onPracticeTimeUpdate: (time: number) => void;
}

const MainContent = ({
  dailyPoints,
  dailyPracticeTime,
  onPointsUpdate,
  onPracticeTimeUpdate
}: MainContentProps) => {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 mt-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-[#E2D1C3] p-4 md:p-6 rounded-lg shadow-md">
          <StatsCard 
            points={dailyPoints}
            practiceTime={dailyPracticeTime}
          />
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <MetronomeControl 
            onPointsUpdate={onPointsUpdate}
            onPracticeTimeUpdate={onPracticeTimeUpdate}
          />
        </div>

        <div className="bg-[#f3f3f3] p-4 md:p-6 rounded-lg shadow-md">
          <LeaderboardCard />
        </div>
      </div>
    </div>
  );
};

export default MainContent;