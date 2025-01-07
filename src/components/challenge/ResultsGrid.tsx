import { SprintResult } from './types';

interface ResultsGridProps {
  previousResults: SprintResult[];
  todayResults: SprintResult[];
}

const ResultsGrid = ({ previousResults, todayResults }: ResultsGridProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <h3 className="font-medium text-[#11245A] mb-2 text-center">Chord Transitions</h3>
        {previousResults.map((result, index) => (
          <div key={`chord-${index}`} className="flex items-center justify-center border-b pb-2 mb-2">
            <span className="font-medium text-[#11245A]">{result.chord_pair}</span>
          </div>
        ))}
        {previousResults.length === 0 && (
          <div className="text-gray-500 text-sm text-center">
            No transitions recorded
          </div>
        )}
      </div>
      <div>
        <h3 className="font-medium text-[#11245A] mb-2 text-center">Personal Record</h3>
        {previousResults.map((result, index) => (
          <div key={`before-${index}`} className="flex justify-center items-center border-b pb-2 mb-2">
            <div className="font-semibold text-[#11245A]">
              {result.reps}
            </div>
          </div>
        ))}
        {previousResults.length === 0 && (
          <div className="text-gray-500 text-sm text-center">
            No records yet
          </div>
        )}
      </div>
      <div>
        <h3 className="font-medium text-[#11245A] mb-2 text-center">Today</h3>
        {previousResults.map((result, index) => (
          <div key={`today-${index}`} className="flex justify-center items-center border-b pb-2 mb-2">
            <div className="font-semibold text-[#11245A]">
              {todayResults.find(today => today.chord_pair === result.chord_pair)?.reps || '-'}
            </div>
          </div>
        ))}
        {previousResults.length === 0 && (
          <div className="text-gray-500 text-sm text-center">
            No results today
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsGrid;