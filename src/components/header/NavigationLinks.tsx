import { useLocation } from 'react-router-dom';
import { Users, Zap, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TimekeeperIcon from '../icons/TimekeeperIcon';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';

interface NavigationLinksProps {
  onNavigate: (path: string) => void;
}

const NavigationLinks = ({ onNavigate }: NavigationLinksProps) => {
  const location = useLocation();
  const session = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (session?.user) {
        const { data } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(!!data);
      }
    };

    checkAdminStatus();
  }, [session]);

  const handleClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <div className="hidden md:flex items-center gap-2">
      <Button
        type="button"
        variant={location.pathname === '/' ? 'ghost' : 'ghost'}
        size="icon"
        onClick={(e) => handleClick(e, '/')}
        className={location.pathname === '/' ? 'bg-[#F1F0FB] hover:bg-[#F1F0FB]' : ''}
      >
        <TimekeeperIcon className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant={location.pathname === '/challenge' ? 'ghost' : 'ghost'}
        size="icon"
        onClick={(e) => handleClick(e, '/challenge')}
        className={location.pathname === '/challenge' ? 'bg-[#F1F0FB] hover:bg-[#F1F0FB]' : ''}
      >
        <Zap className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant={location.pathname === '/feed' ? 'ghost' : 'ghost'}
        size="icon"
        onClick={(e) => handleClick(e, '/feed')}
        className={location.pathname === '/feed' ? 'bg-[#F1F0FB] hover:bg-[#F1F0FB]' : ''}
      >
        <Users className="h-5 w-5" />
      </Button>
      {isAdmin && (
        <Button
          type="button"
          variant={location.pathname === '/admin' ? 'ghost' : 'ghost'}
          size="icon"
          onClick={(e) => handleClick(e, '/admin')}
          className={location.pathname === '/admin' ? 'bg-[#F1F0FB] hover:bg-[#F1F0FB]' : ''}
        >
          <Settings className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default NavigationLinks;