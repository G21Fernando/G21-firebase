import { useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import CreatePost from '@/components/feed/CreatePost';
import PostListContainer from '@/components/feed/PostListContainer';
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-5xl">
        {profileLoading ? (
          <div className="space-y-4 animate-pulse">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        ) : (
          <>
            <CreatePost onPostCreated={() => {}} />
            <div className="mt-6">
              <PostListContainer />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Feed;