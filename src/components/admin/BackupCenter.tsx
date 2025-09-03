import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Download, Database, HardDrive, Calendar, FileText, Loader2, Cloud, Package, Clock, Play, Filter, Eye, FolderDown, FileSpreadsheet } from 'lucide-react';
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
  const [scheduledBackups, setScheduledBackups] = useState<any[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [backupSteps, setBackupSteps] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState('');
  const [overallProgress, setOverallProgress] = useState(0);
  
  // Audio backup state
  const [audioFilterMode, setAudioFilterMode] = useState<'all' | 'sinceDate'>('all');
  const [audioFilterDate, setAudioFilterDate] = useState<string>('');
  const [audioManifest, setAudioManifest] = useState<any>(null);
  const [showAudioPreview, setShowAudioPreview] = useState(false);
  const [isGeneratingAudioManifest, setIsGeneratingAudioManifest] = useState(false);
  const [browserDownloadProgress, setBrowserDownloadProgress] = useState<{
    total: number;
    completed: number;
    failed: number;
    isActive: boolean;
  }>({ total: 0, completed: 0, failed: 0, isActive: false });

  const storageBuckets = [
    { name: 'story-photos', description: 'Story photo attachments', public: true },
    { name: 'story-videos', description: 'Story video files', public: true },
    { name: 'story-audio', description: 'Generated story audio files', public: true },
    { name: 'icons', description: 'UI icons and graphics', public: true },
    { name: 'orange-gang', description: 'Approved Orange Gang photos', public: true },
    { name: 'orange-gang-pending', description: 'Pending Orange Gang photos', public: false }
  ];

  // Load backup history and scheduled backups on component mount
  useEffect(() => {
    loadBackupHistory();
    loadScheduledBackups();
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

  const loadScheduledBackups = async () => {
    try {
      setLoadingSchedule(true);
      const { data, error } = await supabase.rpc('get_scheduled_backups');
      
      if (error) {
        console.error('Error loading scheduled backups:', error);
        return;
      }

      setScheduledBackups(data || []);
    } catch (error) {
      console.error('Error loading scheduled backups:', error);
    } finally {
      setLoadingSchedule(false);
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

  // Audio backup functions
  const generateAudioManifest = async () => {
    setIsGeneratingAudioManifest(true);
    try {
      const requestBody = {
        bucket: 'story-audio',
        mode: audioFilterMode,
        sinceDate: audioFilterMode === 'sinceDate' ? audioFilterDate : undefined,
        includeSignedUrls: true,
        expiresInSeconds: 172800 // 48 hours
      };

      console.log('Generating audio manifest with:', requestBody);

      const { data, error } = await supabase.functions.invoke('storage-manifest-signed-urls', {
        body: requestBody
      });

      if (error) {
        console.error('Audio manifest error:', error);
        toast.error('Failed to generate audio manifest');
        return;
      }

      setAudioManifest(data);
      setShowAudioPreview(true);

      console.log(`Generated manifest: ${data.totals.count} files, ${data.totals.size_pretty}`);
      
    } catch (error) {
      console.error('Audio manifest generation error:', error);
      toast.error('Failed to generate audio manifest');
    } finally {
      setIsGeneratingAudioManifest(false);
    }
  };

  const downloadAudioCSV = () => {
    if (!audioManifest?.entries) return;

    const csvContent = [
      // Header row
      'filename,url,size_bytes,size_pretty,updated_at,story_id,story_code,title',
      // Data rows
      ...audioManifest.entries.map((entry: any) => {
        const row = [
          `"${entry.filename}"`,
          `"${entry.signed_url}"`,
          entry.size_bytes,
          `"${(entry.size_bytes / 1024 / 1024).toFixed(2)} MB"`,
          `"${entry.updated_at}"`,
          `"${entry.story_id || ''}"`,
          `"${entry.story_code || ''}"`,
          `"${entry.title || ''}"`
        ];
        return row.join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    const filterSuffix = audioFilterMode === 'sinceDate' ? `_since_${audioFilterDate}` : '_all';
    const filename = `story_audio_manifest${filterSuffix}_${new Date().toISOString().slice(0, 10)}.csv`;
    
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`CSV downloaded: ${filename}`);
    setShowAudioPreview(false);
  };

  const downloadAudioViaFiles = async () => {
    if (!audioManifest?.entries) return;

    // Check for File System Access API support
    if (!('showDirectoryPicker' in window)) {
      toast.error('Browser download requires a Chromium-based browser (Chrome, Edge, etc.). Please use the CSV download option instead.');
      return;
    }

    try {
      // Prompt user to select a directory
      const directoryHandle = await (window as any).showDirectoryPicker();
      
      setBrowserDownloadProgress({
        total: audioManifest.entries.length,
        completed: 0,
        failed: 0,
        isActive: true
      });

      const maxConcurrency = 3; // Limit concurrent downloads
      let completed = 0;
      let failed = 0;

      // Process files in batches
      for (let i = 0; i < audioManifest.entries.length; i += maxConcurrency) {
        const batch = audioManifest.entries.slice(i, i + maxConcurrency);
        
        await Promise.allSettled(batch.map(async (entry: any) => {
          try {
            // Check if file already exists
            try {
              await directoryHandle.getFileHandle(entry.filename);
              console.log(`File already exists, skipping: ${entry.filename}`);
              completed++;
              return;
            } catch {
              // File doesn't exist, proceed with download
            }

            // Fetch the file
            const response = await fetch(entry.signed_url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const blob = await response.blob();
            
            // Create file in selected directory
            const fileHandle = await directoryHandle.getFileHandle(entry.filename, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(blob);
            await writable.close();
            
            completed++;
          } catch (error) {
            console.error(`Failed to download ${entry.filename}:`, error);
            failed++;
          } finally {
            setBrowserDownloadProgress(prev => ({
              ...prev,
              completed: completed,
              failed: failed
            }));
          }
        }));
      }

      setBrowserDownloadProgress(prev => ({ ...prev, isActive: false }));
      
      if (failed === 0) {
        toast.success(`Successfully downloaded ${completed} audio files!`);
      } else {
        toast(`Download completed: ${completed} successful, ${failed} failed`, {
          description: 'Check console for details on failed downloads.'
        });
      }

    } catch (error) {
      console.error('Browser download error:', error);
      toast.error('Failed to download files via browser');
      setBrowserDownloadProgress(prev => ({ ...prev, isActive: false }));
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
              {loadingSchedule ? (
                <p className="text-sm text-green-700 mt-2">
                  <Loader2 className="w-4 h-4 inline mr-1 animate-spin" />
                  Checking schedule status...
                </p>
              ) : scheduledBackups.length > 0 ? (
                <div className="text-sm text-green-700 mt-2">
                  ✅ <strong>Daily backups active!</strong> Next backup: Today at 2:00 AM UTC
                  <br />
                  <span className="text-xs">Schedule: {scheduledBackups[0]?.schedule} (Job ID: {scheduledBackups[0]?.jobid})</span>
                </div>
              ) : (
                <p className="text-sm text-green-700 mt-2">
                  ⚠️ No scheduled backups found. Run manual backup above.
                </p>
              )}
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
            {storageBuckets.map((bucket) => {
              // Special handling for story-audio bucket
              if (bucket.name === 'story-audio') {
                return (
                  <div key={bucket.name} className="p-4 border-2 border-orange-200 rounded-lg bg-orange-50 md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-orange-800">{bucket.name}</h4>
                      <Badge variant="default" className="bg-orange-600">
                        Enhanced Backup
                      </Badge>
                    </div>
                    <p className="text-sm text-orange-700 mb-4">{bucket.description} - Enhanced with date filtering and individual file downloads</p>
                    
                    {/* Filter Controls */}
                    <div className="space-y-3 mb-4 p-3 bg-white rounded border">
                      <div className="flex items-center gap-4">
                        <Filter className="w-4 h-4 text-orange-600" />
                        <Label className="text-sm font-medium">Filter Options:</Label>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex gap-2">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="radio"
                              name="audioFilter"
                              value="all"
                              checked={audioFilterMode === 'all'}
                              onChange={(e) => setAudioFilterMode(e.target.value as 'all' | 'sinceDate')}
                              className="text-orange-600"
                            />
                            All audio files
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="radio"
                              name="audioFilter"
                              value="sinceDate"
                              checked={audioFilterMode === 'sinceDate'}
                              onChange={(e) => setAudioFilterMode(e.target.value as 'all' | 'sinceDate')}
                              className="text-orange-600"
                            />
                            Updated after
                          </label>
                        </div>
                        
                        {audioFilterMode === 'sinceDate' && (
                          <div className="flex items-center gap-2">
                            <Input
                              type="date"
                              value={audioFilterDate}
                              onChange={(e) => setAudioFilterDate(e.target.value)}
                              className="w-auto text-sm"
                            />
                            <span className="text-xs text-gray-500">at 00:00:00</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={generateAudioManifest}
                        disabled={isGeneratingAudioManifest || (audioFilterMode === 'sinceDate' && !audioFilterDate)}
                        className="w-full bg-orange-100 border-orange-300 text-orange-800 hover:bg-orange-200"
                      >
                        {isGeneratingAudioManifest ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <FileSpreadsheet className="w-4 h-4 mr-2" />
                        )}
                        Get Download Links (CSV)
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          generateAudioManifest().then(() => {
                            if (audioManifest) {
                              downloadAudioViaFiles();
                            }
                          });
                        }}
                        disabled={isGeneratingAudioManifest || (audioFilterMode === 'sinceDate' && !audioFilterDate) || browserDownloadProgress.isActive}
                        className="w-full bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200"
                      >
                        {isGeneratingAudioManifest || browserDownloadProgress.isActive ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <FolderDown className="w-4 h-4 mr-2" />
                        )}
                        Download via Browser (Chrome, Edge, etc.)
                      </Button>
                      
                      {/* Browser Download Progress */}
                      {browserDownloadProgress.isActive && (
                        <div className="p-3 bg-blue-50 rounded border border-blue-200">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>Downloading files...</span>
                            <span>{browserDownloadProgress.completed + browserDownloadProgress.failed}/{browserDownloadProgress.total}</span>
                          </div>
                          <Progress 
                            value={(browserDownloadProgress.completed + browserDownloadProgress.failed) / browserDownloadProgress.total * 100} 
                            className="mb-2"
                          />
                          <div className="text-xs text-gray-600">
                            ✅ {browserDownloadProgress.completed} completed
                            {browserDownloadProgress.failed > 0 && (
                              <span className="ml-2">❌ {browserDownloadProgress.failed} failed</span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-600 mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        ⚠️ Note: Traditional ZIP download is not available for audio files due to large file sizes. Use the enhanced options above for reliable downloads.
                      </p>
                    </div>
                  </div>
                );
              }
              
              // Regular bucket display
              return (
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
              );
            })}
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

      {/* Audio Preview Modal */}
      <Dialog open={showAudioPreview} onOpenChange={setShowAudioPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Audio Files Preview
            </DialogTitle>
            <DialogDescription>
              {audioManifest && (
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-lg font-medium">
                    <span>📁 {audioManifest.totals.count} files</span>
                    <span>💾 {audioManifest.totals.size_pretty}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {audioFilterMode === 'all' 
                      ? 'All audio files in the story-audio bucket'
                      : `Files updated after ${audioFilterDate} at 00:00:00`
                    }
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {audioManifest?.entries && (
            <div>
              <h4 className="font-medium mb-3">Preview (first 10 files):</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto border rounded p-3 bg-gray-50">
                {audioManifest.entries.slice(0, 10).map((entry: any, index: number) => (
                  <div key={index} className="text-sm border-b pb-2 last:border-b-0">
                    <div className="font-medium truncate">{entry.filename}</div>
                    <div className="text-gray-600 text-xs">
                      {(entry.size_bytes / 1024 / 1024).toFixed(2)} MB • 
                      Story: {entry.story_code || 'Unknown'} • 
                      Updated: {new Date(entry.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                {audioManifest.entries.length > 10 && (
                  <div className="text-center text-gray-500 text-sm pt-2">
                    ... and {audioManifest.entries.length - 10} more files
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowAudioPreview(false)}>
              Cancel
            </Button>
            <Button 
              onClick={downloadAudioCSV}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Download CSV
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
