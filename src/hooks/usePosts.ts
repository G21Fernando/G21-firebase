import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface Post {
  id: string;
  content: string;
  created_at: string;
  media_url: string | null;
  media_type: 'image' | 'video' | null;
  video_duration: number | null;
  user_id: string;
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

export const usePosts = (onUpdate: number) => {
  const { toast } = useToast();

  return useQuery({
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

      if (error) {
        toast({
          title: "Error fetching posts",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      return data as Post[];
    },
  });
};