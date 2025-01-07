import { Button } from "@/components/ui/button";
import ChallengeInstructions from './ChallengeInstructions';

interface ChallengeControlsProps {
  isActive: boolean;
  timeLeft: number;
  onStart: () => void;
  onStop: () => void;
  isPaused: boolean;
}

const ChallengeControls = ({ isActive, timeLeft, onStart, onStop, isPaused }: ChallengeControlsProps) => {
  return (
    <>
      <ChallengeInstructions 
        isActive={isActive}
        timeLeft={timeLeft}
      />
      <div className="flex justify-center">
        <Button
          size="default"
          onClick={isActive ? onStop : onStart}
          className="bg-[#11245A] hover:bg-[#11245A]/90 text-white"
        >
          {isActive ? 'Stop Challenge' : 'Start Challenge'}
        </Button>
      </div>
    </>
  );
};

export default ChallengeControls;