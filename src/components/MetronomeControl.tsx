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
    <div className="p-6 md:p-8">
      <Button 
        className="w-full mb-8 bg-[#1A1F2C] hover:bg-[#2A2F3C] text-white text-xl py-6"
        onClick={isPlaying ? stopMetronome : startMetronome}
      >
        {isPlaying ? 'Stop' : 'Start'}
      </Button>

      <div className="flex flex-col items-center gap-6 mb-6">
        <div className="flex items-center gap-4">
          <BpmSelector bpm={bpm} onBpmChange={handleBpmChange} />
          <MetronomeIndicator isActive={indicator} />
        </div>

        <div className="w-full max-w-[280px]">
          <VolumeControl volume={volume} onVolumeChange={handleVolumeChange} />
        </div>
      </div>
      
      {isPlaying && (
        <div className="text-center mt-6 text-lg font-medium text-[#1A1F2C]">
          Points: {currentPoints}
        </div>
      )}
    </div>
  );
};

export default MetronomeControl;