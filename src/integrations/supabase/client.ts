import { createClient } from '@supabase/supabase-js';
import { adminClient } from "@/integrations/supabase/clients";
import type { Database } from './types';

const SUPABASE_URL = "https://hlywucxwpzbqmzssmwpj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhseXd1Y3h3cHpicW16c3Ntd3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MTQwNTMsImV4cCI6MjA2NDQ5MDA1M30.m72-z_MYkyijIqclV9hJplTNen02IdLLCOv7w3ZoHfY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = adminClient;