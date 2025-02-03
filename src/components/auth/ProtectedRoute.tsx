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

  useEffect(() => {
    const checkSession = async () => {
      if (!session) {
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
    return null; // or a loading spinner
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;