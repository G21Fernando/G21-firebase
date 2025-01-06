import Timer from './Timer';
import ChallengeControls from './ChallengeControls';

interface ChallengeMainProps {
  isActive: boolean;
  timeLeft: number;
  chordChanges: number;
  onStart: () => void;
}

const ChallengeMain = ({ isActive, timeLeft, chordChanges, onStart }: ChallengeMainProps) => {
  return (
    <div className="flex flex-col items-center">
      <Timer 
        isActive={isActive}
        timeLeft={timeLeft}
        chordChanges={chordChanges}
      />
      <ChallengeControls 
        isActive={isActive}
        timeLeft={timeLeft}
        onStart={onStart}
      />
    </div>
  );
};

export default ChallengeMain;