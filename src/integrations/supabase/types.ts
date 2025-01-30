export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["admin_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          event_data: Json
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data: Json
          event_type: Database["public"]["Enums"]["event_type"]
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      backing_tracks: {
        Row: {
          created_at: string
          description: string | null
          file_url: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_url: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_url?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      chord_diagrams: {
        Row: {
          chord: Database["public"]["Enums"]["chord_name"]
          created_at: string
          id: string
          image_url: string
        }
        Insert: {
          chord: Database["public"]["Enums"]["chord_name"]
          created_at?: string
          id?: string
          image_url: string
        }
        Update: {
          chord?: Database["public"]["Enums"]["chord_name"]
          created_at?: string
          id?: string
          image_url?: string
        }
        Relationships: []
      }
      chord_positions: {
        Row: {
          chord_name: Database["public"]["Enums"]["chord_name"]
          created_at: string
          fret_position: number | null
          id: string
          string_number: Database["public"]["Enums"]["guitar_string"]
          string_state: Database["public"]["Enums"]["string_state"]
        }
        Insert: {
          chord_name: Database["public"]["Enums"]["chord_name"]
          created_at?: string
          fret_position?: number | null
          id?: string
          string_number: Database["public"]["Enums"]["guitar_string"]
          string_state?: Database["public"]["Enums"]["string_state"]
        }
        Update: {
          chord_name?: Database["public"]["Enums"]["chord_name"]
          created_at?: string
          fret_position?: number | null
          id?: string
          string_number?: Database["public"]["Enums"]["guitar_string"]
          string_state?: Database["public"]["Enums"]["string_state"]
        }
        Relationships: []
      }
      chord_sprinter_results: {
        Row: {
          chord_pair: Database["public"]["Enums"]["chord_pair"]
          created_at: string
          id: string
          reps: number
          user_id: string
        }
        Insert: {
          chord_pair: Database["public"]["Enums"]["chord_pair"]
          created_at?: string
          id?: string
          reps: number
          user_id: string
        }
        Update: {
          chord_pair?: Database["public"]["Enums"]["chord_pair"]
          created_at?: string
          id?: string
          reps?: number
          user_id?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      development_activities: {
        Row: {
          activity_type: string
          created_at: string
          description: string | null
          id: string
          time_spent: number
        }
        Insert: {
          activity_type: string
          created_at?: string
          description?: string | null
          id?: string
          time_spent: number
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string | null
          id?: string
          time_spent?: number
        }
        Relationships: []
      }
      exercises: {
        Row: {
          id: string
          level: number
          name: string
          order_in_level: number
        }
        Insert: {
          id?: string
          level: number
          name: string
          order_in_level: number
        }
        Update: {
          id?: string
          level?: number
          name?: string
          order_in_level?: number
        }
        Relationships: []
      }
      github_integrations: {
        Row: {
          access_token: string
          created_at: string
          id: string
          repository_url: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          id?: string
          repository_url: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          id?: string
          repository_url?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      github_repositories: {
        Row: {
          created_at: string
          description: string | null
          github_repo_id: string
          id: string
          repository_name: string
          repository_url: string
          status: Database["public"]["Enums"]["repository_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          github_repo_id: string
          id?: string
          repository_name: string
          repository_url: string
          status?: Database["public"]["Enums"]["repository_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          github_repo_id?: string
          id?: string
          repository_name?: string
          repository_url?: string
          status?: Database["public"]["Enums"]["repository_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          user_id: string
          username: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          user_id: string
          username: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          content: string
          created_at: string
          id: string
          media_type: string | null
          media_url: string | null
          themes: string[] | null
          user_id: string
          video_duration: number | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          media_type?: string | null
          media_url?: string | null
          themes?: string[] | null
          user_id: string
          video_duration?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          media_type?: string | null
          media_url?: string | null
          themes?: string[] | null
          user_id?: string
          video_duration?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          acquisition_type: string | null
          avatar_url: string | null
          city: string | null
          created_at: string
          daily_points: number | null
          daily_practice_time: number | null
          id: string
          is_admin: boolean | null
          last_practice_date: string | null
          points: number | null
          practice_time: number | null
          subscription_status: string | null
          username: string
        }
        Insert: {
          acquisition_type?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          daily_points?: number | null
          daily_practice_time?: number | null
          id: string
          is_admin?: boolean | null
          last_practice_date?: string | null
          points?: number | null
          practice_time?: number | null
          subscription_status?: string | null
          username: string
        }
        Update: {
          acquisition_type?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          daily_points?: number | null
          daily_practice_time?: number | null
          id?: string
          is_admin?: boolean | null
          last_practice_date?: string | null
          points?: number | null
          practice_time?: number | null
          subscription_status?: string | null
          username?: string
        }
        Relationships: []
      }
      strumming_patterns: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          pattern: Database["public"]["Enums"]["strum_direction"][]
          tempo: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          pattern: Database["public"]["Enums"]["strum_direction"][]
          tempo: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          pattern?: Database["public"]["Enums"]["strum_direction"][]
          tempo?: number
        }
        Relationships: []
      }
      user_exercises: {
        Row: {
          created_at: string | null
          exercise_id: string | null
          id: string
          pr: number | null
          rpm: number | null
          status: Database["public"]["Enums"]["exercise_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          exercise_id?: string | null
          id?: string
          pr?: number | null
          rpm?: number | null
          status?: Database["public"]["Enums"]["exercise_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          exercise_id?: string | null
          id?: string
          pr?: number | null
          rpm?: number | null
          status?: Database["public"]["Enums"]["exercise_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress_snapshots: {
        Row: {
          active_days: number | null
          average_chord_transitions: number | null
          completed_exercises: number | null
          created_at: string
          id: string
          total_practice_time: number | null
          user_id: string | null
          week_start: string
        }
        Insert: {
          active_days?: number | null
          average_chord_transitions?: number | null
          completed_exercises?: number | null
          created_at?: string
          id?: string
          total_practice_time?: number | null
          user_id?: string | null
          week_start: string
        }
        Update: {
          active_days?: number | null
          average_chord_transitions?: number | null
          completed_exercises?: number | null
          created_at?: string
          id?: string
          total_practice_time?: number | null
          user_id?: string | null
          week_start?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          features_used: Json | null
          id: string
          practice_duration: number | null
          session_end: string | null
          session_start: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          features_used?: Json | null
          id?: string
          practice_duration?: number | null
          session_end?: string | null
          session_start?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          features_used?: Json | null
          id?: string
          practice_duration?: number | null
          session_end?: string | null
          session_start?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_weekly_progress_snapshot: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reset_daily_stats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      admin_role: "super_admin" | "content_manager" | "user_manager"
      chord_name: "A" | "Am" | "C" | "D" | "Dm" | "E" | "Em" | "F" | "G"
      chord_pair: "Am-C" | "Em-G" | "Dm-G" | "Am-F" | "C-G" | "Em-Am"
      event_type: "feature_interaction" | "user_milestone"
      exercise_status: "not_started" | "in_progress" | "completed"
      guitar_string: "1" | "2" | "3" | "4" | "5" | "6"
      repository_status: "active" | "disconnected"
      string_state: "muted" | "open" | "fretted"
      strum_direction: "up" | "down" | "muted"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
