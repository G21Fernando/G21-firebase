import { useLocation } from 'react-router-dom';
import { Timer, UserRound, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationLinksProps {
  onNavigate: (path: string) => void;
}

const NavigationLinks = ({ onNavigate }: NavigationLinksProps) => {
  const location = useLocation();

  return (
    <div className="hidden md:flex items-center gap-2">
      <Button
        variant={location.pathname === '/' ? 'ghost' : 'ghost'}
        size="icon"
        onClick={() => onNavigate('/')}
        className={location.pathname === '/' ? 'bg-[#F1F0FB] hover:bg-[#F1F0FB]' : ''}
      >
        <Timer className="h-5 w-5" />
      </Button>
      <Button
        variant={location.pathname === '/challenge' ? 'ghost' : 'ghost'}
        size="icon"
        onClick={() => onNavigate('/challenge')}
        className={location.pathname === '/challenge' ? 'bg-[#F1F0FB] hover:bg-[#F1F0FB]' : ''}
      >
        <Zap className="h-5 w-5" />
      </Button>
      <Button
        variant={location.pathname === '/feed' ? 'ghost' : 'ghost'}
        size="icon"
        onClick={() => onNavigate('/feed')}
        className={location.pathname === '/feed' ? 'bg-[#F1F0FB] hover:bg-[#F1F0FB]' : ''}
      >
        <UserRound className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default NavigationLinks;