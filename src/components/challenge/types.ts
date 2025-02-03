export interface SprintResult {
  id: string;
  user_id: string;
  chord_pair: string;
  reps: number;
  created_at: string;
}

export type ChordPair = 'Am-C' | 'Em-G' | 'Dm-G' | 'Am-F' | 'C-G' | 'Em-Am';