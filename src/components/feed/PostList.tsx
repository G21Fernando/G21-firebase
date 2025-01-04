import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from '@supabase/auth-helpers-react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import PostHeader from './PostHeader';
import PostMedia from './PostMedia';
import PostActions from './PostActions';
import CommentList from './CommentList';

interface Post {
  id: string;
  content: string;
  created_at: string;
  media_url: string | null;
  media_type: 'image' | 'video' | null;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
  likes: { user_id: string }[];
  comments: {
    id: string;
    content: string;
    created_at: string;
    profiles: {
      username: string;
      avatar_url: string | null;
    };
  }[];
}

const PostList = ({ onUpdate }: { onUpdate: number }) => {
  const [commentContent, setCommentContent] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();
  const session = useSession();

  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ['posts', onUpdate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          ),
          likes (
            user_id
          ),
          comments (
            id,
            content,
            created_at,
            profiles:user_id (
              username,
              avatar_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleLike = async (postId: string) => {
    if (!session?.user?.id) return;
    
    try {
      const { data: existingLike } = await supabase
        .from('likes')
        .select()
        .eq('post_id', postId)
        .eq('user_id', session.user.id)
        .single();

      if (existingLike) {
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', session.user.id);
      } else {
        await supabase
          .from('likes')
          .insert({ 
            post_id: postId,
            user_id: session.user.id
          });
      }

      toast({
        title: "Success",
        description: existingLike ? "Post unliked!" : "Post liked!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleComment = async (postId: string) => {
    if (!session?.user?.id) return;
    
    try {
      const content = commentContent[postId];
      if (!content?.trim()) return;

      await supabase
        .from('comments')
        .insert({ 
          post_id: postId,
          user_id: session.user.id,
          content 
        });

      setCommentContent({ ...commentContent, [postId]: '' });
      toast({
        title: "Success",
        description: "Comment added!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {posts?.map((post) => (
        <Card key={post.id}>
          <PostHeader
            avatarUrl={post.profiles?.avatar_url}
            username={post.profiles?.username}
            createdAt={post.created_at}
          />
          <CardContent>
            <p className="whitespace-pre-wrap">{post.content}</p>
            {post.media_url && (
              <PostMedia
                mediaUrl={post.media_url}
                mediaType={post.media_type}
              />
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
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
        </Card>
      ))}
    </div>
  );
};

export default PostList;