import { Heart, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface PostActionsProps {
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  onLike: () => void;
}

const PostActions = ({ likesCount, commentsCount, isLiked, onLike }: PostActionsProps) => {
  return (
    <div className="flex gap-4 w-full">
      <Button
        variant="ghost"
        size="sm"
        className="flex gap-2"
        onClick={onLike}
      >
        <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        {likesCount}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="flex gap-2"
      >
        <MessageSquare className="h-4 w-4" />
        {commentsCount}
      </Button>
    </div>
  );
};

export default PostActions;