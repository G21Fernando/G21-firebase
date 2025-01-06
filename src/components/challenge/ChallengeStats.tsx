import StatsCard from '@/components/StatsCard';

interface ChallengeStatsProps {
  profile: any;
}

const ChallengeStats = ({ profile }: ChallengeStatsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg">
      <StatsCard 
        practiceTime={profile?.daily_practice_time || 0}
        points={profile?.daily_points || 0}
      />
    </div>
  );
};

export default ChallengeStats;