import { useMemo, useEffect, useState } from 'react';
import { UserRound } from 'lucide-react';
import { Session } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

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
  onLogout,
}: ProfileMenuProps) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  
  const avatarUrl = useMemo(() => {
    if (!profile?.avatar_url) return undefined;
    return supabase.storage.from('avatars').getPublicUrl(profile.avatar_url).data.publicUrl;
  }, [profile?.avatar_url]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (session?.user) {
        try {
          console.log('Checking admin status for user:', session.user.id);
          const { data, error } = await supabase
            .from('admin_users')
            .select('*')  // Changed from 'id' to '*' to get full row
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error checking admin status:', error);
            toast({
              title: "Error checking admin status",
              description: error.message,
              variant: "destructive",
            });
            return;
          }
          
          console.log('Admin check query result:', data);
          setIsAdmin(!!data);
          
          if (!!data) {
            console.log('User is an admin');
          } else {
            console.log('User is not an admin');
          }
        } catch (error) {
          console.error('Unexpected error checking admin status:', error);
          toast({
            title: "Error checking admin status",
            description: "An unexpected error occurred",
            variant: "destructive",
          });
        }
      }
    };

    checkAdminStatus();
  }, [session, toast]);

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
            <Avatar className="h-6 w-6 md:h-8 md:w-8">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>
                <UserRound className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
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
        <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;