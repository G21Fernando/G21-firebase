import { Button } from "@/components/ui/button";

interface ChallengeControlsProps {
  isActive: boolean;
  timeLeft: number;
  onStart: () => void;
}

const ChallengeControls = ({ isActive, timeLeft, onStart }: ChallengeControlsProps) => {
  return (
    <>
      <div className="text-center mb-4">
        <div className="text-xl font-semibold mb-2">{timeLeft} time left</div>
        {isActive && (
          <div className="text-sm text-gray-600">Press spacebar to count chord changes</div>
        )}
      </div>
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={onStart}
          disabled={isActive}
          className="bg-neutral-600 hover:bg-neutral-700 text-white"
        >
          {isActive ? 'Challenge in Progress' : 'Start Challenge'}
        </Button>
      </div>
    </>
  );
};

export default ChallengeControls;