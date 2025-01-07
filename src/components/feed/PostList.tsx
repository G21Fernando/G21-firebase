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
import ThemeFilter from './ThemeFilter';

const PostList = ({ onUpdate }: { onUpdate: number }) => {
  const session = useSession();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const { data: posts, isLoading, refetch } = usePosts(onUpdate, selectedTheme);
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
    <div className="space-y-3">
      <ThemeFilter onThemeSelect={setSelectedTheme} selectedTheme={selectedTheme} />
      {posts.map((post) => {
        const avatarUrl = post.profiles?.avatar_url
          ? supabase.storage.from('avatars').getPublicUrl(post.profiles.avatar_url).data.publicUrl
          : null;

        return (
          <Card key={post.id} className="bg-white shadow-sm overflow-hidden">
            <div className="flex flex-col">
              <PostHeader
                avatarUrl={avatarUrl}
                username={post.profiles?.username}
                createdAt={post.created_at}
                isOwner={post.user_id === session?.user?.id}
                onEdit={() => {
                  setEditingPost(post.id);
                  setEditContent(post.content);
                }}
                onDelete={() => handleDeletePost(post.id)}
              />
              <CardContent className="p-2">
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
                    <p className="text-sm whitespace-pre-wrap mb-2">{post.content}</p>
                    {post.themes && post.themes.length > 0 && (
                      <div className="flex gap-1 flex-wrap mb-2">
                        {post.themes.map((theme) => (
                          <span key={theme} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            #{theme}
                          </span>
                        ))}
                      </div>
                    )}
                    {post.media_url && (
                      <PostMedia
                        mediaUrl={post.media_url}
                        mediaType={post.media_type}
                      />
                    )}
                  </>
                )}
              </CardContent>
              <CardFooter className="flex flex-col p-2 gap-2">
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
        );
      })}
    </div>
  );
};

export default PostList;