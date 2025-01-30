import { Button } from "@/components/ui/button";

export interface PostActionsProps {
  postId: string;
  likes: { user_id: string; }[];
  commentsCount: number;
  onLike: () => Promise<void>;
  onToggleComments: () => void;
}

const PostActions = ({ postId, likes, commentsCount, onLike, onToggleComments }: PostActionsProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button onClick={onLike}>
          {likes.length} {likes.length === 1 ? 'Like' : 'Likes'}
        </Button>
        <Button onClick={onToggleComments}>
          {commentsCount} {commentsCount === 1 ? 'Comment' : 'Comments'}
        </Button>
      </div>
    </div>
  );
};

export default PostActions;
