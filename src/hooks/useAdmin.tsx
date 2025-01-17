import { useEffect, useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '@/integrations/supabase/types/database';

export type AdminRole = 'super_admin' | 'content_manager' | 'user_manager';

export const useAdmin = () => {
  const session = useSession();
  const supabase = useSupabaseClient<Database>();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!session?.user) {
        setIsAdmin(false);
        setAdminRole(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data: adminData, error } = await supabase
          .from('admin_users')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        setIsAdmin(!!adminData);
        setAdminRole(adminData?.role as AdminRole || null);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setAdminRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [session, supabase]);

  return { isAdmin, adminRole, isLoading };
};