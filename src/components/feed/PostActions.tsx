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
    <div className="flex flex-col gap-4">
      <Button
        className="bg-[#1C2024] text-white hover:bg-[#1C2024]/90"
      >
        Comment
      </Button>
      <div className="flex gap-6 justify-center">
        <Button
          variant="ghost"
          size="sm"
          className="flex gap-2 hover:bg-transparent px-0"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-gray-600">{commentsCount}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex gap-2 hover:bg-transparent px-0"
          onClick={onLike}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          <span className="text-gray-600">{likesCount}</span>
        </Button>
      </div>
    </div>
  );
};

export default PostActions;