import { Timer } from 'lucide-react';

const TimekeeperIcon = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <Timer className="w-full h-full" />
    <span className="absolute top-0 left-0 text-xs">✦</span>
    <span className="absolute top-1 right-0 text-xs">✦</span>
    <span className="absolute bottom-0 left-1/4 text-xs">✦</span>
  </div>
);

export default TimekeeperIcon;