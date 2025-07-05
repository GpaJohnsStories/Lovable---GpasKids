// Separate Supabase clients for different access patterns
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hlywucxwpzbqmzssmwpj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhseXd1Y3h3cHpicW16c3Ntd3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MTQwNTMsImV4cCI6MjA2NDQ5MDA1M30.m72-z_MYxyijIqclV9hJplTNen02IdLLCOv7w3ZoHfY";

// Public client - for comment submission and viewing approved comments only
export const publicClient = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: false, // No session needed for public operations
  },
  db: {
    schema: 'public'
  }
});

// Admin client - for admin operations (will use authenticated sessions)
export const adminClient = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public'
  }
});

// Legacy client for backward compatibility - will be phased out
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Client factory to get appropriate client based on operation type
export function getSupabaseClient(operation: 'public' | 'admin' = 'public') {
  switch (operation) {
    case 'public':
      return publicClient;
    case 'admin':
      return adminClient;
    default:
      return publicClient;
  }
}

// Audit logging helper
export async function logDatabaseOperation(
  operation: string, 
  table: string, 
  clientType: 'public' | 'admin',
  details?: any
) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    operation,
    table,
    client_type: clientType,
    details: details || {},
    user_agent: navigator?.userAgent || 'unknown'
  };
  
  console.log('🔐 Database Operation:', logEntry);
  
  // Store in session storage for debugging
  if (typeof window !== 'undefined') {
    const logs = JSON.parse(sessionStorage.getItem('db_audit_logs') || '[]');
    logs.push(logEntry);
    // Keep only last 50 logs
    if (logs.length > 50) logs.shift();
    sessionStorage.setItem('db_audit_logs', JSON.stringify(logs));
  }
}
