import { useState } from 'react';
import MetronomeControl from '@/components/MetronomeControl';
import StatsCard from '@/components/StatsCard';

const Index = () => {
  const [points, setPoints] = useState(0);
  const [practiceTime, setPracticeTime] = useState(0);

  return (
    <div className="min-h-screen p-6 bg-white">
      <div className="max-w-md mx-auto space-y-6">
        <MetronomeControl 
          onPointsUpdate={setPoints}
          onPracticeTimeUpdate={setPracticeTime}
        />
        <StatsCard 
          points={points}
          practiceTime={practiceTime}
        />
      </div>
    </div>
  );
};

export default Index;