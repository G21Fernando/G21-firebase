import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Heart, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from '@supabase/auth-helpers-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const PostList = ({ onUpdate }: { onUpdate: number }) => {
  const [commentContent, setCommentContent] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();
  const session = useSession();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts', onUpdate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (username, avatar_url),
          likes (user_id),
          comments (
            id,
            content,
            created_at,
            profiles:user_id (username, avatar_url)
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
          <CardHeader className="flex flex-row items-center gap-4">
            <img
              src={post.profiles?.avatar_url || '/placeholder.svg'}
              alt={post.profiles?.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold">{post.profiles?.username}</h3>
              <p className="text-sm text-gray-500">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{post.content}</p>
            {post.media_url && (
              <div className="mt-4">
                {post.media_type === 'video' ? (
                  <video
                    src={`${supabase.storage.from('media').getPublicUrl(post.media_url).data.publicUrl}`}
                    controls
                    className="w-full rounded-lg"
                  />
                ) : (
                  <img
                    src={`${supabase.storage.from('media').getPublicUrl(post.media_url).data.publicUrl}`}
                    alt="Post media"
                    className="w-full rounded-lg"
                  />
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="flex gap-4 w-full">
              <Button
                variant="ghost"
                size="sm"
                className="flex gap-2"
                onClick={() => handleLike(post.id)}
              >
                <Heart className={`h-4 w-4 ${post.likes?.some(like => like.user_id === session?.user?.id) ? 'fill-red-500 text-red-500' : ''}`} />
                {post.likes?.length || 0}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                {post.comments?.length || 0}
              </Button>
            </div>
            <div className="w-full space-y-4">
              {post.comments?.map((comment: any) => (
                <div key={comment.id} className="flex items-start gap-2">
                  <img
                    src={comment.profiles?.avatar_url || '/placeholder.svg'}
                    alt={comment.profiles?.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1 bg-gray-50 rounded-lg p-2">
                    <p className="font-semibold text-sm">{comment.profiles?.username}</p>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Write a comment..."
                  value={commentContent[post.id] || ''}
                  onChange={(e) => setCommentContent({
                    ...commentContent,
                    [post.id]: e.target.value
                  })}
                  className="flex-1"
                />
                <Button onClick={() => handleComment(post.id)}>
                  Comment
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PostList;