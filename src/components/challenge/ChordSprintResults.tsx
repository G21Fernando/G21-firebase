import { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';

interface SprintResult {
  chord_pair: string;
  reps: number;
  created_at: string;
}

const ChordSprintResults = () => {
  const [results, setResults] = useState<SprintResult[]>([]);
  const session = useSession();

  useEffect(() => {
    if (session?.user) {
      fetchResults();
    }
  }, [session]);

  const fetchResults = async () => {
    const { data, error } = await supabase
      .from('chord_sprinter_results')
      .select('*')
      .eq('user_id', session?.user?.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!error && data) {
      setResults(data);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-[#11245A] mb-4">Chord Changes per minute (CPM)</h2>
      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={index} className="flex justify-between items-center border-b pb-2">
            <div>
              <span className="font-medium text-[#11245A]">{result.chord_pair}</span>
              <span className="text-sm text-gray-500 ml-2">
                {new Date(result.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="font-semibold text-[#11245A]">
              {result.reps} changes
            </div>
          </div>
        ))}
        {results.length === 0 && (
          <div className="text-center text-gray-500">
            No sprint results yet. Complete a chord sprint to see your results here!
          </div>
        )}
      </div>
    </div>
  );
};

export default ChordSprintResults;