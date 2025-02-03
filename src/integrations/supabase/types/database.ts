export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          created_at: string;
          points: number | null;
          practice_time: number | null;
          avatar_url: string | null;
          daily_practice_time: number | null;
          daily_points: number | null;
          last_practice_date: string | null;
          is_admin: boolean | null;
        };
        Insert: {
          id: string;
          username: string;
          created_at?: string;
          points?: number | null;
          practice_time?: number | null;
          avatar_url?: string | null;
          daily_practice_time?: number | null;
          daily_points?: number | null;
          last_practice_date?: string | null;
          is_admin?: boolean | null;
        };
        Update: {
          id?: string;
          username?: string;
          created_at?: string;
          points?: number | null;
          practice_time?: number | null;
          avatar_url?: string | null;
          daily_practice_time?: number | null;
          daily_points?: number | null;
          last_practice_date?: string | null;
          is_admin?: boolean | null;
        };
      };
      messages: {
        Row: {
          id: string;
          content: string;
          created_at: string;
          user_id: string;
          username: string;
          is_ai?: boolean;
        };
        Insert: {
          id?: string;
          content: string;
          created_at?: string;
          user_id: string;
          username: string;
          is_ai?: boolean;
        };
        Update: {
          id?: string;
          content?: string;
          created_at?: string;
          user_id?: string;
          username?: string;
          is_ai?: boolean;
        };
      };
      chord_sprinter_results: {
        Row: {
          id: string;
          user_id: string;
          chord_pair: string;
          reps: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          chord_pair: string;
          reps: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          chord_pair?: string;
          reps?: number;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];