import { useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import CreatePost from '@/components/feed/CreatePost';
import PostListContainer from '@/components/feed/PostListContainer';
import LiveFeed from '@/components/feed/LiveFeed';
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const Feed = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error fetching profile",
          description: "Your profile information couldn't be loaded, but you can still view posts",
          variant: "destructive",
        });
        return null;
      }
      
      return data;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    document.body.style.backgroundColor = '#F5E6DB';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <main className="flex-1 container mx-auto px-4 py-6 max-w-5xl">
      {profileLoading ? (
        <div className="space-y-4 animate-pulse">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <CreatePost onPostCreated={() => {}} />
            <PostListContainer />
          </div>
          <div className="md:col-span-1">
            <LiveFeed />
          </div>
        </div>
      )}
    </main>
  );
};

export default Feed;