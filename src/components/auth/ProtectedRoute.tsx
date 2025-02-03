import { useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!session && !location.state?.fromAuth) {
      toast({
        title: "Authentication required",
        description: "Please log in to access this page",
        variant: "destructive",
      });
      navigate('/auth');
    }
  }, [session, navigate, toast, location.state]);

  if (!session) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;