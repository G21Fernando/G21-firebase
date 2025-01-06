import { Button } from "@/components/ui/button";
import { Heart, MessageSquare } from 'lucide-react';

interface PostActionsProps {
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  onLike: () => void;
}

const PostActions = ({ likesCount, commentsCount, isLiked, onLike }: PostActionsProps) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onLike}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-current text-red-500' : ''}`} />
          <span>{likesCount}</span>
        </Button>
        <div className="flex items-center gap-1 text-gray-600">
          <MessageSquare className="h-5 w-5" />
          <span>{commentsCount}</span>
        </div>
      </div>
    </div>
  );
};

export default PostActions;