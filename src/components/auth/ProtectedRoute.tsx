import { useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate('/auth');
    }
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;