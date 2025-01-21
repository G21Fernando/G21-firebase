import { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Header from '@/components/Header';
import CreatePost from '@/components/feed/CreatePost';
import PostList from '@/components/feed/PostList';
import { useToast } from "@/components/ui/use-toast";

const Feed = () => {
  const [profile, setProfile] = useState<any>(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const session = useSession();
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user?.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error fetching profile",
          description: "Your profile information couldn't be loaded, but you can still view posts",
          variant: "destructive",
        });
        return; // Don't set profile if there's an error, but don't logout
      }
      
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error fetching profile",
        description: "Your profile information couldn't be loaded, but you can still view posts",
        variant: "destructive",
      });
    }
  };

  const handlePostCreated = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5E6DB' }}>
      <Header 
        profile={profile}
        onProfileUpdate={fetchProfile}
      />
      <div className="max-w-2xl mx-auto px-4 pt-4 pb-8">
        <CreatePost onPostCreated={handlePostCreated} />
        <div className="mt-8">
          <PostList onUpdate={updateTrigger} />
        </div>
      </div>
    </div>
  );
};

export default Feed;