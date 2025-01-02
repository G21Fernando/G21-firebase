import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Volume, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number[]) => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ volume, onVolumeChange }) => {
  const [prevVolume, setPrevVolume] = useState<number>(volume);
  const [isMuted, setIsMuted] = useState(false);

  const handleMuteToggle = () => {
    if (isMuted) {
      // Unmute: restore previous volume
      onVolumeChange([prevVolume * 100]);
      setIsMuted(false);
    } else {
      // Mute: save current volume and set to 0
      setPrevVolume(volume);
      onVolumeChange([0]);
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (newValue: number[]) => {
    onVolumeChange(newValue);
    if (newValue[0] === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
      setPrevVolume(newValue[0] / 100);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={handleMuteToggle}
      >
        {isMuted ? (
          <VolumeX className="h-5 w-5" />
        ) : (
          <Volume className="h-5 w-5" />
        )}
      </Button>
      <Slider
        value={[volume * 100]}
        onValueChange={handleVolumeChange}
        max={100}
        step={1}
        className="w-32"
      />
    </div>
  );
};

export default VolumeControl;