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
      books: {
        Row: {
          id: string
          name: string
          chapters: number
          testament: 'old' | 'new'
          created_at: string
        }
        Insert: {
          id: string
          name: string
          chapters: number
          testament: 'old' | 'new'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          chapters?: number
          testament?: 'old' | 'new'
          created_at?: string
        }
      }
      chapters: {
        Row: {
          id: number
          book_id: string
          chapter_number: number
          created_at: string
        }
        Insert: {
          id?: number
          book_id: string
          chapter_number: number
          created_at?: string
        }
        Update: {
          id?: number
          book_id?: string
          chapter_number?: number
          created_at?: string
        }
      }
      verses: {
        Row: {
          id: number
          book_id: string
          chapter_number: number
          verse_number: number
          text: string
          created_at: string
        }
        Insert: {
          id?: number
          book_id: string
          chapter_number: number
          verse_number: number
          text: string
          created_at?: string
        }
        Update: {
          id?: number
          book_id?: string
          chapter_number?: number
          verse_number?: number
          text?: string
          created_at?: string
        }
      }
      user_progress: {
        Row: {
          id: number
          user_id: string
          book_id: string
          chapter_number: number
          verse_number: number
          completed_at: string
        }
        Insert: {
          id?: number
          user_id: string
          book_id: string
          chapter_number: number
          verse_number: number
          completed_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          book_id?: string
          chapter_number?: number
          verse_number?: number
          completed_at?: string
        }
      }
      user_interpretations: {
        Row: {
          id: number
          user_id: string
          book_id: string
          chapter_number: number
          verse_number: number
          interpretation: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          book_id: string
          chapter_number: number
          verse_number: number
          interpretation: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          book_id?: string
          chapter_number?: number
          verse_number?: number
          interpretation?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
