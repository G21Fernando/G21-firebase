import { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Header from '@/components/Header';

const Feed = () => {
  const [profile, setProfile] = useState<any>(null);
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5E6DB' }}>
      <Header 
        profile={profile}
        onProfileUpdate={fetchProfile}
      />
      <div className="max-w-6xl mx-auto px-6 md:px-8 pt-24 md:pt-28 pb-8 md:pb-12">
        <h1 className="text-2xl font-bold mb-6">Feed</h1>
        {/* Feed content will be implemented in the next iteration */}
      </div>
    </div>
  );
};

export default Feed;