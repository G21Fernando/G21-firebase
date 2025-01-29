import { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import ResultsHeader from './ResultsHeader';
import ResultsGrid from './ResultsGrid';
import type { SprintResult } from './types';

const ChordSprintResults = () => {
  const [todayResults, setTodayResults] = useState<SprintResult[]>([]);
  const [previousResults, setPreviousResults] = useState<SprintResult[]>([]);
  const session = useSession();

  const fetchResults = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('chord_sprinter_results')
      .select('*')
      .eq('user_id', session?.user?.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      const todayData = data.filter(result => {
        const resultDate = new Date(result.created_at);
        resultDate.setHours(0, 0, 0, 0);
        return resultDate.getTime() === today.getTime();
      });

      const previousData = data.filter(result => {
        const resultDate = new Date(result.created_at);
        resultDate.setHours(0, 0, 0, 0);
        return resultDate.getTime() < today.getTime();
      });

      setTodayResults(todayData);
      setPreviousResults(previousData.slice(0, 5));
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchResults();

      // Subscribe to realtime updates
      const channel = supabase
        .channel('chord-sprinter-results')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chord_sprinter_results',
            filter: `user_id=eq.${session.user.id}`
          },
          () => {
            // Refresh results when new data is inserted
            fetchResults();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-3 md:p-4 mx-auto max-w-[95%] md:max-w-[800px] h-[70vh]">
      <ResultsHeader title="TPM (transitions per minute)" />
      <div className="mt-4">
        {(todayResults.length > 0 || previousResults.length > 0) ? (
          <ResultsGrid 
            previousResults={previousResults}
            todayResults={todayResults}
          />
        ) : (
          <div className="text-center text-gray-500 px-4">
            No sprint results yet. Complete a chord sprint to see your results here!
          </div>
        )}
      </div>
    </div>
  );
};

export default ChordSprintResults;