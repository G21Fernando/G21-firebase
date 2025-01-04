import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useSession } from '@supabase/auth-helpers-react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import PostHeader from './PostHeader';
import PostMedia from './PostMedia';
import PostActions from './PostActions';
import CommentList from './CommentList';
import { usePosts } from '@/hooks/usePosts';
import { usePostActions } from '@/hooks/usePostActions';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

const PostList = ({ onUpdate }: { onUpdate: number }) => {
  const session = useSession();
  const { data: posts, isLoading, refetch } = usePosts(onUpdate);
  const { commentContent, setCommentContent, handleLike, handleComment, handleDeletePost, handleUpdatePost } = usePostActions(refetch);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const subscription = supabase
      .channel('posts_channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'posts'
      }, () => {
        refetch();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [refetch]);

  if (isLoading) return <div>Loading...</div>;
  if (!posts?.length) return <div>No posts found</div>;

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="bg-white shadow-sm overflow-hidden">
          <div className="flex flex-col">
            <PostHeader
              avatarUrl={post.profiles?.avatar_url}
              username={post.profiles?.username}
              createdAt={post.created_at}
              isOwner={post.user_id === session?.user?.id}
              onEdit={() => {
                setEditingPost(post.id);
                setEditContent(post.content);
              }}
              onDelete={() => handleDeletePost(post.id)}
            />
            <CardContent className="p-4 pt-0">
              {editingPost === post.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        handleUpdatePost(post.id, editContent);
                        setEditingPost(null);
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingPost(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm whitespace-pre-wrap mb-3">{post.content}</p>
                  {post.media_url && (
                    <PostMedia
                      mediaUrl={post.media_url}
                      mediaType={post.media_type}
                    />
                  )}
                </>
              )}
            </CardContent>
            <CardFooter className="flex flex-col p-4 pt-0 gap-4">
              <PostActions
                likesCount={post.likes?.length || 0}
                commentsCount={post.comments?.length || 0}
                isLiked={post.likes?.some(like => like.user_id === session?.user?.id)}
                onLike={() => handleLike(post.id)}
              />
              <CommentList
                comments={post.comments}
                commentContent={commentContent[post.id] || ''}
                onCommentChange={(content) => setCommentContent({
                  ...commentContent,
                  [post.id]: content
                })}
                onSubmitComment={() => handleComment(post.id)}
              />
            </CardFooter>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PostList;