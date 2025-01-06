import Timer from './Timer';
import ChallengeControls from './ChallengeControls';

interface ChallengeGroupProps {
  isActive: boolean;
  timeLeft: number;
  chordChanges: number;
  onStart: () => void;
}

const ChallengeGroup = ({ isActive, timeLeft, chordChanges, onStart }: ChallengeGroupProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-3">
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

export default ChallengeGroup;