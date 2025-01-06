import ChallengeGroup from './ChallengeGroup';

interface ChallengeMainProps {
  isActive: boolean;
  timeLeft: number;
  chordChanges: number;
  onStart: () => void;
}

const ChallengeMain = ({ isActive, timeLeft, chordChanges, onStart }: ChallengeMainProps) => {
  return (
    <div className="flex flex-col items-center">
      <ChallengeGroup 
        isActive={isActive}
        timeLeft={timeLeft}
        chordChanges={chordChanges}
        onStart={onStart}
      />
    </div>
  );
};

export default ChallengeMain;