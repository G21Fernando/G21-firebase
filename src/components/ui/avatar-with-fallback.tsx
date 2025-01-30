import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useSession } from "@supabase/auth-helpers-react";

interface AvatarWithFallbackProps extends React.ComponentPropsWithoutRef<typeof Avatar> {
  username?: string;
  src?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export function AvatarWithFallback({ 
  username, 
  src, 
  size = "md",
  className,
  ...props 
}: AvatarWithFallbackProps) {
  const session = useSession();
  const [isLoading, setIsLoading] = React.useState(true);
  const [imageError, setImageError] = React.useState(false);

  // Use username or user ID as the seed for consistent avatar generation
  const seed = username || session?.user?.id || "default";
  const fallbackAvatar = `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`;

  React.useEffect(() => {
    // Reset error state when src changes
    setImageError(false);
  }, [src]);

  return (
    <Avatar className={cn(sizeClasses[size], "relative", className)} {...props}>
      {src && !imageError ? (
        <AvatarImage
          src={src}
          className="object-cover"
          onLoadingStatusChange={(status) => setIsLoading(status === "loading")}
          onError={() => {
            console.error('Avatar image failed to load:', src);
            setImageError(true);
          }}
        />
      ) : null}
      <AvatarFallback 
        className={cn(
          "bg-secondary absolute inset-0 flex items-center justify-center",
          isLoading && "animate-pulse"
        )}
      >
        {!isLoading && (
          <div className="relative w-full h-full">
            <img 
              src={imageError || !src ? fallbackAvatar : src} 
              alt={`${username || 'User'}'s avatar`}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}
      </AvatarFallback>
    </Avatar>
  );
}
