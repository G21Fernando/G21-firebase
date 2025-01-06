import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRound, Zap, Users, Timer } from 'lucide-react';
import ProfileEditDialog from './ProfileEditDialog';
import { supabase } from '@/integrations/supabase/client';

const Header = ({ profile, onProfileUpdate }: { 
  profile: any;
  onProfileUpdate: () => void;
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  const avatarUrl = useMemo(() => {
    if (!profile?.avatar_url) return undefined;
    return supabase.storage.from('avatars').getPublicUrl(profile.avatar_url).data.publicUrl;
  }, [profile?.avatar_url]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <header className="bg-white shadow-sm w-full z-50">
      <div className="flex justify-between items-center px-4 h-12 md:h-16">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/5bfe01d1-1192-497c-a049-12e321aea77a.png" 
            alt="G21 Logo" 
            className="h-8 md:h-10"
          />
        </div>
        <div className="flex items-center gap-2">
          {session && (
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${location.pathname === '/' ? 'bg-[#11245a]/10' : ''}`}
                onClick={() => navigate('/')}
              >
                <Timer className="h-5 w-5 text-[#11245a]" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${location.pathname === '/feed' ? 'bg-[#11245a]/10' : ''}`}
                onClick={() => navigate('/feed')}
              >
                <Users className="h-5 w-5 text-[#11245a]" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${location.pathname === '/challenge' ? 'bg-[#11245a]/10' : ''}`}
                onClick={() => navigate('/challenge')}
              >
                <Zap className="h-5 w-5 text-[#11245a]" />
              </Button>
            </div>
          )}
          <div className="flex-shrink-0">
            {session ? (
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
                      <span className="hidden md:inline-block">{profile?.username}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {profile && (
                    <ProfileEditDialog
                      currentUsername={profile.username}
                      currentAvatarUrl={profile.avatar_url}
                      userId={session.user.id}
                      onProfileUpdate={onProfileUpdate}
                      onClose={() => setDropdownOpen(false)}
                    />
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => navigate('/auth')}
                variant="outline"
                className="bg-[#11245a] text-white hover:bg-[#11245a]/90"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;