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
      admin_audit: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          parent_id: string | null
          personal_id: string
          status: Database["public"]["Enums"]["comment_status"]
          subject: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          parent_id?: string | null
          personal_id: string
          status?: Database["public"]["Enums"]["comment_status"]
          subject: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          parent_id?: string | null
          personal_id?: string
          status?: Database["public"]["Enums"]["comment_status"]
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          ai_voice_model: string | null
          ai_voice_name: string | null
          audio_duration_seconds: number | null
          audio_generated_at: string | null
          audio_segments: number | null
          audio_url: string | null
          author: string
          category: Database["public"]["Enums"]["story_category"]
          content: string | null
          created_at: string
          excerpt: string | null
          google_drive_link: string | null
          id: string
          ok_count: number
          photo_alt_1: string | null
          photo_alt_2: string | null
          photo_alt_3: string | null
          photo_link_1: string | null
          photo_link_2: string | null
          photo_link_3: string | null
          published: string
          read_count: number
          story_code: string
          tagline: string | null
          thumbs_down_count: number
          thumbs_up_count: number
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          ai_voice_model?: string | null
          ai_voice_name?: string | null
          audio_duration_seconds?: number | null
          audio_generated_at?: string | null
          audio_segments?: number | null
          audio_url?: string | null
          author: string
          category: Database["public"]["Enums"]["story_category"]
          content?: string | null
          created_at?: string
          excerpt?: string | null
          google_drive_link?: string | null
          id?: string
          ok_count?: number
          photo_alt_1?: string | null
          photo_alt_2?: string | null
          photo_alt_3?: string | null
          photo_link_1?: string | null
          photo_link_2?: string | null
          photo_link_3?: string | null
          published?: string
          read_count?: number
          story_code: string
          tagline?: string | null
          thumbs_down_count?: number
          thumbs_up_count?: number
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          ai_voice_model?: string | null
          ai_voice_name?: string | null
          audio_duration_seconds?: number | null
          audio_generated_at?: string | null
          audio_segments?: number | null
          audio_url?: string | null
          author?: string
          category?: Database["public"]["Enums"]["story_category"]
          content?: string | null
          created_at?: string
          excerpt?: string | null
          google_drive_link?: string | null
          id?: string
          ok_count?: number
          photo_alt_1?: string | null
          photo_alt_2?: string | null
          photo_alt_3?: string | null
          photo_link_1?: string | null
          photo_link_2?: string | null
          photo_link_3?: string | null
          published?: string
          read_count?: number
          story_code?: string
          tagline?: string | null
          thumbs_down_count?: number
          thumbs_up_count?: number
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      story_reads: {
        Row: {
          id: string
          ip_address: unknown | null
          read_at: string
          story_id: string
          user_agent: string | null
        }
        Insert: {
          id?: string
          ip_address?: unknown | null
          read_at?: string
          story_id: string
          user_agent?: string | null
        }
        Update: {
          id?: string
          ip_address?: unknown | null
          read_at?: string
          story_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "story_reads_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      story_votes: {
        Row: {
          created_at: string
          id: string
          ip_address: unknown | null
          story_id: string
          user_agent: string | null
          vote_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          story_id: string
          user_agent?: string | null
          vote_type: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          story_id?: string
          user_agent?: string | null
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_votes_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      visitor_countries: {
        Row: {
          country_code: string
          country_name: string
          created_at: string
          id: string
          last_visit: string
          updated_at: string
          visit_count: number
        }
        Insert: {
          country_code: string
          country_name: string
          created_at?: string
          id?: string
          last_visit?: string
          updated_at?: string
          visit_count?: number
        }
        Update: {
          country_code?: string
          country_name?: string
          created_at?: string
          id?: string
          last_visit?: string
          updated_at?: string
          visit_count?: number
        }
        Relationships: []
      }
      visitor_sessions: {
        Row: {
          country_code: string
          created_at: string
          id: string
          ip_hash: string
          visit_date: string
        }
        Insert: {
          country_code: string
          created_at?: string
          id?: string
          ip_hash: string
          visit_date?: string
        }
        Update: {
          country_code?: string
          created_at?: string
          id?: string
          ip_hash?: string
          visit_date?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      emergency_admin_reset: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      emergency_promote_admin: {
        Args: { user_email: string }
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_safe: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_emergency_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      comment_status: "pending" | "approved" | "rejected" | "archived"
      story_category:
        | "Fun"
        | "Life"
        | "North Pole"
        | "World Changers"
        | "System"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      comment_status: ["pending", "approved", "rejected", "archived"],
      story_category: ["Fun", "Life", "North Pole", "World Changers", "System"],
    },
  },
} as const
