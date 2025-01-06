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
    <div className="flex justify-between items-center w-full">
      <div className="flex-grow overflow-hidden">
        <p className="text-sm text-gray-600 break-words">This is where the text content will go</p>
      </div>
      <div className="flex items-center gap-3 ml-4 shrink-0">
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-transparent px-0 h-auto py-0.5"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
          <span className="text-gray-600 text-sm">{commentsCount}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-transparent px-0 h-auto py-0.5"
            onClick={onLike}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <span className="text-gray-600 text-sm">{likesCount}</span>
        </div>
      </div>
    </div>
  );
};

export default PostActions;