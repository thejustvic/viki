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
      posts: {
        Row: {
          by: string
          created_at: string
          id: string
          text: string
        }
        Insert: {
          by: string
          created_at?: string
          id?: string
          text: string
        }
        Update: {
          by?: string
          created_at?: string
          id?: string
          text?: string
        }
      }
      users: {
        Row: {
          email: string | null
          id: string
          theme: string
        }
        Insert: {
          email?: string | null
          id: string
          theme?: string
        }
        Update: {
          email?: string | null
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
