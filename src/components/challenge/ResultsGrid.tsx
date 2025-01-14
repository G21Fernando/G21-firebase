import { SprintResult } from './types';

interface ResultsGridProps {
  previousResults: SprintResult[];
  todayResults: SprintResult[];
}

const ResultsGrid = ({ previousResults, todayResults }: ResultsGridProps) => {
  // Get the most recent chord pair from today's results
  const latestResult = todayResults[0];
  
  // Combine and deduplicate chord pairs from both today and previous results
  const allChordPairs = Array.from(new Set([
    ...(latestResult ? [latestResult.chord_pair] : []), // Add latest first if it exists
    ...todayResults.slice(1).map(r => r.chord_pair), // Rest of today's results
    ...previousResults.map(r => r.chord_pair)
  ]));

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left py-3 px-4 font-medium text-[#11245A] flex items-center gap-2">
              <img 
                src="/lovable-uploads/cd55a8c4-bddf-4d76-89ea-e87f0bac8a60.png" 
                alt="Lightning Icon" 
                className="w-5 h-5"
              />
            </th>
            <th className="text-center py-3 px-4 font-medium text-[#11245A]">Personal Record</th>
            <th className="text-center py-3 px-4 font-medium text-[#11245A]">Today</th>
          </tr>
        </thead>
        <tbody>
          {allChordPairs.map((chordPair, index) => {
            const bestResult = previousResults
              .filter(r => r.chord_pair === chordPair)
              .reduce((max, current) => current.reps > max.reps ? current : max, { reps: 0 });
            const todayResult = todayResults.find(r => r.chord_pair === chordPair);
            
            // Add a highlight class for the latest result
            const isLatestResult = latestResult && chordPair === latestResult.chord_pair;
            
            return (
              <tr 
                key={`row-${index}`} 
                className={`border-t border-gray-100 ${isLatestResult ? 'bg-blue-50' : ''}`}
              >
                <td className="py-3 px-4 font-medium text-[#11245A]">
                  {chordPair}
                  {isLatestResult && (
                    <span className="ml-2 text-xs text-blue-600 font-normal">
                      Latest
                    </span>
                  )}
                </td>
                <td className="text-center py-3 px-4 font-semibold text-[#11245A]">
                  {bestResult.reps || '-'}
                </td>
                <td className="text-center py-3 px-4 font-semibold text-[#11245A]">
                  {todayResult?.reps || '-'}
                </td>
              </tr>
            );
          })}
          {allChordPairs.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center py-4 text-gray-500">
                No transitions recorded
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsGrid;