import React from 'react';
import { Button } from '@/components/ui/button';
import { Timer } from 'lucide-react';
import BpmSelector from './metronome/BpmSelector';
import VolumeControl from './metronome/VolumeControl';
import MetronomeIndicator from './metronome/MetronomeIndicator';
import { useMetronome } from './metronome/useMetronome';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface MetronomeControlProps {
  onPointsUpdate: (points: number) => void;
  onPracticeTimeUpdate: (seconds: number) => void;
}

const TimekeeperIcon = () => (
  <div className="relative w-8 h-8 mx-auto mb-2">
    <Timer className="w-full h-full text-[#9b87f5]" />
    {/* Add decorative stars */}
    <span className="absolute top-0 left-0 text-[#9b87f5] text-xs">✦</span>
    <span className="absolute top-1 right-0 text-[#9b87f5] text-xs">✦</span>
    <span className="absolute bottom-0 left-1/4 text-[#9b87f5] text-xs">✦</span>
  </div>
);

const MetronomeControl: React.FC<MetronomeControlProps> = ({ onPointsUpdate, onPracticeTimeUpdate }) => {
  const {
    isPlaying,
    bpm,
    indicator,
    volume,
    currentPoints,
    showContinuePrompt,
    startMetronome,
    stopMetronome,
    handleBpmChange,
    handleVolumeChange,
    handleContinue,
  } = useMetronome(onPointsUpdate, onPracticeTimeUpdate);

  if (showContinuePrompt) {
    return (
      <div className="p-6 h-full flex flex-col gap-4">
        <Alert>
          <AlertTitle className="text-lg font-semibold">Are you still here?</AlertTitle>
          <AlertDescription>
            <Button 
              onClick={handleContinue}
              className="mt-4 w-full bg-[#11245A] hover:bg-[#1a3575] text-white"
            >
              Yes, locked in!
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col gap-4">
      <div className="text-center mb-2">
        <TimekeeperIcon />
        <h2 className="text-2xl font-bold text-[#11245A]">The Timekeeper</h2>
        <p className="text-sm text-gray-600 mt-1">
          Master rhythm, track progress, and elevate your skills—one beat at a time.
        </p>
      </div>

      <Button 
        className="w-full bg-[#11245A] hover:bg-[#1a3575] text-white text-lg py-6 rounded-xl"
        onClick={isPlaying ? stopMetronome : startMetronome}
      >
        {isPlaying ? 'Stop' : 'Start'}
      </Button>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 w-full">
          <BpmSelector bpm={bpm} onBpmChange={handleBpmChange} />
          <MetronomeIndicator isActive={indicator} />
        </div>

        <div className="w-full">
          <VolumeControl volume={volume} onVolumeChange={handleVolumeChange} />
        </div>
      </div>
      
      {isPlaying && (
        <div className="text-center text-base font-medium text-[#11245A]">
          Points: {currentPoints}
        </div>
      )}
    </div>
  );
};

export default MetronomeControl;
