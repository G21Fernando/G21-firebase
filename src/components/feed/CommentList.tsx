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
    <div className="w-full space-y-2">
      {comments?.map((comment) => (
        <div key={comment.id} className="flex items-start gap-1.5">
          <img
            src={comment.profiles?.avatar_url || '/placeholder.svg'}
            alt={comment.profiles?.username}
            className="w-5 h-5 md:w-6 md:h-6 rounded-full"
          />
          <div className="flex-1 bg-gray-50 rounded-lg p-1.5 md:p-2">
            <p className="font-semibold text-xs md:text-sm">{comment.profiles?.username}</p>
            <p className="text-xs md:text-sm">{comment.content}</p>
          </div>
        </div>
      ))}
      <div className="flex gap-2 items-start">
        <Textarea
          placeholder="Write a comment..."
          value={commentContent}
          onChange={(e) => onCommentChange(e.target.value)}
          className="flex-1 min-h-[40px] md:min-h-[60px] resize-none text-xs md:text-sm py-1.5 px-2"
        />
        <Button 
          onClick={onSubmitComment}
          className="bg-[#15192C] hover:bg-[#15192C]/90 text-xs md:text-sm py-1.5 px-3 h-auto"
        >
          Comment
        </Button>
      </div>
    </div>
  );
};

export default CommentList;