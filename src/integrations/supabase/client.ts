import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hlywucxwpzbqmzssmwpj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhseXd1Y3h3cHpicW16c3Ntd3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MTQwNTMsImV4cCI6MjA2NDQ5MDA1M30.m72-z_MYkyijIqclV9hJplTNen02IdLLCOv7w3ZoHfY";

// Validate configuration
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error('🚨 Missing Supabase configuration!');
  console.error('URL:', SUPABASE_URL ? '✅ Present' : '❌ Missing');
  console.error('Key:', SUPABASE_PUBLISHABLE_KEY ? '✅ Present' : '❌ Missing');
}

// Log configuration for debugging (safely)
console.log('🔧 Supabase Configuration:');
console.log('URL:', SUPABASE_URL);
console.log('Key prefix:', SUPABASE_PUBLISHABLE_KEY?.substring(0, 20) + '...');

// Single unified Supabase client instance with enhanced configuration
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'X-Client-Info': 'gpa-stories-frontend'
      }
    }
  }
);

// Test connection immediately on load
const testConnection = async () => {
  try {
    console.log('🔗 Testing Supabase connection on client initialization...');
    const { data, error } = await supabase
      .from('stories')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.error('🚨 Supabase connection test failed:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
    } else {
      console.log('✅ Supabase connection test successful');
    }
  } catch (err) {
    console.error('🚨 Supabase connection test error:', err);
  }
};

// Run connection test
testConnection();