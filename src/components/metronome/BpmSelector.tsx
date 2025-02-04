import React from 'react';
import { Input } from "@/components/ui/input";

interface BpmSelectorProps {
  bpm: number;
  onBpmChange: (bpm: number) => void;
}

const BpmSelector: React.FC<BpmSelectorProps> = ({ bpm, onBpmChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      onBpmChange(value);
    }
  };

  return (
    <div className="flex-1">
      <Input
        type="number"
        min="1"
        max="300"
        value={bpm}
        onChange={handleChange}
        className="w-full"
      />
    </div>
  );
};

export default BpmSelector;