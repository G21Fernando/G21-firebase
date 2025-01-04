import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRound, Zap } from 'lucide-react';
import ProfileEditDialog from './ProfileEditDialog';

const Header = ({ profile, onProfileUpdate }: { 
  profile: any;
  onProfileUpdate: () => void;
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="flex justify-between items-center px-4 h-16">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/5bfe01d1-1192-497c-a049-12e321aea77a.png" 
            alt="G21 Logo" 
            className="h-10"
          />
        </div>
        <div className="flex items-center gap-2">
          {session && (
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${location.pathname === '/challenge' ? 'bg-yellow-100' : ''}`}
              onClick={() => navigate('/challenge')}
            >
              <Zap className="h-5 w-5 text-yellow-500" />
            </Button>
          )}
          <div className="flex-shrink-0">
            {session ? (
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 md:h-auto md:w-auto md:px-4 rounded-full">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url} />
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
                className="bg-[#1A1F2C] text-white hover:bg-[#2A2F3C]"
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