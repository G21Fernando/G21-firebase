import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useSession } from '@supabase/auth-helpers-react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import PostHeader from './PostHeader';
import PostMedia from './PostMedia';
import PostActions from './PostActions';
import CommentList from './CommentList';
import { usePosts, useComments } from '@/hooks/usePosts';
import { usePostActions } from '@/hooks/usePostActions';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import ThemeFilter from './ThemeFilter';
import { Loader2 } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

const PostSkeleton = () => (
  <Card className="w-full">
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
      <Skeleton className="h-24 w-full" />
      <div className="flex space-x-4">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  </Card>
);

const PostList = ({ onUpdate }: { onUpdate: number }) => {
  const session = useSession();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    refetch 
  } = usePosts(onUpdate, selectedTheme);
  
  const { commentContent, setCommentContent, handleLike, handleComment, handleDeletePost, handleUpdatePost } = usePostActions(refetch);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [expandedComments, setExpandedComments] = useState<string[]>([]);

  const observer = useRef<IntersectionObserver>();
  const lastPostRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]);

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

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  return (
    <div className="space-y-4">
      <ThemeFilter
        selectedTheme={selectedTheme}
        onThemeSelect={setSelectedTheme}
      />
      
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-4 p-4">
          {isLoading ? (
            <div className="space-y-4">
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </div>
          ) : (
            <>
              {data?.pages.map((page, pageIndex) => (
                <div key={pageIndex} className="space-y-4">
                  {page.posts.map((post, postIndex) => {
                    const isLastPost = pageIndex === data.pages.length - 1 && postIndex === page.posts.length - 1;
                    const isExpanded = expandedComments.includes(post.id);
                    const currentCommentContent = commentContent[post.id] || '';
                    
                    return (
                      <div
                        key={post.id}
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
                              setEditingPost(post.id);
                              setEditContent(post.content);
                            }}
                            onDelete={() => handleDeletePost(post.id)}
                          />
                          
                          <CardContent className="p-4">
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
                              onLike={() => handleLike(post.id)}
                              onToggleComments={() => toggleComments(post.id)}
                            />
                            
                            {isExpanded && (
                              <CommentList
                                postId={post.id}
                                commentContent={currentCommentContent}
                                onCommentChange={(content: string) => 
                                  setCommentContent(prev => ({ ...prev, [post.id]: content }))
                                }
                                onSubmitComment={() => handleComment(post.id)}
                              />
                            )}
                          </CardFooter>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              ))}
              
              {isFetchingNextPage && (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PostList;