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
    <div className="max-w-6xl mx-auto px-2 md:px-8 pt-1 md:pt-28 pb-16 md:pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 md:gap-8">
        <div className="bg-[#E8DFD8] rounded-lg md:rounded-2xl shadow-sm h-[20vh] md:h-auto">
          <StatsCard 
            points={dailyPoints}
            practiceTime={dailyPracticeTime}
          />
        </div>

        <div className="bg-white rounded-lg md:rounded-2xl shadow-sm h-[20vh] md:h-auto">
          <MetronomeControl 
            onPointsUpdate={onPointsUpdate}
            onPracticeTimeUpdate={onPracticeTimeUpdate}
          />
        </div>

        <div className="bg-[#f8f8f8] rounded-lg md:rounded-2xl shadow-sm h-[20vh] md:h-auto">
          <LeaderboardCard />
        </div>
      </div>
    </div>
  );
};

export default MainContent;