import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BpmSelectorProps {
  bpm: number;
  onBpmChange: (value: string) => void;
}

const BpmSelector: React.FC<BpmSelectorProps> = ({ bpm, onBpmChange }) => {
  return (
    <Select value={bpm.toString()} onValueChange={onBpmChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select BPM" />
      </SelectTrigger>
      <SelectContent>
        {[60, 80, 100, 120, 140, 160, 180, 200].map((value) => (
          <SelectItem key={value} value={value.toString()}>
            {value} BPM
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default BpmSelector;