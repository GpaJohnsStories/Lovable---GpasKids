export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
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
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      author_bios: {
        Row: {
          author_name: string
          bio_audio_duration_seconds: number | null
          bio_audio_generated_at: string | null
          bio_audio_segments: number | null
          bio_audio_url: string | null
          bio_content: string | null
          born_date: string | null
          created_at: string
          died_date: string | null
          id: string
          native_country_name: string | null
          native_language: string | null
          photo_alt: string | null
          photo_url: string | null
          updated_at: string
        }
        Insert: {
          author_name: string
          bio_audio_duration_seconds?: number | null
          bio_audio_generated_at?: string | null
          bio_audio_segments?: number | null
          bio_audio_url?: string | null
          bio_content?: string | null
          born_date?: string | null
          created_at?: string
          died_date?: string | null
          id?: string
          native_country_name?: string | null
          native_language?: string | null
          photo_alt?: string | null
          photo_url?: string | null
          updated_at?: string
        }
        Update: {
          author_name?: string
          bio_audio_duration_seconds?: number | null
          bio_audio_generated_at?: string | null
          bio_audio_segments?: number | null
          bio_audio_url?: string | null
          bio_content?: string | null
          born_date?: string | null
          created_at?: string
          died_date?: string | null
          id?: string
          native_country_name?: string | null
          native_language?: string | null
          photo_alt?: string | null
          photo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          attachment_bucket: string | null
          attachment_caption: string | null
          attachment_mime: string | null
          attachment_path: string | null
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
          attachment_bucket?: string | null
          attachment_caption?: string | null
          attachment_mime?: string | null
          attachment_path?: string | null
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
          attachment_bucket?: string | null
          attachment_caption?: string | null
          attachment_mime?: string | null
          attachment_path?: string | null
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
          operation_details: Json | null
          operation_type: string
          record_id: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          client_type?: string | null
          created_at?: string
          id?: string
          operation_details?: Json | null
          operation_type: string
          record_id?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          client_type?: string | null
          created_at?: string
          id?: string
          operation_details?: Json | null
          operation_type?: string
          record_id?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      donations_monthly: {
        Row: {
          created_at: string
          donation_count: number
          id: string
          month: number
          total_amount: number
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          donation_count?: number
          id?: string
          month: number
          total_amount?: number
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          donation_count?: number
          id?: string
          month?: number
          total_amount?: number
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      friend_names: {
        Row: {
          created_at: string
          id: string
          nickname: string
          personal_id_hash: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          nickname: string
          personal_id_hash: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nickname?: string
          personal_id_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      icon_library: {
        Row: {
          created_at: string
          file_name_path: string
          icon_name: string
          label: string | null
          updated_at: string
          usage_locations: Json | null
        }
        Insert: {
          created_at?: string
          file_name_path: string
          icon_name: string
          label?: string | null
          updated_at?: string
          usage_locations?: Json | null
        }
        Update: {
          created_at?: string
          file_name_path?: string
          icon_name?: string
          label?: string | null
          updated_at?: string
          usage_locations?: Json | null
        }
        Relationships: []
      }
      monthly_visits: {
        Row: {
          admin_visits_count: number
          bot_visits_count: number
          created_at: string
          id: string
          month: number
          other_excluded_count: number
          search_engine_visits_count: number
          updated_at: string
          visit_count: number
          year: number
        }
        Insert: {
          admin_visits_count?: number
          bot_visits_count?: number
          created_at?: string
          id?: string
          month: number
          other_excluded_count?: number
          search_engine_visits_count?: number
          updated_at?: string
          visit_count?: number
          year: number
        }
        Update: {
          admin_visits_count?: number
          bot_visits_count?: number
          created_at?: string
          id?: string
          month?: number
          other_excluded_count?: number
          search_engine_visits_count?: number
          updated_at?: string
          visit_count?: number
          year?: number
        }
        Relationships: []
      }
      privileged_admins: {
        Row: {
          created_at: string
          email: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          role: string
          updated_at: string
          webauthn_credentials: Json | null
          webauthn_enabled: boolean | null
        }
        Insert: {
          created_at?: string
          id: string
          role?: string
          updated_at?: string
          webauthn_credentials?: Json | null
          webauthn_enabled?: boolean | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
          webauthn_credentials?: Json | null
          webauthn_enabled?: boolean | null
        }
        Relationships: []
      }
      role_change_audit: {
        Row: {
          changed_by_email: string
          changed_by_user_id: string
          created_at: string
          id: string
          new_role: string
          old_role: string | null
          reason: string | null
          target_email: string
          target_user_id: string
        }
        Insert: {
          changed_by_email: string
          changed_by_user_id: string
          created_at?: string
          id?: string
          new_role: string
          old_role?: string | null
          reason?: string | null
          target_email: string
          target_user_id: string
        }
        Update: {
          changed_by_email?: string
          changed_by_user_id?: string
          created_at?: string
          id?: string
          new_role?: string
          old_role?: string | null
          reason?: string | null
          target_email?: string
          target_user_id?: string
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
          bio_subject_name: string | null
          book_title: string | null
          born_date: string | null
          category: Database["public"]["Enums"]["story_category"]
          chapter_number: number | null
          chapter_title: string | null
          content: string | null
          copyright_status: string | null
          created_at: string
          died_date: string | null
          excerpt: string | null
          google_drive_link: string | null
          id: string
          native_country: string | null
          native_language: string | null
          ok_count: number
          photo_alt_1: string | null
          photo_alt_2: string | null
          photo_alt_3: string | null
          photo_link_1: string | null
          photo_link_2: string | null
          photo_link_3: string | null
          published: string
          read_count: number
          reading_time_minutes: number | null
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
          bio_subject_name?: string | null
          book_title?: string | null
          born_date?: string | null
          category: Database["public"]["Enums"]["story_category"]
          chapter_number?: number | null
          chapter_title?: string | null
          content?: string | null
          copyright_status?: string | null
          created_at?: string
          died_date?: string | null
          excerpt?: string | null
          google_drive_link?: string | null
          id?: string
          native_country?: string | null
          native_language?: string | null
          ok_count?: number
          photo_alt_1?: string | null
          photo_alt_2?: string | null
          photo_alt_3?: string | null
          photo_link_1?: string | null
          photo_link_2?: string | null
          photo_link_3?: string | null
          published?: string
          read_count?: number
          reading_time_minutes?: number | null
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
          bio_subject_name?: string | null
          book_title?: string | null
          born_date?: string | null
          category?: Database["public"]["Enums"]["story_category"]
          chapter_number?: number | null
          chapter_title?: string | null
          content?: string | null
          copyright_status?: string | null
          created_at?: string
          died_date?: string | null
          excerpt?: string | null
          google_drive_link?: string | null
          id?: string
          native_country?: string | null
          native_language?: string | null
          ok_count?: number
          photo_alt_1?: string | null
          photo_alt_2?: string | null
          photo_alt_3?: string | null
          photo_link_1?: string | null
          photo_link_2?: string | null
          photo_link_3?: string | null
          published?: string
          read_count?: number
          reading_time_minutes?: number | null
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
          read_at: string
          story_id: string
        }
        Insert: {
          id?: string
          read_at?: string
          story_id: string
        }
        Update: {
          id?: string
          read_at?: string
          story_id?: string
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
          story_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          story_id: string
          vote_type: string
        }
        Update: {
          created_at?: string
          id?: string
          story_id?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      armor: {
        Args: { "": string }
        Returns: string
      }
      calculate_reading_time: {
        Args: { content_text: string }
        Returns: number
      }
      change_user_role: {
        Args: { new_role: string; reason?: string; target_email: string }
        Returns: string
      }
      check_personal_id_exists: {
        Args: { p_personal_id: string }
        Returns: boolean
      }
      dearmor: {
        Args: { "": string }
        Returns: string
      }
      debug_auth_context: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      derive_nickname_key: {
        Args: { personal_id: string }
        Returns: string
      }
      derive_personal_id_hash: {
        Args: { personal_id: string }
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
      get_allowed_admin_emails: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_nickname_by_personal_id: {
        Args: { personal_id: string }
        Returns: string
      }
      get_nickname_pepper: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_or_create_nickname: {
        Args: { desired_nickname?: string; personal_id: string }
        Returns: string
      }
      get_public_approved_comment_by_id: {
        Args: { comment_id: string }
        Returns: {
          content: string
          created_at: string
          id: string
          parent_id: string
          subject: string
          updated_at: string
        }[]
      }
      get_public_approved_comments: {
        Args: Record<PropertyKey, never>
        Returns: {
          content: string
          created_at: string
          id: string
          parent_id: string
          subject: string
          updated_at: string
        }[]
      }
      get_public_orange_gang_photos: {
        Args: Record<PropertyKey, never>
        Returns: {
          attachment_caption: string
          attachment_path: string
          created_at: string
          display_name: string
          id: string
        }[]
      }
      has_admin_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
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
      is_privileged_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_trusted_client: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_viewer: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_admin_activity: {
        Args: {
          p_action: string
          p_new_values?: Json
          p_old_values?: Json
          p_record_id?: string
          p_table_name?: string
        }
        Returns: undefined
      }
      log_database_operation: {
        Args: {
          p_client_type?: string
          p_operation_details?: Json
          p_operation_type: string
          p_record_id?: string
          p_table_name: string
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
      promote_user_to_viewer: {
        Args: { user_email: string }
        Returns: string
      }
      simple_promote_to_admin: {
        Args: { user_email: string }
        Returns: string
      }
      update_nickname: {
        Args: { new_nickname: string; personal_id: string }
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
        | "WebText"
        | "BioText"
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
        "WebText",
        "BioText",
      ],
    },
  },
} as const
