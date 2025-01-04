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
    <div className="max-w-6xl mx-auto px-6 md:px-8 pt-24 md:pt-28 pb-8 md:pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="bg-[#E8DFD8] rounded-2xl shadow-sm transform scale-[0.9] md:scale-100 origin-top">
          <StatsCard 
            points={dailyPoints}
            practiceTime={dailyPracticeTime}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm transform scale-[0.95] md:scale-100 origin-top">
          <MetronomeControl 
            onPointsUpdate={onPointsUpdate}
            onPracticeTimeUpdate={onPracticeTimeUpdate}
          />
        </div>

        <div className="bg-[#f8f8f8] rounded-2xl shadow-sm transform scale-[0.95] md:scale-100 origin-top">
          <LeaderboardCard />
        </div>
      </div>
    </div>
  );
};

export default MainContent;