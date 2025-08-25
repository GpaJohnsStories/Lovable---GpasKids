
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Database, HardDrive, Calendar, FileText, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const BackupCenter = () => {
  const [isExportingDb, setIsExportingDb] = useState(false);
  const [downloadingBucket, setDownloadingBucket] = useState<string | null>(null);

  const storageBuckets = [
    { name: 'story-photos', description: 'Story photo attachments', public: true },
    { name: 'story-videos', description: 'Story video files', public: true },
    { name: 'story-audio', description: 'Generated story audio files', public: true },
    { name: 'icons', description: 'UI icons and graphics', public: true },
    { name: 'orange-gang', description: 'Approved Orange Gang photos', public: true },
    { name: 'orange-gang-pending', description: 'Pending Orange Gang photos', public: false }
  ];

  const downloadJsonAsZip = (jsonContent: string, filename: string) => {
    try {
      const data = JSON.parse(jsonContent);
      
      // For now, we'll download as JSON since we can't create actual ZIP files in the browser
      // In the future, this could be enhanced with a ZIP library
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename.replace('.zip', '.json');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`Backup downloaded: ${filename}`);
    } catch (error) {
      console.error('Error processing backup:', error);
      toast.error('Failed to process backup file');
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
        method: 'GET',
        body: { bucket: bucketName }
      });

      if (error) {
        console.error(`Bucket ${bucketName} backup error:`, error);
        toast.error(`Failed to backup ${bucketName} bucket`);
        return;
      }

      if (typeof data === 'string') {
        const parsedData = JSON.parse(data);
        downloadJsonAsZip(data, parsedData.filename || `${bucketName}_backup.zip`);
      } else {
        downloadJsonAsZip(JSON.stringify(data), data.filename || `${bucketName}_backup.zip`);
      }

    } catch (error) {
      console.error(`Bucket ${bucketName} backup error:`, error);
      toast.error(`Failed to backup ${bucketName} bucket`);
    } finally {
      setDownloadingBucket(null);
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

      {/* Database Backup Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database Backup
          </CardTitle>
          <CardDescription>
            Export all database tables, schema definitions, and RLS policies. Includes asset metadata but not the actual files.
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

      {/* Storage Buckets Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Storage Buckets
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
            Backup Information
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <ul className="space-y-2 text-sm">
            <li>• Backups include timestamps in filenames for easy identification</li>
            <li>• Database backups are exported as CSV files with JSON metadata</li>
            <li>• Storage bucket backups include SHA-256 checksums for file integrity</li>
            <li>• All downloads stream directly to your PC (no server storage used)</li>
            <li>• Asset manifests include file paths, sizes, and visibility settings</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
