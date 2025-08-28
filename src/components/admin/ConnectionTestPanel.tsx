import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseConnection } from "@/hooks/useSupabaseConnection";
import { iconCacheService } from "@/services/IconCacheService";

export const ConnectionTestPanel: React.FC = () => {
  const [tests, setTests] = useState<{[key: string]: 'pending' | 'success' | 'error' | 'untested'}>({
    database: 'untested',
    auth: 'untested',
    storage: 'untested',
    icons: 'untested'
  });
  const [testResults, setTestResults] = useState<{[key: string]: string}>({});
  const { isConnected, testConnection } = useSupabaseConnection();

  const runTests = async () => {
    // Reset tests
    setTests({
      database: 'pending',
      auth: 'pending', 
      storage: 'pending',
      icons: 'pending'
    });
    setTestResults({});

    // Test database connection
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('id', { count: 'exact', head: true })
        .limit(1);
      
      if (error) throw error;
      
      setTests(prev => ({ ...prev, database: 'success' }));
      setTestResults(prev => ({ ...prev, database: `Connected - Stories table accessible` }));
    } catch (err) {
      setTests(prev => ({ ...prev, database: 'error' }));
      setTestResults(prev => ({ ...prev, database: `Error: ${err instanceof Error ? err.message : 'Unknown error'}` }));
    }

    // Test auth
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setTests(prev => ({ ...prev, auth: 'success' }));
      setTestResults(prev => ({ ...prev, auth: user ? `Authenticated as ${user.email}` : 'Not authenticated (OK)' }));
    } catch (err) {
      setTests(prev => ({ ...prev, auth: 'error' }));
      setTestResults(prev => ({ ...prev, auth: `Error: ${err instanceof Error ? err.message : 'Unknown error'}` }));
    }

    // Test storage
    try {
      const { data, error } = await supabase.storage.getBucket('icons');
      if (error) throw error;
      
      setTests(prev => ({ ...prev, storage: 'success' }));
      setTestResults(prev => ({ ...prev, storage: `Icons bucket accessible - ${data.public ? 'Public' : 'Private'}` }));
    } catch (err) {
      setTests(prev => ({ ...prev, storage: 'error' }));
      setTestResults(prev => ({ ...prev, storage: `Error: ${err instanceof Error ? err.message : 'Unknown error'}` }));
    }

    // Test icon cache service
    try {
      const stats = iconCacheService.getCacheStats();
      setTests(prev => ({ ...prev, icons: 'success' }));
      setTestResults(prev => ({ ...prev, icons: `Cache: ${stats.size}/${stats.maxSize} icons, ${stats.loadingCount} loading` }));
    } catch (err) {
      setTests(prev => ({ ...prev, icons: 'error' }));
      setTestResults(prev => ({ ...prev, icons: `Error: ${err instanceof Error ? err.message : 'Unknown error'}` }));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-600 text-white">✓ Connected</Badge>;
      case 'error':
        return <Badge className="bg-red-600 text-white">✗ Error</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600 text-white">⏳ Testing...</Badge>;
      default:
        return <Badge variant="secondary">Not Tested</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm">Overall Status:</span>
          {getStatusBadge(isConnected ? 'success' : 'error')}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runTests} className="w-full">
          Run Connection Tests
        </Button>

        <div className="space-y-3">
          {Object.entries(tests).map(([test, status]) => (
            <div key={test} className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium capitalize">{test}</div>
                {testResults[test] && (
                  <div className="text-sm text-gray-600">{testResults[test]}</div>
                )}
              </div>
              {getStatusBadge(status)}
            </div>
          ))}
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <div>Project: hlywucxwpzbqmzssmwpj</div>
          <div>URL: https://hlywucxwpzbqmzssmwpj.supabase.co</div>
        </div>
      </CardContent>
    </Card>
  );
};