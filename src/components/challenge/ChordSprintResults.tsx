import { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';

interface SprintResult {
  chord_pair: string;
  reps: number;
  created_at: string;
}

const ChordSprintResults = () => {
  const [todayResults, setTodayResults] = useState<SprintResult[]>([]);
  const [previousResults, setPreviousResults] = useState<SprintResult[]>([]);
  const session = useSession();

  useEffect(() => {
    if (session?.user) {
      fetchResults();
    }
  }, [session]);

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

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-[#11245A] mb-4">Chord Changes per minute (CPM)</h2>
      <div className="space-y-4">
        {(todayResults.length > 0 || previousResults.length > 0) ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-[#11245A] mb-2">Before</h3>
              {previousResults.map((result, index) => (
                <div key={`before-${index}`} className="flex justify-between items-center border-b pb-2 mb-2">
                  <div>
                    <span className="font-medium text-[#11245A]">{result.chord_pair}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {new Date(result.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="font-semibold text-[#11245A]">
                    {result.reps}
                  </div>
                </div>
              ))}
              {previousResults.length === 0 && (
                <div className="text-gray-500 text-sm">
                  No previous results
                </div>
              )}
            </div>
            <div>
              <h3 className="font-medium text-[#11245A] mb-2">Today</h3>
              {todayResults.map((result, index) => (
                <div key={`today-${index}`} className="flex justify-between items-center border-b pb-2 mb-2">
                  <div>
                    <span className="font-medium text-[#11245A]">{result.chord_pair}</span>
                  </div>
                  <div className="font-semibold text-[#11245A]">
                    {result.reps}
                  </div>
                </div>
              ))}
              {todayResults.length === 0 && (
                <div className="text-gray-500 text-sm">
                  No results today
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No sprint results yet. Complete a chord sprint to see your results here!
          </div>
        )}
      </div>
    </div>
  );
};

export default ChordSprintResults;