import { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  console.log('ProtectedRoute rendering...');
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);

  console.log('Protected Route - Session:', session ? 'Present' : 'Not present');

  useEffect(() => {
    const checkSession = async () => {
      console.log('Checking session...');
      if (!session) {
        console.log('No session found, redirecting to auth...');
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
  }, [session, navigate, toast]);

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