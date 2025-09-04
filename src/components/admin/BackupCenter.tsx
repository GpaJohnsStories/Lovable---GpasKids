import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Download, Database, HardDrive, Calendar, FileText, Loader2, Cloud, Package, Clock, Play, Filter, Eye, FolderDown, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  
  // Unified media backup state
  const [selectedBucket, setSelectedBucket] = useState<'story-audio' | 'story-photos' | 'story-videos' | 'icons'>('story-audio');
  const [filterMode, setFilterMode] = useState<'all' | 'sinceDate'>('all');
  const [filterDate, setFilterDate] = useState<string>('');
  const [sizeFilter, setSizeFilter] = useState<'all' | 'over5mb'>('all');
  const [manifest, setManifest] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDownloadConfirmation, setShowDownloadConfirmation] = useState(false);
  const [browserDownloadProgress, setBrowserDownloadProgress] = useState<{
    total: number;
    completed: number;
    failed: number;
    isActive: boolean;
  }>({ total: 0, completed: 0, failed: 0, isActive: false });

  // Browser compatibility and environment detection
  const isFileSystemAccessSupported = typeof window !== 'undefined' && 'showDirectoryPicker' in window;
  const isInCrossOriginFrame = typeof window !== 'undefined' && 
    window.location !== window.parent.location;
  const isBrowserDownloadAvailable = isFileSystemAccessSupported && !isInCrossOriginFrame;

  const storageBuckets = [
    { name: 'story-photos', description: 'Story photo attachments', public: true },
    { name: 'story-videos', description: 'Story video files', public: true },
    { name: 'story-audio', description: 'Generated story audio files', public: true },
    { name: 'icons', description: 'UI icons and graphics', public: true }
  ];

  const bucketOptions = [
    { value: 'story-audio' as const, label: 'Audios', description: 'Generated story audio files' },
    { value: 'story-photos' as const, label: 'Photos', description: 'Story photo attachments' },
    { value: 'story-videos' as const, label: 'Videos', description: 'Story video files' },
    { value: 'icons' as const, label: 'Icons', description: 'UI icons and graphics' }
  ];

  // Load backup history and scheduled backups on component mount
  useEffect(() => {
    loadBackupHistory();
    loadScheduledBackups();
  }, []);

  const loadBackupHistory = async () => {
    try {
      setLoadingHistory(true);
      console.log('Loading backup history from storage...');
      
      const { data: files, error } = await supabase.storage
        .from('backups')
        .list('', { limit: 30, sortBy: { column: 'created_at', order: 'desc' } });

      if (error) {
        console.error('Error loading backup history:', error);
        toast.error(`Failed to load backup history: ${error.message}`);
        return;
      }

      console.log('Backup files found:', files?.length || 0, files);
      setBackupHistory(files || []);
      
      if (files?.length === 0) {
        console.log('No backup files found in storage bucket');
      }
    } catch (error) {
      console.error('Error loading backup history:', error);
      toast.error('Failed to load backup history');
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

  // Unified media backup functions
  const getBucketLabel = (bucket: string) => {
    const option = bucketOptions.find(opt => opt.value === bucket);
    return option?.label || bucket;
  };

  const generateManifest = async () => {
    setIsGenerating(true);
    try {
      const requestBody = {
        bucket: selectedBucket,
        mode: filterMode,
        sinceDate: filterMode === 'sinceDate' ? filterDate : undefined,
        minSizeBytes: sizeFilter === 'over5mb' ? 5 * 1024 * 1024 : 0,
        includeSignedUrls: true,
        expiresInSeconds: 172800 // 48 hours
      };

      console.log('Generating manifest with:', requestBody);

      const { data, error } = await supabase.functions.invoke('storage-manifest-signed-urls', {
        body: requestBody
      });

      if (error) {
        console.error('Manifest error:', error);
        const errorMsg = error.message || 'Unknown error occurred';
        const requestId = error.context?.request_id || 'N/A';
        toast.error(`Failed to generate ${getBucketLabel(selectedBucket).toLowerCase()} manifest: ${errorMsg} (Request ID: ${requestId})`);
        return;
      }

      if (!data) {
        toast.error('No data returned from manifest generation');
        return;
      }

      setManifest(data);
      setShowPreview(true);

      const errorInfo = data.totals?.errors > 0 ? ` (${data.totals.errors} errors)` : '';
      console.log(`Generated manifest: ${data.totals.count} files, ${data.totals.size_pretty}${errorInfo}`);
      
      if (data.totals?.errors > 0) {
        toast.warning(`Manifest generated with ${data.totals.errors} file errors - check logs for details`);
      } else {
        toast.success(`${getBucketLabel(selectedBucket)} manifest generated: ${data.totals.count} files`);
      }
      
    } catch (error) {
      console.error('Manifest generation error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`${getBucketLabel(selectedBucket)} manifest generation failed: ${errorMsg}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCSV = () => {
    if (!manifest?.entries) return;

    const csvContent = [
      // Header row
      'filename,url,size_bytes,size_pretty,updated_at,story_id,story_code,title',
      // Data rows
      ...manifest.entries.map((entry: any) => {
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
    
    const filterSuffix = filterMode === 'sinceDate' ? `_since_${filterDate}` : '_all';
    const filename = `${selectedBucket.replace('-', '_')}_manifest${filterSuffix}_${new Date().toISOString().slice(0, 10)}.csv`;
    
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`CSV downloaded: ${filename}`);
    setShowPreview(false);
  };

  const handleDownloadViaFilesClick = async () => {
    if (!manifest) {
      await generateManifest();
      return;
    }
    setShowDownloadConfirmation(true);
  };

  const downloadMediaViaFiles = async (manifestData: any) => {
    if (!manifestData?.entries?.length) {
      toast.error('No files to download');
      return;
    }

    try {
      setBrowserDownloadProgress({ total: 0, completed: 0, failed: 0, isActive: true });
      
      // Request directory picker
      const directoryHandle = await (window as any).showDirectoryPicker();
      
      const entries = manifestData.entries;
      setBrowserDownloadProgress(prev => ({ ...prev, total: entries.length }));
      
      const concurrency = 3; // Download 3 files at a time
      let completed = 0;
      let failed = 0;
      
      for (let i = 0; i < entries.length; i += concurrency) {
        const batch = entries.slice(i, i + concurrency);
        
        await Promise.allSettled(
          batch.map(async (entry: any) => {
            try {
              const response = await fetch(entry.signed_url);
              if (!response.ok) throw new Error(`HTTP ${response.status}`);
              
              const blob = await response.blob();
              const filename = entry.custom_filename || entry.filename;
              const fileHandle = await directoryHandle.getFileHandle(filename, { create: true });
              const writable = await fileHandle.createWritable();
              await writable.write(blob);
              await writable.close();
              
              completed++;
            } catch (error) {
              console.error(`Failed to download ${entry.filename}:`, error);
              failed++;
            }
            
            setBrowserDownloadProgress(prev => ({ 
              ...prev, 
              completed: completed, 
              failed: failed 
            }));
          })
        );
      }
      
      // Final update
      setBrowserDownloadProgress(prev => ({ ...prev, isActive: false }));
      
      if (failed === 0) {
        toast.success(`Successfully downloaded ${completed} ${getBucketLabel(selectedBucket).toLowerCase()} files to your selected folder`);
      } else {
        toast.warning(`Downloaded ${completed} files, ${failed} failed`);
      }
      
    } catch (error) {
      console.error('Browser download error:', error);
      setBrowserDownloadProgress(prev => ({ ...prev, isActive: false }));
      
      if (error instanceof Error && error.name === 'AbortError') {
        toast.error('Download cancelled by user');
      } else {
        toast.error('Failed to download files via browser');
      }
    }
  };

  const downloadMediaAsZip = async (manifestData: any) => {
    if (!manifestData?.entries?.length) {
      toast.error('No files to download');
      return;
    }

    try {
      setBrowserDownloadProgress({ total: 0, completed: 0, failed: 0, isActive: true });
      
      const entries = manifestData.entries;
      setBrowserDownloadProgress(prev => ({ ...prev, total: entries.length }));
      
      const zip = new JSZip();
      
      let completed = 0;
      let failed = 0;
      
      // Download files in batches
      const concurrency = 5;
      for (let i = 0; i < entries.length; i += concurrency) {
        const batch = entries.slice(i, i + concurrency);
        
        await Promise.allSettled(
          batch.map(async (entry: any) => {
            try {
              const response = await fetch(entry.signed_url);
              if (!response.ok) throw new Error(`HTTP ${response.status}`);
              
              const blob = await response.blob();
              const filename = entry.custom_filename || entry.filename;
              zip.file(filename, blob);
              
              completed++;
            } catch (error) {
              console.error(`Failed to add ${entry.filename} to ZIP:`, error);
              failed++;
            }
            
            setBrowserDownloadProgress(prev => ({ 
              ...prev, 
              completed: completed, 
              failed: failed 
            }));
          })
        );
      }
      
      // Generate and download ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      
      const filterSuffix = filterMode === 'sinceDate' ? `_since_${filterDate}` : '_all';
      const filename = `${selectedBucket.replace('-', '_')}_backup${filterSuffix}_${new Date().toISOString().slice(0, 10)}.zip`;
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setBrowserDownloadProgress(prev => ({ ...prev, isActive: false }));
      
      if (failed === 0) {
        toast.success(`Successfully created ZIP with ${completed} ${getBucketLabel(selectedBucket).toLowerCase()} files`);
      } else {
        toast.warning(`Created ZIP with ${completed} files, ${failed} failed`);
      }
      
    } catch (error) {
      console.error('ZIP creation error:', error);
      setBrowserDownloadProgress(prev => ({ ...prev, isActive: false }));
      toast.error('Failed to create ZIP file');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Backup Center</h1>
        <Badge variant="secondary">Admin Tools</Badge>
      </div>

      {/* Full System Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Full System Backup
          </CardTitle>
          <CardDescription>
            Create a comprehensive backup including database and all storage buckets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Creates a complete backup of your entire GPA Stories system, including the database 
            and all file storage. The backup is packaged as a downloadable ZIP file.
          </p>
          <Button 
            onClick={handleFullBackupDownload}
            disabled={isCreatingFullBackup}
            className="w-full"
          >
            {isCreatingFullBackup ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Full Backup...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Create Full Backup
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Automated Nightly Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Automated Nightly Backup
          </CardTitle>
          <CardDescription>
            Run the automated backup process that saves to cloud storage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              This creates a backup in the cloud storage bucket for automated retention. 
              The backup includes database and storage files.
            </p>
            
            {!loadingSchedule && scheduledBackups.length > 0 && (
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm font-medium">Scheduled Backup Status:</p>
                {scheduledBackups.map((job, index) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    {job.jobname}: {job.active ? 'Active' : 'Inactive'} - {job.schedule}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleNightlyBackup}
            disabled={isRunningNightlyBackup}
            variant="outline"
            className="w-full"
          >
            {isRunningNightlyBackup ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Nightly Backup...
              </>
            ) : (
              <>
                <Clock className="mr-2 h-4 w-4" />
                Run Nightly Backup Now
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Database Only Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Only Backup
          </CardTitle>
          <CardDescription>
            Export only the database content and schema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Creates a backup of just the database, including all tables, data, schema definitions, 
            and RLS policies. Does not include storage bucket files.
          </p>
          <Button 
            onClick={handleDatabaseBackup}
            disabled={isExportingDb}
            variant="outline"
            className="w-full"
          >
            {isExportingDb ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting Database...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Export Database
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Media & Assets Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Media & Assets Backup
          </CardTitle>
          <CardDescription>
            Download files from individual storage buckets with advanced options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bucket Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select Media Type</Label>
            <RadioGroup value={selectedBucket} onValueChange={(value) => setSelectedBucket(value as any)}>
              {bucketOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                    <div className="text-sm font-medium">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Filter Controls */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Filter Options</Label>
            <RadioGroup value={filterMode} onValueChange={(value) => setFilterMode(value as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="cursor-pointer">All files</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sinceDate" id="sinceDate" />
                <Label htmlFor="sinceDate" className="cursor-pointer">Updated after date</Label>
              </div>
            </RadioGroup>
            
            {filterMode === 'sinceDate' && (
              <div className="ml-6">
                <Input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-48"
                />
              </div>
            )}
          </div>

          {/* Size Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">File Size Filter</Label>
            <RadioGroup value={sizeFilter} onValueChange={(value) => setSizeFilter(value as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="size-all" />
                <Label htmlFor="size-all" className="cursor-pointer">All files</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="over5mb" id="size-over5mb" />
                <Label htmlFor="size-over5mb" className="cursor-pointer">Files over 5 MB only</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              onClick={generateManifest}
              disabled={isGenerating || (filterMode === 'sinceDate' && !filterDate)}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-4 w-4" />
              )}
              Get Download Links (CSV)
            </Button>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleDownloadViaFilesClick}
                    disabled={isGenerating || (filterMode === 'sinceDate' && !filterDate) || !isBrowserDownloadAvailable}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <FolderDown className="h-4 w-4" />
                    Download via Browser
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {!isBrowserDownloadAvailable ? (
                    isInCrossOriginFrame ? 
                      "Not available in iframe. Open in new tab." :
                      "Requires Chrome/Edge browser for direct folder download"
                  ) : (
                    "Download files directly to a folder of your choice"
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              onClick={async () => {
                if (!manifest) {
                  await generateManifest();
                  // The generateManifest function will generate the manifest,
                  // and the user can then click the button again to download
                } else {
                  await downloadMediaAsZip(manifest);
                }
              }}
              disabled={isGenerating || (filterMode === 'sinceDate' && !filterDate)}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download as ZIP
            </Button>
          </div>

          {/* Progress Display */}
          {browserDownloadProgress.isActive && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Downloading {getBucketLabel(selectedBucket).toLowerCase()} files...</span>
                <span>{browserDownloadProgress.completed}/{browserDownloadProgress.total}</span>
              </div>
              <Progress 
                value={(browserDownloadProgress.completed / browserDownloadProgress.total) * 100} 
                className="w-full"
              />
              {browserDownloadProgress.failed > 0 && (
                <p className="text-sm text-destructive">
                  {browserDownloadProgress.failed} files failed to download
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Backup History
          </CardTitle>
          <CardDescription>
            Recent backups stored in cloud storage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingHistory ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : backupHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No backup history found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Automatic backups will appear here once created
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {backupHistory.map((file, index) => {
                const isAutoBackup = file.name.includes('full_backup');
                const isNightlyBackup = file.name.includes('nightly') || isAutoBackup;
                const fileSize = file.metadata?.size ? (file.metadata.size / 1024 / 1024).toFixed(1) : '0';
                
                return (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{file.name}</p>
                        {isNightlyBackup && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Automatic
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(file.created_at).toLocaleString()} • {fileSize} MB
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadBackupFromHistory(file.name)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                 );
               })}
            </div>
          )}
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

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Files Preview — {getBucketLabel(selectedBucket)}</DialogTitle>
            <DialogDescription>
              {manifest && (
                <>
                  Found {manifest.totals.count} files • {manifest.totals.size_pretty}
                  {filterMode === 'sinceDate' && (
                    <> • Updated after {filterDate}</>
                  )}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {manifest && (
            <div className="space-y-4">
              <div className="max-h-60 overflow-y-auto border rounded-md p-3">
                <div className="text-sm font-medium mb-2">First 10 files:</div>
                {manifest.entries.slice(0, 10).map((entry: any, index: number) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    {entry.custom_filename || entry.filename} • {(entry.size_bytes / 1024 / 1024).toFixed(2)} MB
                  </div>
                ))}
                {manifest.entries.length > 10 && (
                  <div className="text-sm text-muted-foreground font-medium">
                    ... and {manifest.entries.length - 10} more files
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={downloadCSV}>
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Download CSV
            </Button>
            <Button variant="outline" onClick={() => downloadMediaAsZip(manifest)}>
              <Download className="w-4 h-4 mr-2" />
              Download as ZIP
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    disabled={!isBrowserDownloadAvailable}
                    onClick={() => {
                      setShowPreview(false);
                      setShowDownloadConfirmation(true);
                    }}
                  >
                    <FolderDown className="w-4 h-4 mr-2" />
                    Download via Browser
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {!isBrowserDownloadAvailable ? (
                    isInCrossOriginFrame ? 
                      "Not available in iframe. Open in new tab." :
                      "Requires Chrome/Edge browser"
                  ) : (
                    "Download directly to folder"
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={showDownloadConfirmation} onOpenChange={setShowDownloadConfirmation}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Confirm Download — {getBucketLabel(selectedBucket)}</DialogTitle>
            <DialogDescription>
              {manifest && (
                <>
                  Ready to download {manifest.totals.count} files ({manifest.totals.size_pretty})
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {manifest && (
            <div className="space-y-4">
              <div className="max-h-40 overflow-y-auto border rounded-md p-3">
                <div className="text-sm font-medium mb-2">Files to download:</div>
                {manifest.entries.slice(0, 10).map((entry: any, index: number) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    {entry.custom_filename || entry.filename}
                  </div>
                ))}
                {manifest.entries.length > 10 && (
                  <div className="text-sm text-muted-foreground font-medium">
                    ... and {manifest.entries.length - 10} more
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter className="flex flex-col gap-2">
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowDownloadConfirmation(false);
                  downloadMediaAsZip(manifest);
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download as ZIP (Recommended)
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="flex-1"
                      disabled={!isBrowserDownloadAvailable}
                      onClick={() => {
                        setShowDownloadConfirmation(false);
                        downloadMediaViaFiles(manifest);
                      }}
                    >
                      <FolderDown className="w-4 h-4 mr-2" />
                      Download to Folder
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {!isBrowserDownloadAvailable ? (
                      isInCrossOriginFrame ? 
                        "Not available in iframe. Open in new tab." :
                        "Requires Chrome/Edge browser"
                    ) : (
                      "Choose folder to save files"
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setShowDownloadConfirmation(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};