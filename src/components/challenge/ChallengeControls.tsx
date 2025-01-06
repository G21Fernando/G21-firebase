import { Button } from "@/components/ui/button";

interface ChallengeControlsProps {
  isActive: boolean;
  timeLeft: number;
  onStart: () => void;
}

const ChallengeControls = ({ isActive, timeLeft, onStart }: ChallengeControlsProps) => {
  return (
    <>
      <div className="text-center mb-3">
        <div className="text-lg font-semibold mb-1">{timeLeft} Seconds Left</div>
        {isActive && (
          <div className="text-xs text-gray-600">Press spacebar to count chord changes</div>
        )}
      </div>
      <div className="flex justify-center">
        <Button
          size="default"
          onClick={onStart}
          disabled={isActive}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isActive ? 'Challenge in Progress' : 'Start Challenge'}
        </Button>
      </div>
    </>
  );
};

export default ChallengeControls;