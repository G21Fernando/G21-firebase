import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, UserRound, MapPin } from 'lucide-react';
import { AvatarWithFallback } from "@/components/ui/avatar-with-fallback";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield } from 'lucide-react';

interface PostHeaderProps {
  avatarUrl: string | null;
  username: string;
  createdAt: string;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  city?: string;
}

const PostHeader = ({ 
  avatarUrl, 
  username, 
  createdAt, 
  isOwner, 
  onEdit, 
  onDelete,
  city 
}: PostHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between p-2">
      <div className="flex items-center gap-2">
        <AvatarWithFallback
          username={username}
          src={avatarUrl}
          size="sm"
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">{username}</h3>
            {city && (
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <MapPin className="h-3 w-3" />
                <span>{city}</span>
              </div>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Shield className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-yellow-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Level 1 Completed</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-xs text-gray-500">
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      {isOwner && (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </CardHeader>
  );
};

export default PostHeader;