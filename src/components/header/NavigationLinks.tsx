import { useLocation } from 'react-router-dom';
import { Users, Zap, Settings, Timer } from 'lucide-react';
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
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (session?.user?.id) {
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('id')
          .eq('id', session.user.id)
          .single();
        setIsAdmin(!!adminUser);
        // If we're on the admin page, set admin mode to true
        setIsAdminMode(location.pathname === '/admin');
      }
    };

    checkAdminStatus();
  }, [session, location.pathname]);

  const handleModeSwitch = () => {
    if (isAdminMode) {
      onNavigate('/');
      setIsAdminMode(false);
    } else {
      onNavigate('/admin');
      setIsAdminMode(true);
    }
  };

  if (isAdminMode) {
    return (
      <div className="hidden md:flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleModeSwitch}
          className="text-blue-600"
        >
          <Timer className="h-5 w-5" />
          <span className="sr-only">Switch to User Mode</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-2">
      <Button
        variant={location.pathname === '/' ? 'ghost' : 'ghost'}
        size="icon"
        onClick={() => onNavigate('/')}
        className={location.pathname === '/' ? 'bg-[#F1F0FB] hover:bg-[#F1F0FB]' : ''}
      >
        <TimekeeperIcon className="h-5 w-5" />
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
        <Users className="h-5 w-5" />
      </Button>
      {isAdmin && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleModeSwitch}
          className="text-blue-600"
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">Switch to Admin Mode</span>
        </Button>
      )}
    </div>
  );
};

export default NavigationLinks;