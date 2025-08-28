import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const SupabaseStatusProbe: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [message, setMessage] = useState('Checking connection...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test 1: Database connectivity
        const { data: dbData, error: dbError } = await supabase
          .from('stories')
          .select('id', { count: 'exact', head: true })
          .limit(1);

        if (dbError) throw new Error(`Database: ${dbError.message}`);

        // Test 2: Storage connectivity with direct public URL
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
              // Timeout after 3 seconds
              setTimeout(() => reject(new Error('Icon load timeout')), 3000);
            });
          }
        }

        setStatus('success');
        setMessage('All systems operational');
      } catch (error) {
        setStatus('error');
        setMessage(`Connection issue: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    testConnection();
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg border-l-4 ${
      status === 'success' 
        ? 'bg-green-50 border-green-500 text-green-800' 
        : status === 'error'
        ? 'bg-red-50 border-red-500 text-red-800'
        : 'bg-blue-50 border-blue-500 text-blue-800'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          {status === 'checking' && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
          )}
          {status === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
          {status === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
          <span className="text-sm font-medium">System Status</span>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <p className="text-xs mt-1">{message}</p>
    </div>
  );
};