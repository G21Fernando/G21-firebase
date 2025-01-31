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
    <main className="flex-1 overflow-auto">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#E8DFD8] rounded-2xl shadow-sm p-6 min-h-[24rem]">
            <StatsCard 
              points={dailyPoints}
              practiceTime={dailyPracticeTime}
              dailyPoints={dailyPoints}
              dailyPracticeTime={dailyPracticeTime}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 min-h-[24rem]">
            <MetronomeControl 
              onPointsUpdate={onPointsUpdate}
              onPracticeTimeUpdate={onPracticeTimeUpdate}
            />
          </div>

          <div className="bg-[#f8f8f8] rounded-2xl shadow-sm p-6 min-h-[24rem]">
            <LeaderboardCard />
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;