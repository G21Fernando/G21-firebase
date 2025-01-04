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
    <div className="flex gap-6">
      <Button
        variant="ghost"
        size="sm"
        className="flex gap-2 hover:bg-transparent px-0"
        onClick={onLike}
      >
        <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        <span className="text-gray-600">{likesCount}</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="flex gap-2 hover:bg-transparent px-0"
      >
        <MessageSquare className="h-5 w-5" />
        <span className="text-gray-600">{commentsCount}</span>
      </Button>
    </div>
  );
};

export default PostActions;