import { Button } from "@/components/ui/button";

interface ChallengeControlsProps {
  isActive: boolean;
  timeLeft: number;
  onStart: () => void;
}

const ChallengeControls = ({ isActive, timeLeft, onStart }: ChallengeControlsProps) => {
  return (
    <>
      <div className="text-center mb-8">
        <div className="text-2xl font-bold mb-2">{timeLeft} time left</div>
        {!isActive ? (
          <div className="space-y-2">
            <div className="text-xl font-semibold text-neutral-600">Speed Unlocker</div>
            <div className="text-sm text-gray-600">Master Chord Changes and Transform Your Playing in 21 minutes</div>
          </div>
        ) : (
          <div className="text-sm text-gray-600">Press spacebar to count chord changes</div>
        )}
      </div>
      <Button
        size="lg"
        onClick={onStart}
        disabled={isActive}
        className="bg-neutral-600 hover:bg-neutral-700 text-white"
      >
        {isActive ? 'Challenge in Progress' : 'Start Challenge'}
      </Button>
    </>
  );
};

export default ChallengeControls;