import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";
import { X } from "lucide-react";
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from "@/components/ui/use-toast";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
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
  const session = useSession();
  const { toast } = useToast();
  
  const getAvatarUrl = useMemo(() => (avatarPath: string | null) => {
    if (!avatarPath) return '/placeholder.svg';
    return supabase.storage.from('avatars').getPublicUrl(avatarPath).data.publicUrl;
  }, []);

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full space-y-1.5">
      {comments?.map((comment) => (
        <div key={comment.id} className="flex items-start gap-1">
          <img
            src={getAvatarUrl(comment.profiles?.avatar_url)}
            alt={comment.profiles?.username}
            className="w-6 h-6 rounded-full object-cover"
          />
          <div className="flex-1 bg-gray-50 rounded-lg p-1.5">
            <div className="flex justify-between items-start">
              <p className="font-semibold text-sm">{comment.profiles?.username}</p>
              {session?.user?.id === comment.user_id && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-gray-200"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
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
          className="text-gray-400 hover:text-gray-600 text-sm py-1.5 px-3 h-auto bg-gray-50 hover:bg-gray-100"
        >
          Comment
        </Button>
      </div>
    </div>
  );
};

export default CommentList;