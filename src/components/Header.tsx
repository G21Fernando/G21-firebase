import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import NavigationLinks from './header/NavigationLinks';
import ProfileMenu from './header/ProfileMenu';
import ProfileEditDialog from './ProfileEditDialog';
import { Badge } from './ui/badge';

interface HeaderProps {
  profile?: any;
  onProfileUpdate?: () => void;
}

const Header = ({ profile, onProfileUpdate }: HeaderProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminMode = location.pathname === '/admin';

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleLogoClick = () => {
    navigate('/roadmap');
  };

  const handleProfileClick = () => {
    if (session) {
      setShowProfileEdit(true);
      setDropdownOpen(false);
    } else {
      navigate('/auth');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm w-full z-50">
      <div className="flex justify-between items-center px-4 h-12 md:h-16">
        <div className="flex items-center gap-4">
          <img 
            src="/lovable-uploads/5bfe01d1-1192-497c-a049-12e321aea77a.png" 
            alt="G21 Logo" 
            className="h-8 md:h-10 cursor-pointer"
            onClick={handleLogoClick}
          />
          {isAdminMode && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Admin Mode
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <NavigationLinks onNavigate={handleNavigate} />
          <ProfileMenu
            session={session}
            profile={profile}
            dropdownOpen={dropdownOpen}
            setDropdownOpen={setDropdownOpen}
            onProfileClick={handleProfileClick}
            onLogout={handleLogout}
          />
        </div>
      </div>
      <ProfileEditDialog
        open={showProfileEdit}
        onOpenChange={setShowProfileEdit}
        profile={profile}
        onUpdate={onProfileUpdate || (() => {})}
      />
    </header>
  );
};

export default Header;