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
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-[calc(100vh-12rem)]">
        <div className="bg-[#E8DFD8] rounded-2xl shadow-sm h-full">
          <StatsCard 
            points={dailyPoints}
            practiceTime={dailyPracticeTime}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm h-full">
          <MetronomeControl 
            onPointsUpdate={onPointsUpdate}
            onPracticeTimeUpdate={onPracticeTimeUpdate}
          />
        </div>

        <div className="bg-[#f8f8f8] rounded-2xl shadow-sm h-full">
          <LeaderboardCard />
        </div>
      </div>
    </div>
  );
};

export default MainContent;