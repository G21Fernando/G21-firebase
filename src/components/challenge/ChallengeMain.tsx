import Timer from './Timer';
import ChallengeControls from './ChallengeControls';

interface ChallengeMainProps {
  isActive: boolean;
  timeLeft: number;
  chordChanges: number;
  onStart: () => void;
  onStop: () => void;
}

const ChallengeMain = ({ isActive, timeLeft, chordChanges, onStart, onStop }: ChallengeMainProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <Timer 
        isActive={isActive}
        timeLeft={timeLeft}
        chordChanges={chordChanges}
      />
      <ChallengeControls 
        isActive={isActive}
        timeLeft={timeLeft}
        onStart={onStart}
        onStop={onStop}
      />
    </div>
  );
};

export default ChallengeMain;