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
    <div className="max-w-6xl mx-auto px-4 md:px-8 pt-2 md:pt-28 pb-20 md:pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8">
        <div className="bg-[#E8DFD8] rounded-xl md:rounded-2xl shadow-sm h-[25vh] md:h-auto">
          <StatsCard 
            points={dailyPoints}
            practiceTime={dailyPracticeTime}
          />
        </div>

        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm h-[25vh] md:h-auto">
          <MetronomeControl 
            onPointsUpdate={onPointsUpdate}
            onPracticeTimeUpdate={onPracticeTimeUpdate}
          />
        </div>

        <div className="bg-[#f8f8f8] rounded-xl md:rounded-2xl shadow-sm h-[25vh] md:h-auto">
          <LeaderboardCard />
        </div>
      </div>
    </div>
  );
};

export default MainContent;