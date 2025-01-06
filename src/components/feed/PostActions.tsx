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
    <div className="flex gap-4 md:gap-6">
      <Button
        variant="ghost"
        size="sm"
        className="flex gap-1.5 hover:bg-transparent px-0 h-auto py-0.5"
      >
        <MessageSquare className="h-4 w-4 md:h-5 md:w-5" />
        <span className="text-gray-600 text-xs md:text-sm">{commentsCount}</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="flex gap-1.5 hover:bg-transparent px-0 h-auto py-0.5"
        onClick={onLike}
      >
        <Heart className={`h-4 w-4 md:h-5 md:w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        <span className="text-gray-600 text-xs md:text-sm">{likesCount}</span>
      </Button>
    </div>
  );
};

export default PostActions;