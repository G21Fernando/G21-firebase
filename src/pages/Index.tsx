import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { Spinner } from '@/components/ui/spinner';

const Index = () => {
  const { isAdmin, isLoading } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/roadmap');
      }
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return null;
};

export default Index;