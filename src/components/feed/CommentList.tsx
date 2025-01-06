import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
}

interface CommentListProps {
  comments: Comment[];
  commentContent: string;
  onCommentChange: (content: string) => void;
  onSubmitComment: () => void;
}

const CommentList = ({ comments, commentContent, onCommentChange, onSubmitComment }: CommentListProps) => {
  return (
    <div className="w-full space-y-1.5">
      {comments?.map((comment) => (
        <div key={comment.id} className="flex items-start gap-1">
          <img
            src={comment.profiles?.avatar_url || '/placeholder.svg'}
            alt={comment.profiles?.username}
            className="w-6 h-6 rounded-full"
          />
          <div className="flex-1 bg-gray-50 rounded-lg p-1.5">
            <p className="font-semibold text-sm">{comment.profiles?.username}</p>
            <p className="text-sm">{comment.content}</p>
          </div>
        </div>
      ))}
      <div className="flex gap-1.5 items-start">
        <Textarea
          placeholder="Write a comment..."
          value={commentContent}
          onChange={(e) => onCommentChange(e.target.value)}
          className="flex-1 min-h-[40px] resize-none text-sm py-1.5 px-2"
        />
        <Button 
          onClick={onSubmitComment}
          className="bg-[#11245A] hover:bg-[#11245A]/90 text-white text-sm py-1.5 px-3 h-auto"
        >
          Comment
        </Button>
      </div>
    </div>
  );
};

export default CommentList;