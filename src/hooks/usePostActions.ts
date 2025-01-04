import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from '@supabase/auth-helpers-react';

export const usePostActions = (refetch: () => void) => {
  const [commentContent, setCommentContent] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();
  const session = useSession();

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

      await refetch();
      
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

      await refetch();
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

  const handleDeletePost = async (postId: string) => {
    if (!session?.user?.id) return;
    
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      await refetch();
      
      toast({
        title: "Success",
        description: "Post deleted successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleUpdatePost = async (postId: string, content: string) => {
    if (!session?.user?.id) return;
    
    try {
      const { error } = await supabase
        .from('posts')
        .update({ content })
        .eq('id', postId);

      if (error) throw error;

      await refetch();
      
      toast({
        title: "Success",
        description: "Post updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return {
    commentContent,
    setCommentContent,
    handleLike,
    handleComment,
    handleDeletePost,
    handleUpdatePost
  };
};
