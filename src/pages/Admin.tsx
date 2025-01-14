import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChordsManager from '@/components/admin/ChordsManager';
import BackingTracksManager from '@/components/admin/BackingTracksManager';
import StrummingPatternsManager from '@/components/admin/StrummingPatternsManager';

const Admin = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!session?.user?.id) {
        navigate('/auth');
        return;
      }

      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', session.user.id)
        .single();

      if (!adminUser) {
        navigate('/roadmap');
      }
    };

    checkAdminAccess();
  }, [session, navigate]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <Tabs defaultValue="chords" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="chords">Chords</TabsTrigger>
          <TabsTrigger value="backing-tracks">Backing Tracks</TabsTrigger>
          <TabsTrigger value="strumming">Strumming 21</TabsTrigger>
        </TabsList>
        <TabsContent value="chords">
          <ChordsManager />
        </TabsContent>
        <TabsContent value="backing-tracks">
          <BackingTracksManager />
        </TabsContent>
        <TabsContent value="strumming">
          <StrummingPatternsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;