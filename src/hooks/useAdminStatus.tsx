import { useState, useEffect } from 'react';
import { Session } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAdminStatus = (session: Session | null) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!session?.user) {
        console.log('No session found, user is not admin');
        setIsAdmin(false);
        return;
      }

      try {
        console.log('Checking admin status for user:', session.user.id);
        
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error checking admin status:', error);
          toast({
            title: "Error checking admin status",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        
        const adminStatus = !!data;
        console.log('Admin check result:', { data, adminStatus });
        setIsAdmin(adminStatus);
        
        if (adminStatus) {
          console.log('User is confirmed as admin');
          toast({
            title: "Admin access confirmed",
            description: "You have admin privileges",
          });
        } else {
          console.log('User is not an admin');
        }
      } catch (error) {
        console.error('Unexpected error checking admin status:', error);
        toast({
          title: "Error checking admin status",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    };

    checkAdminStatus();
  }, [session, toast]);

  return isAdmin;
};