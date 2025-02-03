import { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useChallenge } from '@/hooks/useChallenge';

const ChordSprinter = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { startChallenge, isActive } = useChallenge();
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate('/auth');
    }
  }, [session, navigate]);

  const handleStart = async () => {
    setIsStarted(true);
    await startChallenge();
  };

  if (!session) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Chord Sprinter Challenge</h1>
        <p className="text-gray-600 mb-6">
          Practice transitioning between chords as quickly and accurately as possible.
          Track your progress and compete with others!
        </p>
        {!isStarted ? (
          <Button 
            onClick={handleStart}
            disabled={isActive}
            className="w-full"
          >
            Start Challenge
          </Button>
        ) : (
          <div className="text-center">
            <p>Challenge in progress...</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ChordSprinter;