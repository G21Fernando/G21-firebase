import { Timer, Pencil } from 'lucide-react';

const TimekeeperIcon = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <Timer className="w-full h-full" />
    <div className="absolute -bottom-1 -right-1 transform rotate-45">
      <Pencil className="w-3/4 h-3/4" />
    </div>
  </div>
);

export default TimekeeperIcon;