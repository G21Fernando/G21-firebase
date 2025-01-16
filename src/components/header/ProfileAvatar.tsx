import { UserRound } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';

interface ProfileAvatarProps {
  avatarUrl?: string;
  className?: string;
}

const ProfileAvatar = ({ avatarUrl, className = "h-6 w-6 md:h-8 md:w-8" }: ProfileAvatarProps) => {
  const publicAvatarUrl = avatarUrl 
    ? supabase.storage.from('avatars').getPublicUrl(avatarUrl).data.publicUrl
    : undefined;

  return (
    <Avatar className={className}>
      <AvatarImage src={publicAvatarUrl} />
      <AvatarFallback>
        <UserRound className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;