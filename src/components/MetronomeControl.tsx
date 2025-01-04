import React from 'react';
import { Button } from '@/components/ui/button';
import BpmSelector from './metronome/BpmSelector';
import VolumeControl from './metronome/VolumeControl';
import MetronomeIndicator from './metronome/MetronomeIndicator';
import { useMetronome } from './metronome/useMetronome';

interface MetronomeControlProps {
  onPointsUpdate: (points: number) => void;
  onPracticeTimeUpdate: (seconds: number) => void;
}

const MetronomeControl: React.FC<MetronomeControlProps> = ({ onPointsUpdate, onPracticeTimeUpdate }) => {
  const {
    isPlaying,
    bpm,
    indicator,
    volume,
    currentPoints,
    startMetronome,
    stopMetronome,
    handleBpmChange,
    handleVolumeChange,
  } = useMetronome(onPointsUpdate, onPracticeTimeUpdate);

  return (
    <div className="p-6 h-full flex flex-col gap-4">
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