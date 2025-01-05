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
    <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-8">
      <div className="bg-[#E8DFD8] rounded-2xl shadow-sm">
        <StatsCard 
          points={dailyPoints}
          practiceTime={dailyPracticeTime}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm">
        <MetronomeControl 
          onPointsUpdate={onPointsUpdate}
          onPracticeTimeUpdate={onPracticeTimeUpdate}
        />
      </div>

      <div className="bg-[#f8f8f8] rounded-2xl shadow-sm">
        <LeaderboardCard />
      </div>
    </div>
  );
};

export default MainContent;