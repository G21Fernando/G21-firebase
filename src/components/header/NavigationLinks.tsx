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
        variant={location.pathname === '/' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => onNavigate('/')}
      >
        <Timer className="h-5 w-5" />
      </Button>
      <Button
        variant={location.pathname === '/challenge' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => onNavigate('/challenge')}
      >
        <UserRound className="h-5 w-5" />
      </Button>
      <Button
        variant={location.pathname === '/feed' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => onNavigate('/feed')}
      >
        <Zap className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default NavigationLinks;