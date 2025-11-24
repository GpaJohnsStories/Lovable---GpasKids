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
          site: Database["public"]["Enums"]["site_identifier"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value: string
          site?: Database["public"]["Enums"]["site_identifier"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: string
          site?: Database["public"]["Enums"]["site_identifier"]
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
          site: Database["public"]["Enums"]["site_identifier"]
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
          site?: Database["public"]["Enums"]["site_identifier"]
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
          site?: Database["public"]["Enums"]["site_identifier"]
          updated_at?: string
        }
        Relationships: []
      }
      color_presets: {
        Row: {
          background_color_hex: string | null
          background_color_name: string | null
          box_border_color_hex: string | null
          box_border_color_name: string | null
          created_at: string
          font_color_hex: string | null
          font_color_name: string | null
          font_name: string | null
          id: string
          name: string
          pages: string | null
          photo_border_color_hex: string | null
          photo_border_color_name: string | null
          site: Database["public"]["Enums"]["site_identifier"]
          updated_at: string
        }
        Insert: {
          background_color_hex?: string | null
          background_color_name?: string | null
          box_border_color_hex?: string | null
          box_border_color_name?: string | null
          created_at?: string
          font_color_hex?: string | null
          font_color_name?: string | null
          font_name?: string | null
          id: string
          name: string
          pages?: string | null
          photo_border_color_hex?: string | null
          photo_border_color_name?: string | null
          site?: Database["public"]["Enums"]["site_identifier"]
          updated_at?: string
        }
        Update: {
          background_color_hex?: string | null
          background_color_name?: string | null
          box_border_color_hex?: string | null
          box_border_color_name?: string | null
          created_at?: string
          font_color_hex?: string | null
          font_color_name?: string | null
          font_name?: string | null
          id?: string
          name?: string
          pages?: string | null
          photo_border_color_hex?: string | null
          photo_border_color_name?: string | null
          site?: Database["public"]["Enums"]["site_identifier"]
          updated_at?: string
        }
        Relationships: []
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
      faith_index: {
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
          color_preset_id: string | null
          content: string | null
          copyright_status: string | null
          created_at: string
          died_date: string | null
          excerpt: string | null
          id: string
          native_country: string | null
          native_language: string | null
          ok_count: number
          page_path: string | null
          photo_alt_1: string | null
          photo_alt_2: string | null
          photo_alt_3: string | null
          photo_alt_4: string | null
          photo_link_1: string | null
          photo_link_2: string | null
          photo_link_3: string | null
          photo_link_4: string | null
          print_count: number | null
          publication_status_code: number
          read_count: number
          reading_time_minutes: number | null
          site: Database["public"]["Enums"]["site_identifier"]
          story_code: string
          tagline: string | null
          thumbs_down_count: number
          thumbs_up_count: number
          title: string
          updated_at: string
          video_duration_seconds: number | null
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
          color_preset_id?: string | null
          content?: string | null
          copyright_status?: string | null
          created_at?: string
          died_date?: string | null
          excerpt?: string | null
          id?: string
          native_country?: string | null
          native_language?: string | null
          ok_count?: number
          page_path?: string | null
          photo_alt_1?: string | null
          photo_alt_2?: string | null
          photo_alt_3?: string | null
          photo_alt_4?: string | null
          photo_link_1?: string | null
          photo_link_2?: string | null
          photo_link_3?: string | null
          photo_link_4?: string | null
          print_count?: number | null
          publication_status_code?: number
          read_count?: number
          reading_time_minutes?: number | null
          site?: Database["public"]["Enums"]["site_identifier"]
          story_code: string
          tagline?: string | null
          thumbs_down_count?: number
          thumbs_up_count?: number
          title: string
          updated_at?: string
          video_duration_seconds?: number | null
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
          color_preset_id?: string | null
          content?: string | null
          copyright_status?: string | null
          created_at?: string
          died_date?: string | null
          excerpt?: string | null
          id?: string
          native_country?: string | null
          native_language?: string | null
          ok_count?: number
          page_path?: string | null
          photo_alt_1?: string | null
          photo_alt_2?: string | null
          photo_alt_3?: string | null
          photo_alt_4?: string | null
          photo_link_1?: string | null
          photo_link_2?: string | null
          photo_link_3?: string | null
          photo_link_4?: string | null
          print_count?: number | null
          publication_status_code?: number
          read_count?: number
          reading_time_minutes?: number | null
          site?: Database["public"]["Enums"]["site_identifier"]
          story_code?: string
          tagline?: string | null
          thumbs_down_count?: number
          thumbs_up_count?: number
          title?: string
          updated_at?: string
          video_duration_seconds?: number | null
          video_url?: string | null
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
      monthly_country_visits: {
        Row: {
          country_code: string
          country_name: string
          created_at: string
          last_visit_date: string
          month: number
          updated_at: string
          visit_count: number
          year: number
        }
        Insert: {
          country_code?: string
          country_name?: string
          created_at?: string
          last_visit_date?: string
          month: number
          updated_at?: string
          visit_count?: number
          year: number
        }
        Update: {
          country_code?: string
          country_name?: string
          created_at?: string
          last_visit_date?: string
          month?: number
          updated_at?: string
          visit_count?: number
          year?: number
        }
        Relationships: []
      }
      monthly_visits: {
        Row: {
          bot_visits_count: number
          created_at: string
          id: string
          month: number
          search_engine_visits_count: number
          site_identifier: Database["public"]["Enums"]["site_identifier"] | null
          updated_at: string
          visit_count: number
          year: number
        }
        Insert: {
          bot_visits_count?: number
          created_at?: string
          id?: string
          month: number
          search_engine_visits_count?: number
          site_identifier?:
            | Database["public"]["Enums"]["site_identifier"]
            | null
          updated_at?: string
          visit_count?: number
          year: number
        }
        Update: {
          bot_visits_count?: number
          created_at?: string
          id?: string
          month?: number
          search_engine_visits_count?: number
          site_identifier?:
            | Database["public"]["Enums"]["site_identifier"]
            | null
          updated_at?: string
          visit_count?: number
          year?: number
        }
        Relationships: []
      }
      privileged_admins: {
        Row: {
          created_at: string
          email_domain: string | null
          email_hash: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_domain?: string | null
          email_hash?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_domain?: string | null
          email_hash?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          age_group: string | null
          amazon_choice: boolean | null
          category: string | null
          character_pick: string | null
          created_at: string | null
          date_posted: string | null
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          price: string | null
          product_url: string | null
          rating: string | null
          review_count: string | null
          site: string
          title: string
          updated_at: string | null
        }
        Insert: {
          age_group?: string | null
          amazon_choice?: boolean | null
          category?: string | null
          character_pick?: string | null
          created_at?: string | null
          date_posted?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          price?: string | null
          product_url?: string | null
          rating?: string | null
          review_count?: string | null
          site?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          age_group?: string | null
          amazon_choice?: boolean | null
          category?: string | null
          character_pick?: string | null
          created_at?: string | null
          date_posted?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          price?: string | null
          product_url?: string | null
          rating?: string | null
          review_count?: string | null
          site?: string
          title?: string
          updated_at?: string | null
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
          changed_by_email_domain: string | null
          changed_by_email_hash: string | null
          changed_by_user_id: string
          created_at: string
          id: string
          new_role: string
          old_role: string | null
          reason: string | null
          target_email_domain: string | null
          target_email_hash: string | null
          target_user_id: string
        }
        Insert: {
          changed_by_email_domain?: string | null
          changed_by_email_hash?: string | null
          changed_by_user_id: string
          created_at?: string
          id?: string
          new_role: string
          old_role?: string | null
          reason?: string | null
          target_email_domain?: string | null
          target_email_hash?: string | null
          target_user_id: string
        }
        Update: {
          changed_by_email_domain?: string | null
          changed_by_email_hash?: string | null
          changed_by_user_id?: string
          created_at?: string
          id?: string
          new_role?: string
          old_role?: string | null
          reason?: string | null
          target_email_domain?: string | null
          target_email_hash?: string | null
          target_user_id?: string
        }
        Relationships: []
      }
      special_days: {
        Row: {
          country: string | null
          created_at: string | null
          end_date: string
          id: string
          site: string
          start_date: string
          text_code: string
          title: string
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          end_date: string
          id?: string
          site: string
          start_date: string
          text_code: string
          title: string
        }
        Update: {
          country?: string | null
          created_at?: string | null
          end_date?: string
          id?: string
          site?: string
          start_date?: string
          text_code?: string
          title?: string
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
          color_preset_id: string | null
          content: string | null
          copyright_status: string | null
          created_at: string
          died_date: string | null
          excerpt: string | null
          id: string
          native_country: string | null
          native_language: string | null
          ok_count: number
          page_path: string | null
          photo_alt_1: string | null
          photo_alt_2: string | null
          photo_alt_3: string | null
          photo_alt_4: string | null
          photo_link_1: string | null
          photo_link_2: string | null
          photo_link_3: string | null
          photo_link_4: string | null
          print_count: number | null
          publication_status_code: number
          read_count: number
          reading_time_minutes: number | null
          site: Database["public"]["Enums"]["site_identifier"]
          story_code: string
          tagline: string | null
          thumbs_down_count: number
          thumbs_up_count: number
          title: string
          updated_at: string
          video_duration_seconds: number | null
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
          color_preset_id?: string | null
          content?: string | null
          copyright_status?: string | null
          created_at?: string
          died_date?: string | null
          excerpt?: string | null
          id?: string
          native_country?: string | null
          native_language?: string | null
          ok_count?: number
          page_path?: string | null
          photo_alt_1?: string | null
          photo_alt_2?: string | null
          photo_alt_3?: string | null
          photo_alt_4?: string | null
          photo_link_1?: string | null
          photo_link_2?: string | null
          photo_link_3?: string | null
          photo_link_4?: string | null
          print_count?: number | null
          publication_status_code?: number
          read_count?: number
          reading_time_minutes?: number | null
          site?: Database["public"]["Enums"]["site_identifier"]
          story_code: string
          tagline?: string | null
          thumbs_down_count?: number
          thumbs_up_count?: number
          title: string
          updated_at?: string
          video_duration_seconds?: number | null
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
          color_preset_id?: string | null
          content?: string | null
          copyright_status?: string | null
          created_at?: string
          died_date?: string | null
          excerpt?: string | null
          id?: string
          native_country?: string | null
          native_language?: string | null
          ok_count?: number
          page_path?: string | null
          photo_alt_1?: string | null
          photo_alt_2?: string | null
          photo_alt_3?: string | null
          photo_alt_4?: string | null
          photo_link_1?: string | null
          photo_link_2?: string | null
          photo_link_3?: string | null
          photo_link_4?: string | null
          print_count?: number | null
          publication_status_code?: number
          read_count?: number
          reading_time_minutes?: number | null
          site?: Database["public"]["Enums"]["site_identifier"]
          story_code?: string
          tagline?: string | null
          thumbs_down_count?: number
          thumbs_up_count?: number
          title?: string
          updated_at?: string
          video_duration_seconds?: number | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stories_color_preset_id_fkey"
            columns: ["color_preset_id"]
            isOneToOne: false
            referencedRelation: "color_presets"
            referencedColumns: ["id"]
          },
        ]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_privileged_admin_secure: {
        Args: { admin_email: string }
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
      debug_auth_context: { Args: never; Returns: Json }
      emergency_admin_reset: { Args: never; Returns: string }
      emergency_promote_admin: { Args: { user_email: string }; Returns: string }
      export_public_rls_policies_json: { Args: never; Returns: Json }
      export_public_schema_json: { Args: never; Returns: Json }
      get_all_buckets_metrics: {
        Args: never
        Returns: {
          bucket_name: string
          object_count: number
          total_size_bytes: number
          total_size_pretty: string
        }[]
      }
      get_allowed_admin_email_hashes: { Args: never; Returns: string[] }
      get_allowed_admin_email_hashes_secure: { Args: never; Returns: string[] }
      get_bucket_metrics: {
        Args: { bucket_name: string }
        Returns: {
          object_count: number
          total_size_bytes: number
          total_size_pretty: string
        }[]
      }
      get_database_size: {
        Args: never
        Returns: {
          size_bytes: number
          size_pretty: string
        }[]
      }
      get_icon_library_count: {
        Args: never
        Returns: {
          icon_count: number
        }[]
      }
      get_scheduled_backups: {
        Args: never
        Returns: {
          active: boolean
          command: string
          jobid: number
          jobname: string
          schedule: string
        }[]
      }
      get_storage_totals: {
        Args: never
        Returns: {
          total_objects: number
          total_size_bytes: number
          total_size_pretty: string
        }[]
      }
      has_admin_access: { Args: never; Returns: boolean }
      increment_story_read_count: {
        Args: { story_uuid: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      is_admin_safe: { Args: never; Returns: boolean }
      is_emergency_admin: { Args: never; Returns: boolean }
      is_privileged_admin: { Args: never; Returns: boolean }
      is_trusted_client: { Args: never; Returns: boolean }
      is_viewer: { Args: never; Returns: boolean }
      list_privileged_admins_masked: {
        Args: never
        Returns: {
          created_at: string
          email_domain: string
          email_hash_preview: string
          id: string
        }[]
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
      promote_user_to_admin: { Args: { user_email: string }; Returns: string }
      promote_user_to_viewer: { Args: { user_email: string }; Returns: string }
      remove_privileged_admin_secure: {
        Args: { admin_email: string }
        Returns: string
      }
      simple_promote_to_admin: { Args: { user_email: string }; Returns: string }
      validate_admin_context: { Args: never; Returns: boolean }
    }
    Enums: {
      site_identifier: "KIDS" | "FAITH" | "SHOP" | "ADMIN"
      story_category:
        | "Fun"
        | "Life"
        | "North Pole"
        | "World Changers"
        | "WebText"
        | "BioText"
        | "Admin"
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
      site_identifier: ["KIDS", "FAITH", "SHOP", "ADMIN"],
      story_category: [
        "Fun",
        "Life",
        "North Pole",
        "World Changers",
        "WebText",
        "BioText",
        "Admin",
      ],
    },
  },
} as const
