import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseConnection } from '@/hooks/useSupabaseConnection';

const AdminDiagnostics = () => {
  const { isConnected, isLoading, error, testConnection } = useSupabaseConnection();
  const [diagnosticResults, setDiagnosticResults] = useState<Record<string, any>>({});

  const runDiagnostics = async () => {
    console.log('🔍 Running comprehensive diagnostics...');
    const results: Record<string, any> = {};

    try {
      // Test 1: Basic connection
      results.connection = await testConnection();

      // Test 2: Auth session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      results.session = {
        hasSession: !!session,
        userEmail: session?.user?.email,
        error: sessionError?.message
      };

      // Test 3: RPC function test
      if (session) {
        const { data: isAdmin, error: rpcError } = await supabase.rpc('is_admin_safe');
        results.adminRpc = {
          result: isAdmin,
          error: rpcError?.message
        };
      }

      // Test 4: Direct profiles query
      if (session) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        results.profileQuery = {
          role: profile?.role,
          error: profileError?.message
        };
      }

      // Test 5: Stories query (the one that's failing)
      const { data: stories, error: storiesError } = await supabase
        .from('stories')
        .select('count(*)')
        .limit(1);
      
      results.storiesQuery = {
        success: !storiesError,
        error: storiesError?.message
      };

      console.log('🔍 Diagnostic results:', results);
      setDiagnosticResults(results);
    } catch (err) {
      console.error('🔍 Diagnostics failed:', err);
      results.error = err instanceof Error ? err.message : 'Unknown error';
      setDiagnosticResults(results);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Admin Access Diagnostics</h2>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>Database Connection: {isConnected ? 'Connected' : 'Failed'}</span>
        </div>
        
        {error && (
          <div className="text-red-600 text-sm">
            Connection Error: {error}
          </div>
        )}
        
        <button
          onClick={runDiagnostics}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={isLoading}
        >
          Run Full Diagnostics
        </button>
        
        {Object.keys(diagnosticResults).length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Diagnostic Results:</h3>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
              {JSON.stringify(diagnosticResults, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDiagnostics;