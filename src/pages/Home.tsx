import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Guitar Journey</h1>
        <p className="text-lg mb-8">Start your 21-day journey to guitar mastery</p>
        <Button onClick={() => navigate('/roadmap')}>
          View Roadmap
        </Button>
      </div>
    </div>
  );
};

export default Home;