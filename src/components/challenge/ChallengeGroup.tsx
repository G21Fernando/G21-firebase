import Timer from './Timer';
import ChallengeControls from './ChallengeControls';

interface ChallengeGroupProps {
  isActive: boolean;
  timeLeft: number;
  chordChanges: number;
  onStart: () => void;
  onStop: () => void;
  isPaused: boolean;
}

const ChallengeGroup = ({ isActive, timeLeft, chordChanges, onStart, onStop, isPaused }: ChallengeGroupProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-3">
      <Timer 
        isActive={isActive}
        timeLeft={timeLeft}
        chordChanges={chordChanges}
        isPaused={isPaused}
      />
      <ChallengeControls 
        isActive={isActive}
        timeLeft={timeLeft}
        onStart={onStart}
        onStop={onStop}
        isPaused={isPaused}
      />
    </div>
  );
};

export default ChallengeGroup;