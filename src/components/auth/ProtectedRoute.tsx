import { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      console.log('Checking session state:', {
        session: session ? 'Present' : 'Not present',
        isChecking,
        hasRedirected
      });

      if (!session && !hasRedirected) {
        console.log('No session found, redirecting to auth...');
        setHasRedirected(true);
        toast({
          title: "Authentication required",
          description: "Please log in to access this page",
          variant: "destructive",
        });
        navigate('/auth');
      }
      setIsChecking(false);
    };

    checkSession();
  }, [session, navigate, toast, hasRedirected]);

  if (isChecking) {
    console.log('Still checking session...');
    return null;
  }

  if (!session) {
    console.log('No session after check, returning null');
    return null;
  }

  console.log('Session valid, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;