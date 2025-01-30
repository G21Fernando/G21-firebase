import * as React from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

interface UserAvatarProps extends React.ComponentPropsWithoutRef<typeof Avatar> {
  profilePicture?: string | null;
  userId?: string;
  username?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-20 w-20",
};

// Cache for preloaded images
const imageCache = new Map<string, boolean>();

export function UserAvatar({ 
  profilePicture,
  userId,
  username,
  size = "md",
  className,
  ...props 
}: UserAvatarProps) {
  const session = useSession();
  const [error, setError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Use provided userId/username, fallback to session user, or use a default
  const seed = userId || session?.user?.id || username || "default";
  const fallbackAvatar = `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`;

  // Preload and cache images
  React.useEffect(() => {
    if (!profilePicture || imageCache.has(profilePicture)) return;

    const img = new Image();
    img.onload = () => {
      imageCache.set(profilePicture, true);
      setIsLoading(false);
    };
    img.onerror = () => {
      setError(true);
      setIsLoading(false);
    };
    img.src = profilePicture;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [profilePicture]);

  // Reset states when profile picture changes
  React.useEffect(() => {
    if (!profilePicture) {
      setIsLoading(false);
      return;
    }
    
    setError(false);
    setIsLoading(!imageCache.has(profilePicture));
  }, [profilePicture]);

  const avatarSrc = error || !profilePicture ? fallbackAvatar : profilePicture;

  return (
    <Avatar 
      className={cn(
        sizeClasses[size],
        isLoading && "animate-pulse",
        className
      )} 
      {...props}
    >
      <AvatarImage
        src={avatarSrc}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
        onLoadingStatusChange={(status) => {
          if (status === "loaded") {
            setIsLoading(false);
          }
        }}
        className={cn(
          "object-cover",
          isLoading && "opacity-0"
        )}
      />
      <AvatarFallback>
        <img 
          src={fallbackAvatar}
          alt={`${username || 'User'}'s avatar`}
          className="h-full w-full"
        />
      </AvatarFallback>
    </Avatar>
  );
}
