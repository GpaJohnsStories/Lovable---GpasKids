import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Database, HardDrive, Calendar, FileText, Loader2, Cloud, Package, Clock, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import JSZip from 'jszip';
import BackupProgressModal from './BackupProgressModal';

export const BackupCenter = () => {
  const [isExportingDb, setIsExportingDb] = useState(false);
  const [downloadingBucket, setDownloadingBucket] = useState<string | null>(null);
  const [isCreatingFullBackup, setIsCreatingFullBackup] = useState(false);
  const [isRunningNightlyBackup, setIsRunningNightlyBackup] = useState(false);
  const [backupHistory, setBackupHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [backupSteps, setBackupSteps] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState('');
  const [overallProgress, setOverallProgress] = useState(0);

  const storageBuckets = [
    { name: 'story-photos', description: 'Story photo attachments', public: true },
    { name: 'story-videos', description: 'Story video files', public: true },
    { name: 'story-audio', description: 'Generated story audio files', public: true },
    { name: 'icons', description: 'UI icons and graphics', public: true },
    { name: 'orange-gang', description: 'Approved Orange Gang photos', public: true },
    { name: 'orange-gang-pending', description: 'Pending Orange Gang photos', public: false }
  ];

  // Load backup history on component mount
  useEffect(() => {
    loadBackupHistory();
  }, []);

  const loadBackupHistory = async () => {
    try {
      setLoadingHistory(true);
      const { data: files, error } = await supabase.storage
        .from('backups')
        .list('', { limit: 30, sortBy: { column: 'created_at', order: 'desc' } });

      if (error) {
        console.error('Error loading backup history:', error);
        return;
      }

      setBackupHistory(files || []);
    } catch (error) {
      console.error('Error loading backup history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const downloadJsonAsZip = async (jsonContent: string, filename: string) => {
    try {
      const data = JSON.parse(jsonContent);
      
      // Create a real ZIP file using JSZip
      const zip = new JSZip();
      
      // Add main backup file
      zip.file('backup.json', JSON.stringify(data, null, 2));
      
      // Add a readme file
      const readme = `GPA Stories Backup - ${new Date().toISOString()}

This backup contains:
- Database export (CSV format with JSON metadata)
- Storage bucket contents (with checksums)
- Schema definitions and RLS policies

To restore from this backup, use the GPA Stories backup restoration tools.
Contact the system administrator for assistance.`;
      
      zip.file('README.txt', readme);
      
      // Generate ZIP and download
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename.replace('.json', '.zip');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`ZIP backup downloaded: ${filename}`);
    } catch (error) {
      console.error('Error creating ZIP backup:', error);
      toast.error('Failed to create ZIP backup');
    }
  };

  const handleDatabaseBackup = async () => {
    setIsExportingDb(true);
    try {
      console.log('Calling export-db-backup edge function...');
      
      const { data, error } = await supabase.functions.invoke('export-db-backup', {
        method: 'GET'
      });

      if (error) {
        console.error('Database backup error:', error);
        toast.error('Failed to create database backup');
        return;
      }

      if (typeof data === 'string') {
        const parsedData = JSON.parse(data);
        downloadJsonAsZip(data, parsedData.filename || 'gpaskids_backup.zip');
      } else {
        downloadJsonAsZip(JSON.stringify(data), data.filename || 'gpaskids_backup.zip');
      }

    } catch (error) {
      console.error('Database backup error:', error);
      toast.error('Failed to create database backup');
    } finally {
      setIsExportingDb(false);
    }
  };

  const handleBucketBackup = async (bucketName: string) => {
    setDownloadingBucket(bucketName);
    try {
      console.log(`Calling download-bucket-zip for bucket: ${bucketName}...`);
      
      const { data, error } = await supabase.functions.invoke('download-bucket-zip', {
        body: { bucket: bucketName }
      });

      if (error) {
        console.error(`Bucket ${bucketName} backup error:`, error);
        toast.error(`Failed to backup ${bucketName} bucket`);
        return;
      }

      // Check for processing issues and show appropriate messages
      let backupInfo = null;
      if (typeof data === 'string') {
        const parsedData = JSON.parse(data);
        backupInfo = parsedData.entries?.find((entry: any) => entry.name === 'backup-info.json');
        if (backupInfo?.content) {
          backupInfo = JSON.parse(atob(backupInfo.content));
        }
        downloadJsonAsZip(data, parsedData.filename || `${bucketName}_backup.zip`);
      } else {
        backupInfo = data?.entries?.find((entry: any) => entry.name === 'backup-info.json');
        if (backupInfo?.content) {
          backupInfo = JSON.parse(atob(backupInfo.content));
        }
        downloadJsonAsZip(JSON.stringify(data), data.filename || `${bucketName}_backup.zip`);
      }

      // Show appropriate success/warning message
      if (backupInfo) {
        const { skipped_files, error_files } = backupInfo;
        
        if (skipped_files > 0 || error_files > 0) {
          let message = `Backup completed with issues: `;
          if (skipped_files > 0) message += `${skipped_files} files skipped (too large), `;
          if (error_files > 0) message += `${error_files} files had errors`;
          
          toast(`Backup completed with issues for ${bucketName}`, {
            description: message,
          });
        } else {
          toast.success(`Successfully backed up bucket: ${bucketName}`);
        }
      } else {
        toast.success(`Successfully backed up bucket: ${bucketName}`);
      }

    } catch (error) {
      console.error(`Bucket ${bucketName} backup error:`, error);
      toast.error(`Failed to backup ${bucketName} bucket`);
    } finally {
      setDownloadingBucket(null);
    }
  };

  const handleFullBackupDownload = async () => {
    setIsCreatingFullBackup(true);
    setShowProgressModal(true);
    
    // Initialize progress steps
    const steps = [
      { id: 'db', label: 'Export Database', status: 'pending' as const },
      ...storageBuckets.map(bucket => ({
        id: bucket.name,
        label: `Backup ${bucket.name}`,
        status: 'pending' as const
      })),
      { id: 'package', label: 'Package ZIP File', status: 'pending' as const }
    ];
    
    setBackupSteps(steps);
    setOverallProgress(0);
    
    try {
      console.log('Creating comprehensive full backup...');
      
      // Step 1: Database backup
      setCurrentStep('db');
      setBackupSteps(prev => prev.map(s => s.id === 'db' ? { ...s, status: 'running' } : s));
      
      const { data: dbData, error: dbError } = await supabase.functions.invoke('export-db-backup');
      if (dbError) {
        setBackupSteps(prev => prev.map(s => s.id === 'db' ? { ...s, status: 'error', details: dbError.message } : s));
        throw new Error(`Database backup failed: ${dbError.message}`);
      }
      
      setBackupSteps(prev => prev.map(s => s.id === 'db' ? { 
        ...s, 
        status: 'completed',
        details: `${dbData?.entries?.length || 0} tables exported`
      } : s));
      setOverallProgress(10);

      // Step 2: Storage buckets
      const bucketBackups: any = {};
      for (let i = 0; i < storageBuckets.length; i++) {
        const bucket = storageBuckets[i];
        setCurrentStep(bucket.name);
        setBackupSteps(prev => prev.map(s => s.id === bucket.name ? { ...s, status: 'running' } : s));
        
        try {
          const { data: bucketData, error: bucketError } = await supabase.functions.invoke('download-bucket-zip', {
            body: { bucket: bucket.name }
          });
          
          if (bucketError) {
            console.warn(`Bucket ${bucket.name} backup failed:`, bucketError.message);
            bucketBackups[bucket.name] = { error: bucketError.message };
            setBackupSteps(prev => prev.map(s => s.id === bucket.name ? { 
              ...s, 
              status: 'error',
              details: bucketError.message
            } : s));
          } else {
            bucketBackups[bucket.name] = bucketData;
            const fileCount = bucketData?.entries?.length || 0;
            const totalSize = bucketData?.entries?.reduce((sum: number, entry: any) => sum + (entry.size || 0), 0) || 0;
            
            setBackupSteps(prev => prev.map(s => s.id === bucket.name ? { 
              ...s, 
              status: 'completed',
              fileCount,
              totalSize: totalSize > 0 ? `${Math.round(totalSize / 1024)} KB` : '0 KB'
            } : s));
          }
        } catch (err) {
          console.warn(`Bucket ${bucket.name} error:`, err);
          bucketBackups[bucket.name] = { error: 'Backup failed' };
          setBackupSteps(prev => prev.map(s => s.id === bucket.name ? { 
            ...s, 
            status: 'error',
            details: 'Backup failed'
          } : s));
        }
        
        setOverallProgress(10 + ((i + 1) / storageBuckets.length) * 80);
      }

      // Step 3: Package ZIP
      setCurrentStep('package');
      setBackupSteps(prev => prev.map(s => s.id === 'package' ? { ...s, status: 'running' } : s));
      
      const fullBackup = {
        backup_info: {
          created_at: new Date().toISOString(),
          backup_type: 'full_system_backup',
          description: 'Complete GPA Stories system backup',
          components: {
            database: 'included',
            storage_buckets: Object.keys(bucketBackups)
          }
        },
        database_backup: dbData,
        storage_backups: bucketBackups
      };

      await downloadJsonAsZip(JSON.stringify(fullBackup), `gpaskids_full_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.zip`);
      
      setBackupSteps(prev => prev.map(s => s.id === 'package' ? { 
        ...s, 
        status: 'completed',
        details: 'ZIP file created and downloaded'
      } : s));
      setOverallProgress(100);
      
      // Show success summary
      const successfulBuckets = Object.entries(bucketBackups).filter(([_, data]: [string, any]) => !data.error).length;
      const errorBuckets = Object.entries(bucketBackups).filter(([_, data]: [string, any]) => data.error).length;
      
      toast.success(`Full backup completed! ${successfulBuckets} buckets backed up successfully${errorBuckets > 0 ? `, ${errorBuckets} had errors` : ''}`);
      
    } catch (error) {
      console.error('Full backup error:', error);
      toast.error('Failed to create full backup');
    } finally {
      setIsCreatingFullBackup(false);
      setTimeout(() => {
        setShowProgressModal(false);
      }, 2000); // Keep modal open for 2 seconds to show completion
    }
  };

  const handleNightlyBackup = async () => {
    setIsRunningNightlyBackup(true);
    try {
      console.log('Running nightly backup to storage...');
      
      const { data, error } = await supabase.functions.invoke('full-backup-to-bucket');
      
      if (error) {
        throw new Error(`Nightly backup failed: ${error.message}`);
      }

      // Show detailed success message
      const successMessage = data?.components_backed_up ? 
        `Nightly backup completed! Database: ${data.components_backed_up.database ? 'included' : 'failed'}, Storage buckets: ${data.components_backed_up.storage_buckets || 0}` :
        'Nightly backup completed and saved to storage';
      
      toast.success(successMessage);
      
      // Refresh backup history
      await loadBackupHistory();
      
    } catch (error) {
      console.error('Nightly backup error:', error);
      toast.error('Failed to run nightly backup');
    } finally {
      setIsRunningNightlyBackup(false);
    }
  };

  const downloadBackupFromHistory = async (filename: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('backups')
        .download(filename);

      if (error) {
        throw new Error(`Download failed: ${error.message}`);
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`Downloaded: ${filename}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download backup');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <HardDrive className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Backup Center</h1>
          <p className="text-gray-600">Download your data and assets for safekeeping</p>
        </div>
      </div>

      {/* Full System Backup Section */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Package className="w-5 h-5" />
            Full System Backup (Recommended)
          </CardTitle>
          <CardDescription className="text-blue-700">
            One-click download of everything: database, all storage buckets, and metadata. Perfect for complete system backup.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-800">Complete backup includes:</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default" className="bg-blue-600">Database Export</Badge>
                <Badge variant="default" className="bg-blue-600">All Storage Buckets</Badge>
                <Badge variant="default" className="bg-blue-600">Schema & Policies</Badge>
                <Badge variant="default" className="bg-blue-600">File Checksums</Badge>
                <Badge variant="default" className="bg-blue-600">Restore Instructions</Badge>
              </div>
            </div>
            <Button 
              onClick={handleFullBackupDownload}
              disabled={isCreatingFullBackup}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            >
              {isCreatingFullBackup ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Create Full Backup (ZIP)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Automated Backup Section */}
      <Card className="border-2 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Cloud className="w-5 h-5" />
            Automated Nightly Backup
          </CardTitle>
          <CardDescription className="text-green-700">
            Automatically save backups to secure cloud storage. Run manually or schedule for nightly execution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="space-y-2">
              <h4 className="font-medium text-green-800">Features:</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">30-Day Retention</Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Auto Cleanup</Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Cloud Storage</Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Scheduled</Badge>
              </div>
              <p className="text-sm text-green-700 mt-2">
                💡 Tip: Use cron scheduling for daily 2 AM backups
              </p>
            </div>
            <Button 
              onClick={handleNightlyBackup}
              disabled={isRunningNightlyBackup}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
            >
              {isRunningNightlyBackup ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              Run Backup to Supabase Cloud
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Individual Database Backup Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database Only Backup
          </CardTitle>
          <CardDescription>
            Export only database tables, schema definitions, and RLS policies. Includes asset metadata but not the actual files.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="space-y-2">
              <h4 className="font-medium">Includes:</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Stories & Comments</Badge>
                <Badge variant="secondary">User Profiles</Badge>
                <Badge variant="secondary">Voting Data</Badge>
                <Badge variant="secondary">Schema & Policies</Badge>
                <Badge variant="secondary">Asset Manifest</Badge>
              </div>
            </div>
            <Button 
              onClick={handleDatabaseBackup}
              disabled={isExportingDb}
              variant="outline"
              className="w-full sm:w-auto"
            >
              {isExportingDb ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Download DB Backup (ZIP)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Backup History Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Backup History
          </CardTitle>
          <CardDescription>
            Download previous backup files stored in cloud storage. Kept for 30 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingHistory ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading backup history...
            </div>
          ) : backupHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No backup files found. Run your first nightly backup to see history here.
            </div>
          ) : (
            <div className="space-y-3">
              {backupHistory.map((file) => (
                <div key={file.name} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                  <div>
                    <h4 className="font-medium text-sm">{file.name}</h4>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(file.created_at).toLocaleString()}
                      {file.metadata?.size && ` • Size: ${Math.round(file.metadata.size / 1024)} KB`}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadBackupFromHistory(file.name)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual Storage Buckets Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Individual Storage Buckets
          </CardTitle>
          <CardDescription>
            Download individual storage buckets with all files and checksums. Each bucket is downloaded separately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {storageBuckets.map((bucket) => (
              <div key={bucket.name} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{bucket.name}</h4>
                  <Badge variant={bucket.public ? "default" : "secondary"}>
                    {bucket.public ? "Public" : "Private"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{bucket.description}</p>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBucketBackup(bucket.name)}
                  disabled={downloadingBucket === bucket.name}
                  className="w-full"
                >
                  {downloadingBucket === bucket.name ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Download {bucket.name}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Backup Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Calendar className="w-5 h-5" />
            Backup Information & Scheduling
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Backup Features:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Full system backups include everything in one ZIP file</li>
                <li>• Nightly backups are stored securely in cloud storage</li>
                <li>• 30-day retention policy with automatic cleanup</li>
                <li>• SHA-256 checksums for file integrity verification</li>
                <li>• Timestamps in filenames for easy identification</li>
              </ul>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Automated Scheduling:</h4>
              <p className="text-sm mb-2">
                To set up nightly backups at 2 AM, configure this cron job in your Supabase project:
              </p>
              <div className="bg-blue-100 p-3 rounded font-mono text-xs overflow-x-auto">
                {`SELECT cron.schedule(
  'nightly-backup',
  '0 2 * * *',
  $$
  SELECT net.http_post(
    url:='https://hlywucxwpzbqmzssmwpj.supabase.co/functions/v1/full-backup-to-bucket',
    headers:='{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  );
  $$
);`}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Modal */}
      <BackupProgressModal
        isOpen={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        steps={backupSteps}
        currentStep={currentStep}
        overallProgress={overallProgress}
      />
    </div>
  );
};
