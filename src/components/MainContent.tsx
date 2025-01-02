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
    <div className="max-w-6xl mx-auto p-2 md:p-6 mt-12 md:mt-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6">
        <div className="bg-[#E2D1C3] p-3 md:p-6 rounded-lg transform scale-80 md:scale-100">
          <StatsCard 
            points={dailyPoints}
            practiceTime={dailyPracticeTime}
          />
        </div>

        <div className="bg-white p-3 md:p-6 rounded-lg transform scale-80 md:scale-100">
          <MetronomeControl 
            onPointsUpdate={onPointsUpdate}
            onPracticeTimeUpdate={onPracticeTimeUpdate}
          />
        </div>

        <div className="bg-[#f3f3f3] p-3 md:p-6 rounded-lg transform scale-80 md:scale-100">
          <LeaderboardCard />
        </div>
      </div>
    </div>
  );
};

export default MainContent;