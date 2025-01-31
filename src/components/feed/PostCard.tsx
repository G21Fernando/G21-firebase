import { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import PostHeader from './PostHeader';
import PostMedia from './PostMedia';
import PostActions from './PostActions';
import CommentList from './CommentList';
import { Post } from '@/hooks/usePosts';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface PostCardProps {
  post: Post;
  isLastPost?: boolean;
  lastPostRef?: (node: HTMLDivElement) => void;
  onLike: () => Promise<void>;
  onComment: (content: string) => Promise<void>;
  onDelete: () => Promise<void>;
  onUpdate: (content: string) => Promise<void>;
  session: any;
}

const PostCard = ({
  post,
  isLastPost,
  lastPostRef,
  onLike,
  onComment,
  onDelete,
  onUpdate,
  session
}: PostCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isExpanded, setIsExpanded] = useState(false);
  const [commentContent, setCommentContent] = useState('');

  const handleUpdate = async () => {
    await onUpdate(editContent);
    setIsEditing(false);
  };

  const handleComment = async () => {
    await onComment(commentContent);
    setCommentContent('');
  };

  return (
    <div
      ref={isLastPost ? lastPostRef : undefined}
      className="transition-all duration-200 ease-in-out hover:shadow-lg"
    >
      <Card>
        <PostHeader
          avatarUrl={post.profiles.avatar_url}
          username={post.profiles.username}
          createdAt={post.created_at}
          isOwner={post.user_id === session?.user?.id}
          onEdit={() => {
            setIsEditing(true);
            setEditContent(post.content);
          }}
          onDelete={onDelete}
          city={post.profiles.city}
        />
        
        <CardContent className="p-4">
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex gap-2">
                <Button onClick={handleUpdate}>
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="whitespace-pre-wrap">{post.content}</p>
              {post.media_url && (
                <PostMedia
                  mediaUrl={post.media_url}
                  mediaType={post.media_type}
                />
              )}
            </>
          )}
        </CardContent>

        <CardFooter className="flex flex-col p-4">
          <PostActions
            postId={post.id}
            likes={post.likes}
            commentsCount={post.comments_count}
            onLike={onLike}
            onToggleComments={() => setIsExpanded(!isExpanded)}
          />
          
          {isExpanded && (
            <CommentList
              postId={post.id}
              commentContent={commentContent}
              onCommentChange={setCommentContent}
              onSubmitComment={handleComment}
            />
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PostCard;