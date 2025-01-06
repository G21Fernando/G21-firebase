import { Timer } from 'lucide-react';

const TimekeeperIcon = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <Timer className="w-full h-full" />
  </div>
);

export default TimekeeperIcon;