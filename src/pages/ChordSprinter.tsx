import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import ChallengeMain from '@/components/challenge/ChallengeMain';
import { useChallenge } from '@/hooks/useChallenge';

const ChordSprinter = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { 
    timeLeft, 
    isActive, 
    isPaused,
    chordChanges,
    startChallenge,
    stopChallenge
  } = useChallenge();

  useEffect(() => {
    if (!session) {
      navigate('/auth');
    }
  }, [session, navigate]);

  if (!session) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <ChallengeMain 
        isActive={isActive}
        timeLeft={timeLeft}
        chordChanges={chordChanges}
        onStart={startChallenge}
        onStop={stopChallenge}
        isPaused={isPaused}
      />
    </div>
  );
};

export default ChordSprinter;