export type Json =
  | string
  | number
  | boolean
  | null
  | {[key: string]: Json}
  | Json[]

export interface Database {
  public: {
    Tables: {
      chat: {
        Row: {
          author_email: string
          author_image: string
          created_at: string
          id: string
          text: string
        }
        Insert: {
          author_email: string
          author_image: string
          created_at?: string
          id?: string
          text: string
        }
        Update: {
          author_email?: string
          author_image?: string
          created_at?: string
          id?: string
          text?: string
        }
      }
      posts: {
        Row: {
          created_at: string
          id: string
          text: string
          user_id?: string
          email?: string
        }
        Insert: {
          created_at?: string
          id?: string
          text: string
          user_id: string
          email: string
        }
        Update: {
          created_at?: string
          id?: string
          text?: string
          user_id?: string
          email?: string
        }
      }
      profiles: {
        Row: {
          username: string
          updated_at: string
          fullname: string
          email: string
          avatar_url: string | null
          id: string
          theme: string
        }
        Insert: {
          username?: string
          updated_at?: string
          fullname: string
          email: string
          avatar_url?: string | null
          id: string
          theme?: string
        }
        Update: {
          username?: string
          updated_at?: string
          fullname?: string
          email?: string
          avatar_url?: string | null
          id?: string
          theme?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
