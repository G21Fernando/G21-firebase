import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Timer, Users, Zap } from 'lucide-react';

const MobileFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
      <div className="flex justify-around items-center h-16 px-4">
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full ${location.pathname === '/' ? 'bg-yellow-100' : ''}`}
          onClick={() => navigate('/')}
        >
          <Timer className="h-5 w-5 text-yellow-500" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full ${location.pathname === '/feed' ? 'bg-yellow-100' : ''}`}
          onClick={() => navigate('/feed')}
        >
          <Users className="h-5 w-5 text-yellow-500" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full ${location.pathname === '/challenge' ? 'bg-yellow-100' : ''}`}
          onClick={() => navigate('/challenge')}
        >
          <Zap className="h-5 w-5 text-yellow-500" />
        </Button>
      </div>
    </div>
  );
};

export default MobileFooter;