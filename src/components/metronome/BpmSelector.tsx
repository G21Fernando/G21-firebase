import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BpmSelectorProps {
  bpm: number;
  onBpmChange: (value: string) => void;
}

const BpmSelector: React.FC<BpmSelectorProps> = ({ bpm, onBpmChange }) => {
  // Generate array of BPM values from 70 to 120 in increments of 5
  const bpmValues = Array.from({ length: 11 }, (_, i) => 70 + (i * 5));

  return (
    <Select value={bpm.toString()} onValueChange={onBpmChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select BPM" />
      </SelectTrigger>
      <SelectContent>
        {bpmValues.map((value) => (
          <SelectItem key={value} value={value.toString()}>
            {value} BPM
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default BpmSelector;