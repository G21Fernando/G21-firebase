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
  themes: string[] | null;
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

export const usePosts = (onUpdate: number, selectedTheme: string | null) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['posts', onUpdate, selectedTheme],
    queryFn: async () => {
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles (
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
            profiles (
              username,
              avatar_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (selectedTheme) {
        query = query.contains('themes', [selectedTheme]);
      }

      const { data, error } = await query;

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