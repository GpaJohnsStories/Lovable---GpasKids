
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hlywucxwpzbqmzssmwpj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhseXd1Y3h3cHpicW16c3Ntd3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MTQwNTMsImV4cCI6MjA2NDQ5MDA1M30.m72-z_MYxyijIqclV9hJplTNen02IdLLCOv7w3ZoHfY";

// Validate configuration
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error('🚨 Missing Supabase configuration!');
  console.error('URL:', SUPABASE_URL ? '✅ Present' : '❌ Missing');
  console.error('Key:', SUPABASE_PUBLISHABLE_KEY ? '✅ Present' : '❌ Missing');
}

// Log configuration for debugging (safely)
console.log('🔧 Supabase Configuration (v5 - DEBUG MODE):');
console.log('URL:', SUPABASE_URL);
console.log('Key full:', SUPABASE_PUBLISHABLE_KEY);
console.log('Key prefix:', SUPABASE_PUBLISHABLE_KEY?.substring(0, 20) + '...');
console.log('Key suffix:', '...' + SUPABASE_PUBLISHABLE_KEY?.substring(SUPABASE_PUBLISHABLE_KEY.length - 20));

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
        'X-Client-Info': 'gpa-stories-frontend-debug'
      }
    },
    db: {
      schema: 'public'
    }
  }
);

// Enhanced connection test with more detailed logging
const testConnection = async () => {
  try {
    console.log('🔗 Testing Supabase connection on client initialization...');
    console.time('supabase-connection-test');
    
    const { data, error, count } = await supabase
      .from('stories')
      .select('id', { count: 'exact', head: true })
      .limit(1);
    
    console.timeEnd('supabase-connection-test');
    
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
      console.log('📊 Stories count:', count);
    }
    
    // Test author_bios table specifically
    console.log('🔗 Testing author_bios table...');
    const { data: biosData, error: biosError } = await supabase
      .from('author_bios')
      .select('id', { count: 'exact', head: true })
      .limit(1);
    
    if (biosError) {
      console.error('🚨 Author bios table test failed:', biosError);
    } else {
      console.log('✅ Author bios table accessible');
      console.log('📊 Author bios count:', biosData);
    }
    
  } catch (err) {
    console.error('🚨 Supabase connection test error:', err);
    console.error('🚨 Error stack:', (err as Error)?.stack);
  }
};

// Run connection test with error handling
testConnection().catch(err => {
  console.error('🚨 Failed to run connection test:', err);
});
