import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSupabaseConnection } from '@/hooks/useSupabaseConnection';
import { supabase } from '@/integrations/supabase/client';

interface DiagnosticResult {
  test: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  details?: any;
}

const AdminDiagnostics = () => {
  const { isConnected, isLoading, error, lastChecked } = useSupabaseConnection();
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results: DiagnosticResult[] = [];

    // Test 1: Basic Connection
    results.push({ test: 'Basic Connection', status: 'pending', message: 'Testing...' });
    setDiagnosticResults([...results]);

    try {
      const { data: connectionTest, error: connectionError } = await supabase
        .from('stories')
        .select('id', { count: 'exact', head: true })
        .limit(1);

      if (connectionError) {
        results[0] = { 
          test: 'Basic Connection', 
          status: 'error', 
          message: connectionError.message,
          details: connectionError
        };
      } else {
        results[0] = { 
          test: 'Basic Connection', 
          status: 'success', 
          message: 'Connection successful' 
        };
      }
    } catch (err) {
      results[0] = { 
        test: 'Basic Connection', 
        status: 'error', 
        message: `Connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
        details: err
      };
    }

    // Test 2: Authentication Session
    results.push({ test: 'Authentication Session', status: 'pending', message: 'Testing...' });
    setDiagnosticResults([...results]);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        results[1] = { 
          test: 'Authentication Session', 
          status: 'error', 
          message: sessionError.message,
          details: sessionError
        };
      } else {
        results[1] = { 
          test: 'Authentication Session', 
          status: 'success', 
          message: session ? 'User authenticated' : 'No active session (expected for public access)'
        };
      }
    } catch (err) {
      results[1] = { 
        test: 'Authentication Session', 
        status: 'error', 
        message: `Session check failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
        details: err
      };
    }

    // Test 3: RPC Function Call
    results.push({ test: 'RPC Function Call', status: 'pending', message: 'Testing...' });
    setDiagnosticResults([...results]);

    try {
      const { data: rpcTest, error: rpcError } = await supabase.rpc('is_admin_safe');
      
      if (rpcError) {
        results[2] = { 
          test: 'RPC Function Call', 
          status: 'error', 
          message: rpcError.message,
          details: rpcError
        };
      } else {
        results[2] = { 
          test: 'RPC Function Call', 
          status: 'success', 
          message: `RPC call successful. Admin status: ${rpcTest}`
        };
      }
    } catch (err) {
      results[2] = { 
        test: 'RPC Function Call', 
        status: 'error', 
        message: `RPC call failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
        details: err
      };
    }

    // Test 4: Data Query
    results.push({ test: 'Data Query', status: 'pending', message: 'Testing...' });
    setDiagnosticResults([...results]);

    try {
      const { data: storiesData, error: storiesError } = await supabase
        .from('stories')
        .select('id, title, published')
        .limit(5);

      if (storiesError) {
        results[3] = { 
          test: 'Data Query', 
          status: 'error', 
          message: storiesError.message,
          details: storiesError
        };
      } else {
        results[3] = { 
          test: 'Data Query', 
          status: 'success', 
          message: `Query successful. Found ${storiesData?.length || 0} stories`
        };
      }
    } catch (err) {
      results[3] = { 
        test: 'Data Query', 
        status: 'error', 
        message: `Data query failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
        details: err
      };
    }

    setDiagnosticResults(results);
    setIsRunning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'default';
      case 'error': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Admin Diagnostics</CardTitle>
        <div className="flex items-center gap-2">
          <span>Database Connection:</span>
          <Badge variant={isConnected ? 'default' : 'destructive'}>
            {isLoading ? 'Testing...' : isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
          {lastChecked && (
            <span className="text-sm text-muted-foreground">
              Last checked: {lastChecked.toLocaleTimeString()}
            </span>
          )}
        </div>
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
            {error}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runDiagnostics} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? 'Running Diagnostics...' : 'Run Full Diagnostics'}
        </Button>

        {diagnosticResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Diagnostic Results:</h3>
            {diagnosticResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{result.test}</span>
                    <Badge variant={getStatusColor(result.status)}>
                      {result.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{result.message}</p>
                  {result.details && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer text-muted-foreground">
                        Show details
                      </summary>
                      <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminDiagnostics;