export interface SprintResult {
  chord_pair: string;
  reps: number;
  created_at: string;
}

export type ChordPair = 'Am-C' | 'Em-G' | 'Dm-G' | 'Am-F' | 'C-G' | 'Em-Am';