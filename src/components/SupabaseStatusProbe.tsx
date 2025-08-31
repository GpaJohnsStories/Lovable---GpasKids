import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, X, Database, HardDrive, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ConnectionTest {
  name: string;
  status: 'checking' | 'success' | 'error';
  message: string;
  duration?: number;
}

export const SupabaseStatusProbe: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [tests, setTests] = useState<ConnectionTest[]>([
    { name: 'Database', status: 'checking', message: 'Testing...' },
    { name: 'Storage', status: 'checking', message: 'Testing...' },
    { name: 'Icons', status: 'checking', message: 'Testing...' }
  ]);
  const [lastTestTime, setLastTestTime] = useState<Date | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      const startTime = Date.now();
      setLastTestTime(new Date());
      
      try {
        // Test 1: Database connectivity
        const dbStart = Date.now();
        const { data: dbData, error: dbError } = await supabase
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
          throw new Error(`Database: ${dbError.message}`);
        } else {
          setTests(prev => prev.map(test => 
            test.name === 'Database' 
              ? { ...test, status: 'success', message: 'Connected', duration: dbDuration }
              : test
          ));
        }

        // Test 2: Storage bucket availability
        const storageStart = Date.now();
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
        const storageDuration = Date.now() - storageStart;
        
        if (bucketError) {
          setTests(prev => prev.map(test => 
            test.name === 'Storage' 
              ? { ...test, status: 'error', message: `Bucket access failed: ${bucketError.message}`, duration: storageDuration }
              : test
          ));
        } else {
          const iconsBucket = buckets?.find(b => b.name === 'icons');
          if (iconsBucket) {
            setTests(prev => prev.map(test => 
              test.name === 'Storage' 
                ? { ...test, status: 'success', message: `${buckets.length} buckets available`, duration: storageDuration }
                : test
            ));
          } else {
            setTests(prev => prev.map(test => 
              test.name === 'Storage' 
                ? { ...test, status: 'error', message: 'Icons bucket not found', duration: storageDuration }
                : test
            ));
          }
        }

        // Test 3: Icon loading with detailed timing
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
              // Timeout after 5 seconds for slower connections
              setTimeout(() => reject(new Error('Icon load timeout')), 5000);
            });
            
            const iconDuration = Date.now() - iconStart;
            setTests(prev => prev.map(test => 
              test.name === 'Icons' 
                ? { ...test, status: 'success', message: 'Loaded successfully', duration: iconDuration }
                : test
            ));
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
    };

    testConnection();
  }, []);

  const overallStatus = tests.every(t => t.status === 'success') ? 'success' 
    : tests.some(t => t.status === 'error') ? 'error' 
    : 'checking';

  const getIcon = (status: 'checking' | 'success' | 'error') => {
    switch (status) {
      case 'checking':
        return <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg border-l-4 ${
      overallStatus === 'success' 
        ? 'bg-green-50 border-green-500 text-green-800' 
        : overallStatus === 'error'
        ? 'bg-red-50 border-red-500 text-red-800'
        : 'bg-blue-50 border-blue-500 text-blue-800'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getIcon(overallStatus)}
          <span className="text-sm font-medium">System Status</span>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="space-y-2">
        {tests.map((test) => (
          <div key={test.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              {test.name === 'Database' && <Database className="h-3 w-3" />}
              {test.name === 'Storage' && <HardDrive className="h-3 w-3" />}
              {test.name === 'Icons' && <span className="text-xs">🖼️</span>}
              <span className="font-medium">{test.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`${
                test.status === 'success' ? 'text-green-700' :
                test.status === 'error' ? 'text-red-700' : 'text-blue-700'
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
        ))}
      </div>
      
      {lastTestTime && (
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
          Last checked: {lastTestTime.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};