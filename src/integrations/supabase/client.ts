
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { devLog, isDevelopment } from '@/utils/devLog';

const SUPABASE_URL = "https://hlywucxwpzbqmzssmwpj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhseXd1Y3h3cHpicW16c3Ntd3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MTQwNTMsImV4cCI6MjA2NDQ5MDA1M30.m72-z_MYxyijIqclV9hJplTNen02IdLLCOv7w3ZoHfY";

// Validate configuration
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  devLog.critical('🚨 Missing Supabase configuration!');
  devLog.critical('URL:', SUPABASE_URL ? '✅ Present' : '❌ Missing');
  devLog.critical('Key:', SUPABASE_PUBLISHABLE_KEY ? '✅ Present' : '❌ Missing');
}

// Log configuration for debugging (dev-only, masked in production)
if (isDevelopment) {
  devLog.info('🔧 Supabase Configuration:');
  devLog.info('URL:', SUPABASE_URL);
  devLog.info('Key prefix:', SUPABASE_PUBLISHABLE_KEY?.substring(0, 20) + '...');
  devLog.info('Key suffix:', '...' + SUPABASE_PUBLISHABLE_KEY?.substring(SUPABASE_PUBLISHABLE_KEY.length - 20));
}

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
    },
    db: {
      schema: 'public'
    }
  }
);

// Connection test (dev-only)
const testConnection = async () => {
  if (!isDevelopment) return;
  
  try {
    devLog.info('🔗 Testing Supabase connection...');
    devLog.time('supabase-connection-test');
    
    const { error, count } = await supabase
      .from('stories')
      .select('id', { count: 'exact', head: true })
      .limit(1);
    
    devLog.timeEnd('supabase-connection-test');
    
    if (error) {
      devLog.error('🚨 Supabase connection test failed:', error.message);
    } else {
      devLog.info('✅ Supabase connection test successful - Stories count:', count);
    }
    
  } catch (err) {
    devLog.error('🚨 Supabase connection test error:', (err as Error)?.message);
  }
};

// Run connection test only in development
if (isDevelopment) {
  testConnection().catch(err => {
    devLog.error('🚨 Failed to run connection test:', err?.message);
  });
}
