import { useInfiniteQuery } from '@tanstack/react-query';
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
    city: string | null;
  };
  likes: { user_id: string }[];
  comments_count: number;
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
}

const POSTS_PER_PAGE = 5;
const COMMENTS_PER_PAGE = 10;

export const usePosts = (onUpdate: number, selectedTheme: string | null) => {
  const { toast } = useToast();

  return useInfiniteQuery({
    queryKey: ['posts', onUpdate, selectedTheme],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      let query = supabase
        .from('posts')
        .select(`
          id,
          content,
          created_at,
          media_url,
          media_type,
          video_duration,
          user_id,
          themes,
          profiles!inner (
            username,
            avatar_url,
            city
          ),
          likes (
            user_id
          ),
          comments:comments(count)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (selectedTheme) {
        query = query.contains('themes', [selectedTheme]);
      }

      const { data, error, count } = await query;

      if (error) {
        toast({
          title: "Error fetching posts",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      const postsWithFormattedData = data.map(post => ({
        ...post,
        comments_count: post.comments[0]?.count || 0
      }));

      return {
        posts: postsWithFormattedData as Post[],
        nextPage: (from + POSTS_PER_PAGE) < (count || 0) ? pageParam + 1 : undefined,
        totalCount: count
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
};

export const useComments = (postId: string) => {
  const { toast } = useToast();

  return useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * COMMENTS_PER_PAGE;
      const to = from + COMMENTS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles (
            username,
            avatar_url
          )
        `, { count: 'exact' })
        .eq('post_id', postId)
        .order('created_at', { ascending: true })
        .range(from, to);

      if (error) {
        toast({
          title: "Error fetching comments",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      return {
        comments: data as Comment[],
        nextPage: (from + COMMENTS_PER_PAGE) < (count || 0) ? pageParam + 1 : undefined,
        totalCount: count
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: 1000 * 30, // Cache comments for 30 seconds
    gcTime: 1000 * 60 * 5, // Keep unused comments in cache for 5 minutes
    refetchOnWindowFocus: true, // Enable refetch when window regains focus
    refetchOnReconnect: true, // Enable refetch on reconnection
    refetchOnMount: true, // Enable refetch on component mount
  });
};
