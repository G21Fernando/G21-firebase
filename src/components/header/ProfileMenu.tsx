import { UserRound } from 'lucide-react';
import { Session } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import ProfileAvatar from './ProfileAvatar';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProfileMenuProps {
  session: Session | null;
  profile: any;
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  onProfileClick: () => void;
}

const ProfileMenu = ({
  session,
  profile,
  dropdownOpen,
  setDropdownOpen,
  onProfileClick,
}: ProfileMenuProps) => {
  const navigate = useNavigate();
  const isAdmin = useAdminStatus(session);
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) {
      console.log('User has admin privileges');
      toast({
        title: "Admin access granted",
        description: "You now have access to admin features",
      });
    }
  }, [isAdmin, toast]);

  const handleLogout = async () => {
    try {
      // Clear storage first
      localStorage.clear();
      sessionStorage.clear();

      // Attempt to sign out without checking session
      await supabase.auth.signOut();

      // Navigate and show success message regardless of signout result
      navigate('/auth');
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account",
      });
    } catch (error) {
      console.error('Logout error:', error);
      
      // Ensure user is redirected even if there's an error
      navigate('/auth');
      toast({
        title: "Logged out",
        description: "You have been signed out of your account",
      });
    }
  };

  if (!session) {
    return (
      <Button variant="ghost" onClick={onProfileClick} className="h-8 md:h-10">
        <UserRound className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 md:h-10 md:w-10 md:px-4 rounded-full">
          <div className="flex items-center gap-2">
            <ProfileAvatar avatarUrl={profile?.avatar_url} />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onProfileClick}>Profile</DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem onClick={() => navigate('/admin')}>
            Switch to admin view
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;