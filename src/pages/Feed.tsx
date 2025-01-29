import { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import CreatePost from '@/components/feed/CreatePost';
import PostList from '@/components/feed/PostList';
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const Feed = () => {
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const session = useSession();
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  // Use React Query for profile fetching with better defaults
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
    staleTime: 1000 * 60 * 5, // Cache profile for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep unused data for 10 minutes
    retry: 2,
    retryDelay: 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Force an immediate render of the layout
  useEffect(() => {
    document.body.style.backgroundColor = '#F5E6DB';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const handlePostCreated = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        {profileLoading ? (
          <div className="space-y-4 animate-pulse">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        ) : (
          <>
            <CreatePost onPostCreated={handlePostCreated} />
            <div className="mt-8">
              <PostList onUpdate={updateTrigger} />
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default Feed;