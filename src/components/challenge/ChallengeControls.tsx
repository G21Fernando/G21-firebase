import { Button } from "@/components/ui/button";
import ChallengeInstructions from './ChallengeInstructions';

interface ChallengeControlsProps {
  isActive: boolean;
  timeLeft: number;
  onStart: () => void;
}

const ChallengeControls = ({ isActive, timeLeft, onStart }: ChallengeControlsProps) => {
  return (
    <>
      <ChallengeInstructions 
        isActive={isActive}
        timeLeft={timeLeft}
      />
      <div className="flex justify-center">
        <Button
          size="default"
          onClick={onStart}
          disabled={isActive}
          className="bg-[#11245A] hover:bg-[#11245A]/90 text-white"
        >
          {isActive ? 'Challenge in Progress' : 'Start Challenge'}
        </Button>
      </div>
    </>
  );
};

export default ChallengeControls;