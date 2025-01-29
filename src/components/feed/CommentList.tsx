import { useRef, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserRound, Loader2 } from "lucide-react";
import { useComments } from '@/hooks/usePosts';
import { Skeleton } from "@/components/ui/skeleton";

const CommentSkeleton = () => (
  <div className="flex gap-2 items-start">
    <Skeleton className="h-8 w-8 rounded-full" />
    <div className="flex-1 space-y-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-12 w-full" />
    </div>
  </div>
);

interface CommentListProps {
  postId: string;
  commentContent: string;
  onCommentChange: (content: string) => void;
  onSubmitComment: () => void;
}

const CommentList = ({
  postId,
  commentContent,
  onCommentChange,
  onSubmitComment
}: CommentListProps) => {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useComments(postId);

  const observer = useRef<IntersectionObserver>();
  const lastCommentRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 mt-4">
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            <CommentSkeleton />
            <CommentSkeleton />
            <CommentSkeleton />
          </div>
        ) : (
          data?.pages.map((page, pageIndex) => (
            <div key={pageIndex} className="space-y-4">
              {page.comments.map((comment, commentIndex) => {
                const isLastComment = pageIndex === data.pages.length - 1 && commentIndex === page.comments.length - 1;
                
                return (
                  <div
                    key={comment.id}
                    ref={isLastComment ? lastCommentRef : undefined}
                    className="flex items-start gap-2"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={comment.profiles.avatar_url || ''} alt={comment.profiles.username} />
                      <AvatarFallback>
                        <UserRound className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">
                          {comment.profiles.username}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        
        {isFetchingNextPage && (
          <div className="flex justify-center p-2">
            <Loader2 className="animate-spin" />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Textarea
          placeholder="Write a comment..."
          value={commentContent}
          onChange={(e) => onCommentChange(e.target.value)}
          className="min-h-[80px]"
        />
        <Button
          onClick={onSubmitComment}
          disabled={!commentContent.trim()}
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default CommentList;