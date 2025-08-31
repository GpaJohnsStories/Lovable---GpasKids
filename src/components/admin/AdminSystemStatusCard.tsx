import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Database, HardDrive, Clock, Activity, MemoryStick } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ConnectionTest {
  name: string;
  status: 'checking' | 'success' | 'error' | 'untested';
  message: string;
  duration?: number;
  metrics?: Array<{ label: string; value: string }>;
}

export const AdminSystemStatusCard: React.FC = () => {
  const [tests, setTests] = useState<ConnectionTest[]>([
    { name: 'Memory', status: 'untested', message: 'Not tested' },
    { name: 'Database', status: 'untested', message: 'Not tested' },
    { name: 'Storage', status: 'untested', message: 'Not tested' },
    { name: 'Icons', status: 'untested', message: 'Not tested' }
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastTestTime, setLastTestTime] = useState<Date | null>(null);

  const runTests = async () => {
    setIsRunning(true);
    setLastTestTime(new Date());
    
    // Reset all tests to checking
    setTests([
      { name: 'Memory', status: 'checking', message: 'Testing...' },
      { name: 'Database', status: 'checking', message: 'Testing...' },
      { name: 'Storage', status: 'checking', message: 'Testing...' },
      { name: 'Icons', status: 'checking', message: 'Testing...' }
    ]);

    try {
      // Test 1: Memory usage
      const memoryStart = Date.now();
      try {
        let totalMemoryMB = 0;
        let memoryMessage = 'Measured';
        
        // Try to get memory from performance API
        if ('memory' in performance && (performance as any).memory) {
          totalMemoryMB = Math.round((performance as any).memory.usedJSHeapSize / (1024 * 1024));
        } else {
          // Fallback: estimate from resource sizes
          const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
          const totalBytes = resources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0);
          totalMemoryMB = Math.round(totalBytes / (1024 * 1024));
          memoryMessage = 'Estimated';
        }
        
        const memoryDuration = Date.now() - memoryStart;
        const metrics = [{ label: 'Total', value: `${totalMemoryMB} MB` }];
        
        setTests(prev => prev.map(test => 
          test.name === 'Memory' 
            ? { ...test, status: 'success', message: memoryMessage, duration: memoryDuration, metrics }
            : test
        ));
      } catch (memoryError) {
        const memoryDuration = Date.now() - memoryStart;
        setTests(prev => prev.map(test => 
          test.name === 'Memory' 
            ? { ...test, status: 'error', message: 'Unavailable', duration: memoryDuration }
            : test
        ));
      }

      // Test 2: Database connectivity
      const dbStart = Date.now();
      const { error: dbError } = await supabase
        .from('stories')
        .select('id', { count: 'exact', head: true })
        .limit(1);

      const dbDuration = Date.now() - dbStart;
      
      if (dbError) {
        setTests(prev => prev.map(test => 
          test.name === 'Database' 
            ? { ...test, status: 'error', message: `Failed: ${dbError.message}`, duration: dbDuration }
            : test
        ));
      } else {
        // Get database size metrics
        try {
          const { data: dbMetrics } = await supabase.rpc('get_database_size');
          const metrics = dbMetrics && dbMetrics.length > 0 
            ? [{ label: 'Size', value: dbMetrics[0].size_pretty }]
            : [{ label: 'Size', value: 'n/a' }];
          
          setTests(prev => prev.map(test => 
            test.name === 'Database' 
              ? { ...test, status: 'success', message: 'Connected', duration: dbDuration, metrics }
              : test
          ));
        } catch (metricsError) {
          setTests(prev => prev.map(test => 
            test.name === 'Database' 
              ? { ...test, status: 'success', message: 'Connected', duration: dbDuration, metrics: [{ label: 'Metrics', value: 'n/a' }] }
              : test
          ));
        }
      }

      // Test 3: Storage bucket availability - Test actual icon access and get storage totals
      const storageStart = Date.now();
      try {
        // Try to access an icon directly from the icons bucket
        const { data: testIcon } = await supabase
          .from('icon_library')
          .select('file_name_path')
          .limit(1)
          .single();

        if (testIcon?.file_name_path) {
          const { data: publicUrlData } = supabase.storage
            .from('icons')
            .getPublicUrl(testIcon.file_name_path);

          if (publicUrlData?.publicUrl) {
            const storageDuration = Date.now() - storageStart;
            
            // Get total storage metrics across all buckets
            try {
              console.log('🔍 Calling get_storage_totals RPC...');
              const { data: storageMetrics, error: storageError } = await supabase.rpc('get_storage_totals');
              console.log('📊 Storage RPC response:', { data: storageMetrics, error: storageError });
              
              if (storageError) {
                console.error('❌ Storage RPC error:', storageError);
                throw storageError;
              }
              
              const metrics = storageMetrics && storageMetrics.length > 0 
                ? [
                    { label: 'Total Objects', value: storageMetrics[0].total_objects.toString() },
                    { label: 'Total Size', value: storageMetrics[0].total_size_pretty }
                  ]
                : [{ label: 'Metrics', value: 'n/a' }];
              
              setTests(prev => prev.map(test => 
                test.name === 'Storage' 
                  ? { ...test, status: 'success', message: 'All buckets accessible', duration: storageDuration, metrics }
                  : test
              ));
            } catch (metricsError) {
              console.error('❌ Storage metrics error:', metricsError);
              setTests(prev => prev.map(test => 
                test.name === 'Storage' 
                  ? { ...test, status: 'success', message: 'Icons bucket accessible', duration: storageDuration, metrics: [{ label: 'Metrics', value: 'n/a' }] }
                  : test
              ));
            }
          } else {
            const storageDuration = Date.now() - storageStart;
            setTests(prev => prev.map(test => 
              test.name === 'Storage' 
                ? { ...test, status: 'error', message: 'Cannot generate public URLs', duration: storageDuration }
                : test
            ));
          }
        } else {
          const storageDuration = Date.now() - storageStart;
          setTests(prev => prev.map(test => 
            test.name === 'Storage' 
              ? { ...test, status: 'error', message: 'No icons found in library', duration: storageDuration }
              : test
          ));
        }
      } catch (storageError) {
        const storageDuration = Date.now() - storageStart;
        setTests(prev => prev.map(test => 
          test.name === 'Storage' 
            ? { ...test, status: 'error', message: `Storage access failed: ${storageError instanceof Error ? storageError.message : 'Unknown error'}`, duration: storageDuration }
            : test
        ));
      }

      // Test 4: Icon loading
      const iconStart = Date.now();
      const { data: testIcon } = await supabase
        .from('icon_library')
        .select('file_name_path')
        .limit(1)
        .single();

      if (testIcon) {
        const { data: publicUrlData } = supabase.storage
          .from('icons')
          .getPublicUrl(testIcon.file_name_path);

        if (publicUrlData?.publicUrl) {
          // Test if we can actually load the image
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error('Failed to load test icon'));
            img.src = publicUrlData.publicUrl;
            // Timeout after 5 seconds
            setTimeout(() => reject(new Error('Icon load timeout')), 5000);
          });
          
          const iconDuration = Date.now() - iconStart;
          
          // Get icon library metrics
          try {
            const { data: iconMetrics } = await supabase.rpc('get_icon_library_count');
            const metrics = iconMetrics && iconMetrics.length > 0 
              ? [
                  { label: 'Records', value: iconMetrics[0].icon_count.toString() },
                  { label: 'Sample load', value: `${iconDuration}ms` }
                ]
              : [{ label: 'Metrics', value: 'n/a' }];
            
            setTests(prev => prev.map(test => 
              test.name === 'Icons' 
                ? { ...test, status: 'success', message: 'Loaded successfully', duration: iconDuration, metrics }
                : test
            ));
          } catch (metricsError) {
            setTests(prev => prev.map(test => 
              test.name === 'Icons' 
                ? { ...test, status: 'success', message: 'Loaded successfully', duration: iconDuration, metrics: [{ label: 'Metrics', value: 'n/a' }] }
                : test
            ));
          }
        } else {
          const iconDuration = Date.now() - iconStart;
          setTests(prev => prev.map(test => 
            test.name === 'Icons' 
              ? { ...test, status: 'error', message: 'No public URL available', duration: iconDuration }
              : test
          ));
        }
      } else {
        const iconDuration = Date.now() - iconStart;
        setTests(prev => prev.map(test => 
          test.name === 'Icons' 
            ? { ...test, status: 'error', message: 'No test icons found', duration: iconDuration }
            : test
        ));
      }
    } catch (error) {
      // Update any remaining 'checking' tests to error state
      setTests(prev => prev.map(test => 
        test.status === 'checking' 
          ? { ...test, status: 'error', message: 'Connection failed' }
          : test
      ));
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: 'checking' | 'success' | 'error' | 'untested') => {
    switch (status) {
      case 'checking':
        return <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'untested':
        return <div className="h-4 w-4 rounded-full bg-gray-300" />;
    }
  };

  const getTestIcon = (testName: string) => {
    switch (testName) {
      case 'Memory':
        return <MemoryStick className="h-4 w-4" />;
      case 'Database':
        return <Database className="h-4 w-4" />;
      case 'Storage':
        return <HardDrive className="h-4 w-4" />;
      case 'Icons':
        return <span className="text-sm">🖼️</span>;
      default:
        return null;
    }
  };

  const overallStatus = tests.every(t => t.status === 'success') ? 'success' 
    : tests.some(t => t.status === 'error') ? 'error' 
    : tests.some(t => t.status === 'checking') ? 'checking'
    : 'untested';

  return (
    <Card className="mb-6 border-cyan-500 border-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-cyan-700">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Status
          </div>
          <button 
            onClick={runTests} 
            disabled={isRunning}
            className="px-3 py-1 text-sm text-cyan-700 border border-cyan-700 rounded hover:bg-cyan-50 disabled:opacity-50"
          >
            {isRunning ? 'Running Tests...' : 'Run Tests'}
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tests.map((test) => (
            <div key={test.name} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getTestIcon(test.name)}
                  <span className="font-medium text-sm">{test.name}</span>
                  {getStatusIcon(test.status)}
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <span className={`${
                    test.status === 'success' ? 'text-green-700' :
                    test.status === 'error' ? 'text-red-700' : 
                    test.status === 'checking' ? 'text-blue-700' : 'text-gray-500'
                  }`}>
                    {test.message}
                  </span>
                  {test.duration && (
                    <span className="text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {test.duration}ms
                    </span>
                  )}
                </div>
              </div>
              {test.metrics && test.metrics.length > 0 && (
                <div className="ml-7 text-xs text-muted-foreground">
                  {test.metrics.map((metric, index) => (
                    <span key={metric.label}>
                      {metric.label}: {metric.value}
                      {index < test.metrics!.length - 1 && ' • '}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {lastTestTime && (
          <div className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
            Last checked: {lastTestTime.toLocaleTimeString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
