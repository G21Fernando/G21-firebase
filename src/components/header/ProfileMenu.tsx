import { useMemo } from 'react';
import { UserRound, Settings } from 'lucide-react';
import { Session } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/user-avatar';
import { useAdmin } from '@/hooks/useAdmin';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProfileMenuProps {
  session: Session | null;
  profile: any;
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  onProfileClick: () => void;
  onLogout: () => void;
}

const ProfileMenu = ({
  session,
  profile,
  dropdownOpen,
  setDropdownOpen,
  onProfileClick,
}: ProfileMenuProps) => {
  const { isAdmin, isLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const avatarUrl = useMemo(() => {
    if (!profile?.avatar_url) return undefined;
    return profile.avatar_url;
  }, [profile?.avatar_url]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
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
            <UserAvatar
              profilePicture={profile?.avatar_url}
              userId={session.user.id}
              username={profile?.username || session.user.email?.split("@")[0]}
              size="sm"
            />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onProfileClick}>
          Edit Profile
        </DropdownMenuItem>
        {isAdmin && !isLoading && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.location.href = '/admin'}>
              <Settings className="mr-2 h-4 w-4" />
              Admin Dashboard
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;