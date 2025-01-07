interface ChallengeInstructionsProps {
  isActive: boolean;
  timeLeft: number;
}

const ChallengeInstructions = ({ isActive, timeLeft }: ChallengeInstructionsProps) => {
  return (
    <div className="text-center mb-3">
      <div className="text-lg font-semibold mb-1">{timeLeft} Seconds Left</div>
      {isActive && (
        <div className="text-xs text-gray-600">Press spacebar to count clean clear sounding chord transitions</div>
      )}
    </div>
  );
};

export default ChallengeInstructions;