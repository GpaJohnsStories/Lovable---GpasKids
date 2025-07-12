export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
      author_bios: {
        Row: {
          author_name: string
          bio_content: string | null
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          author_name: string
          bio_content?: string | null
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          author_name?: string
          bio_content?: string | null
          created_at?: string
          id?: string
          updated_at?: string
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
      database_operations_audit: {
        Row: {
          client_type: string | null
          created_at: string
          id: string
          ip_address: unknown | null
          operation_details: Json | null
          operation_type: string
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          client_type?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          operation_details?: Json | null
          operation_type: string
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          client_type?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          operation_details?: Json | null
          operation_type?: string
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      deployed_content: {
        Row: {
          audio_url: string | null
          author: string | null
          content: string | null
          created_at: string
          deployed_at: string
          id: string
          is_active: boolean
          photo_url: string | null
          story_code: string
          title: string | null
          updated_at: string
        }
        Insert: {
          audio_url?: string | null
          author?: string | null
          content?: string | null
          created_at?: string
          deployed_at?: string
          id?: string
          is_active?: boolean
          photo_url?: string | null
          story_code: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          audio_url?: string | null
          author?: string | null
          content?: string | null
          created_at?: string
          deployed_at?: string
          id?: string
          is_active?: boolean
          photo_url?: string | null
          story_code?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          role: string
          updated_at: string
          webauthn_credentials: Json | null
          webauthn_enabled: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          role?: string
          updated_at?: string
          webauthn_credentials?: Json | null
          webauthn_enabled?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          role?: string
          updated_at?: string
          webauthn_credentials?: Json | null
          webauthn_enabled?: boolean | null
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
      used_personal_ids: {
        Row: {
          created_at: string
          id: string
          personal_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          personal_id: string
        }
        Update: {
          created_at?: string
          id?: string
          personal_id?: string
        }
        Relationships: []
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
      armor: {
        Args: { "": string }
        Returns: string
      }
      dearmor: {
        Args: { "": string }
        Returns: string
      }
      emergency_admin_reset: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      emergency_promote_admin: {
        Args: { user_email: string }
        Returns: string
      }
      gen_random_bytes: {
        Args: { "": number }
        Returns: string
      }
      gen_random_uuid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      gen_salt: {
        Args: { "": string }
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
      is_trusted_client: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_database_operation: {
        Args: {
          p_operation_type: string
          p_table_name: string
          p_record_id?: string
          p_client_type?: string
          p_operation_details?: Json
        }
        Returns: undefined
      }
      pgp_armor_headers: {
        Args: { "": string }
        Returns: Record<string, unknown>[]
      }
      pgp_key_id: {
        Args: { "": string }
        Returns: string
      }
      promote_user_to_admin: {
        Args: { user_email: string }
        Returns: string
      }
      simple_promote_to_admin: {
        Args: { user_email: string }
        Returns: string
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
        | "STORY"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      comment_status: ["pending", "approved", "rejected", "archived"],
      story_category: [
        "Fun",
        "Life",
        "North Pole",
        "World Changers",
        "System",
        "STORY",
      ],
    },
  },
} as const
