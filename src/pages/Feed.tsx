import { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Header from '@/components/Header';
import CreatePost from '@/components/feed/CreatePost';
import PostList from '@/components/feed/PostList';

const Feed = () => {
  const [profile, setProfile] = useState<any>(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const session = useSession();
  const supabase = useSupabaseClient();

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
      
      if (error) throw error;
      
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
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
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-8">
        <CreatePost onPostCreated={handlePostCreated} />
        <div className="mt-8">
          <PostList onUpdate={updateTrigger} />
        </div>
      </div>
    </div>
  );
};

export default Feed;