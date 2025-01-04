import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <div className="max-w-6xl mx-auto px-4 md:px-8 pt-20 pb-20 md:pb-12 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8">
        <div className="bg-light rounded-xl shadow-sm h-[22vh] md:h-auto overflow-hidden">
          <StatsCard 
            points={dailyPoints}
            practiceTime={dailyPracticeTime}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm h-[22vh] md:h-auto overflow-hidden">
          <MetronomeControl 
            onPointsUpdate={onPointsUpdate}
            onPracticeTimeUpdate={onPracticeTimeUpdate}
          />
        </div>

        <div className="bg-light rounded-xl shadow-sm h-[22vh] md:h-auto overflow-hidden">
          <LeaderboardCard />
        </div>
      </div>
    </div>
  );
};

export default MainContent;