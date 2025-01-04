export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      messages: MessagesTable;
      profiles: ProfilesTable;
      posts: PostsTable;
      likes: LikesTable;
      comments: CommentsTable;
    };
    Views: {};
    Functions: DatabaseFunctions;
    Enums: {};
    CompositeTypes: {};
  };
}

interface MessagesTable {
  Row: {
    content: string;
    created_at: string;
    id: string;
    user_id: string;
    username: string;
  };
  Insert: {
    content: string;
    created_at?: string;
    id?: string;
    user_id: string;
    username: string;
  };
  Update: {
    content?: string;
    created_at?: string;
    id?: string;
    user_id?: string;
    username?: string;
  };
  Relationships: [];
}

interface ProfilesTable {
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
  };
  Relationships: [];
}

interface PostsTable {
  Row: {
    id: string;
    content: string;
    media_url: string | null;
    media_type: 'image' | 'video' | null;
    video_duration: number | null;
    user_id: string;
    created_at: string;
  };
  Insert: {
    id?: string;
    content: string;
    media_url?: string | null;
    media_type?: 'image' | 'video' | null;
    video_duration?: number | null;
    user_id: string;
    created_at?: string;
  };
  Update: {
    id?: string;
    content?: string;
    media_url?: string | null;
    media_type?: 'image' | 'video' | null;
    video_duration?: number | null;
    user_id?: string;
    created_at?: string;
  };
  Relationships: [];
}

interface LikesTable {
  Row: {
    id: string;
    post_id: string;
    user_id: string;
    created_at: string;
  };
  Insert: {
    id?: string;
    post_id: string;
    user_id: string;
    created_at?: string;
  };
  Update: {
    id?: string;
    post_id?: string;
    user_id?: string;
    created_at?: string;
  };
  Relationships: [];
}

interface CommentsTable {
  Row: {
    id: string;
    content: string;
    post_id: string;
    user_id: string;
    created_at: string;
  };
  Insert: {
    id?: string;
    content: string;
    post_id: string;
    user_id: string;
    created_at?: string;
  };
  Update: {
    id?: string;
    content?: string;
    post_id?: string;
    user_id?: string;
    created_at?: string;
  };
  Relationships: [];
}

interface DatabaseFunctions {
  reset_daily_stats: {
    Args: Record<PropertyKey, never>;
    Returns: undefined;
  };
}