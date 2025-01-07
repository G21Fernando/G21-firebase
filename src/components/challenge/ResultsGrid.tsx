import { SprintResult } from './types';

interface ResultsGridProps {
  previousResults: SprintResult[];
  todayResults: SprintResult[];
}

const ResultsGrid = ({ previousResults, todayResults }: ResultsGridProps) => {
  // Combine and deduplicate chord pairs from both today and previous results
  const allChordPairs = Array.from(new Set([
    ...todayResults.map(r => r.chord_pair),
    ...previousResults.map(r => r.chord_pair)
  ]));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
      <div className="bg-gray-50 rounded-lg p-3">
        <h3 className="font-medium text-[#11245A] mb-3 text-center">Chord Transitions</h3>
        {allChordPairs.map((chordPair, index) => (
          <div key={`chord-${index}`} className="flex items-center justify-center border-b border-gray-200 pb-2 mb-2 last:border-b-0 last:mb-0 last:pb-0">
            <span className="font-medium text-[#11245A]">{chordPair}</span>
          </div>
        ))}
        {allChordPairs.length === 0 && (
          <div className="text-gray-500 text-sm text-center">
            No transitions recorded
          </div>
        )}
      </div>
      <div className="bg-gray-50 rounded-lg p-3">
        <h3 className="font-medium text-[#11245A] mb-3 text-center">Personal Record</h3>
        {allChordPairs.map((chordPair, index) => {
          const bestResult = previousResults
            .filter(r => r.chord_pair === chordPair)
            .reduce((max, current) => current.reps > max.reps ? current : max, { reps: 0 });
          
          return (
            <div key={`before-${index}`} className="flex justify-center items-center border-b border-gray-200 pb-2 mb-2 last:border-b-0 last:mb-0 last:pb-0">
              <div className="font-semibold text-[#11245A]">
                {bestResult.reps || '-'}
              </div>
            </div>
          );
        })}
        {allChordPairs.length === 0 && (
          <div className="text-gray-500 text-sm text-center">
            No records yet
          </div>
        )}
      </div>
      <div className="bg-gray-50 rounded-lg p-3">
        <h3 className="font-medium text-[#11245A] mb-3 text-center">Today</h3>
        {allChordPairs.map((chordPair, index) => {
          const todayResult = todayResults.find(r => r.chord_pair === chordPair);
          
          return (
            <div key={`today-${index}`} className="flex justify-center items-center border-b border-gray-200 pb-2 mb-2 last:border-b-0 last:mb-0 last:pb-0">
              <div className="font-semibold text-[#11245A]">
                {todayResult?.reps || '-'}
              </div>
            </div>
          );
        })}
        {allChordPairs.length === 0 && (
          <div className="text-gray-500 text-sm text-center">
            No results today
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsGrid;