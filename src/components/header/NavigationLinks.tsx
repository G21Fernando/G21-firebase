import { useLocation } from 'react-router-dom';
import { Home, Music2, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationLinksProps {
  onNavigate: (path: string) => void;
}

const NavigationLinks = ({ onNavigate }: NavigationLinksProps) => {
  const location = useLocation();

  return (
    <>
      <Button
        variant={location.pathname === '/' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => onNavigate('/')}
      >
        <Home className="h-5 w-5" />
      </Button>
      <Button
        variant={location.pathname === '/challenge' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => onNavigate('/challenge')}
      >
        <Timer className="h-5 w-5" />
      </Button>
      <Button
        variant={location.pathname === '/feed' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => onNavigate('/feed')}
      >
        <Music2 className="h-5 w-5" />
      </Button>
    </>
  );
};

export default NavigationLinks;