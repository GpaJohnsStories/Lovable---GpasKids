import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { RefreshCw, Trash2, Edit3 } from 'lucide-react';
import { toast } from 'sonner';

interface IconLibraryItem {
  id: string;
  icon_code: string;
  icon_name: string;
  file_path: string;
  created_at: string;
  updated_at: string;
}

const IconLibraryDisplay = () => {
  const queryClient = useQueryClient();
  const [replaceDialogOpen, setReplaceDialogOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<IconLibraryItem | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  
  const { data: icons, isLoading, error, refetch } = useQuery({
    queryKey: ['icon-library'],
    queryFn: async () => {
      console.log('🔍 Fetching icon library data...');
      const { data, error } = await supabase
        .from('icon_library')
        .select('*')
        .order('icon_code', { ascending: true });

      if (error) {
        console.error('❌ Error fetching icon library:', error);
        throw error;
      }
      
      console.log('✅ Icon library data fetched:', data);
      console.log('📊 Total icons found:', data?.length || 0);
      return data as IconLibraryItem[];
    },
    staleTime: 0, // Always refetch to get latest data
    gcTime: 0, // Don't cache for debugging
  });

  // Delete icon mutation
  const deleteMutation = useMutation({
    mutationFn: async (icon: IconLibraryItem) => {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('icons')
        .remove([icon.file_path]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
        // Don't throw here, still try to delete from database
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('icon_library')
        .delete()
        .eq('id', icon.id);

      if (dbError) {
        throw new Error(`Database delete failed: ${dbError.message}`);
      }

      return icon;
    },
    onSuccess: (deletedIcon) => {
      toast.success(`Icon "${deletedIcon.icon_name}" deleted successfully!`);
      queryClient.invalidateQueries({ queryKey: ['icon-library'] });
    },
    onError: (error) => {
      toast.error(`Delete failed: ${error.message}`);
    },
  });

  // Replace icon mutation
  const replaceMutation = useMutation({
    mutationFn: async ({ icon, file }: { icon: IconLibraryItem, file: File }) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${icon.icon_code}.${fileExt}`;
      
      // Upload new file to storage (overwrite)
      const { error: uploadError } = await supabase.storage
        .from('icons')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Update database record with new file path if extension changed
      if (fileName !== icon.file_path) {
        const { error: dbError } = await supabase
          .from('icon_library')
          .update({ file_path: fileName, updated_at: new Date().toISOString() })
          .eq('id', icon.id);

        if (dbError) {
          throw new Error(`Database update failed: ${dbError.message}`);
        }
      }

      return { icon, fileName };
    },
    onSuccess: (data) => {
      toast.success(`Icon "${data.icon.icon_name}" replaced successfully!`);
      setReplaceDialogOpen(false);
      setSelectedIcon(null);
      setNewFile(null);
      queryClient.invalidateQueries({ queryKey: ['icon-library'] });
    },
    onError: (error) => {
      toast.error(`Replace failed: ${error.message}`);
    },
  });

  const handleRefresh = async () => {
    console.log('🔄 Manual refresh triggered');
    await queryClient.invalidateQueries({ queryKey: ['icon-library'] });
    refetch();
  };

  const handleDelete = (icon: IconLibraryItem) => {
    deleteMutation.mutate(icon);
  };

  const handleReplace = (icon: IconLibraryItem) => {
    setSelectedIcon(icon);
    setReplaceDialogOpen(true);
  };

  const handleReplaceSubmit = () => {
    if (!selectedIcon || !newFile) {
      toast.error('Please select a file');
      return;
    }

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!validTypes.includes(newFile.type)) {
      toast.error('Please select a valid image file (PNG, JPG, JPEG, or SVG)');
      return;
    }
    
    // Validate file size (max 2MB)
    if (newFile.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    replaceMutation.mutate({ icon: selectedIcon, file: newFile });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewFile(file);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Icon Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-muted h-20 rounded mb-2"></div>
                <div className="bg-muted h-4 rounded mb-1"></div>
                <div className="bg-muted h-3 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Icon Library</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Error loading icons: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const getIconUrl = (filePath: string) => {
    const url = supabase.storage.from('icons').getPublicUrl(filePath).data.publicUrl;
    console.log(`🖼️ Icon URL for ${filePath}:`, url);
    return url;
  };

  // Safe icon URL with fallback to ICO-N2K
  const getSafeIconUrl = (filePath: string) => {
    try {
      return getIconUrl(filePath);
    } catch (error) {
      console.warn(`Failed to load icon ${filePath}, falling back to ICO-N2K.png`);
      return getIconUrl('ICO-N2K.png');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Icon Library
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{icons?.length || 0} icons</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="h-8"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!icons || icons.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No icons found in the library
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {icons.map((icon) => (
              <div
                key={icon.id}
                className="border rounded-lg p-4 text-center hover:shadow-md transition-shadow group"
              >
                <div className="flex justify-center items-center h-16 mb-3">
                  <img
                    src={getSafeIconUrl(icon.file_path)}
                    alt={icon.icon_name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      console.warn(`Failed to load icon ${icon.file_path}, setting fallback`);
                      e.currentTarget.src = getSafeIconUrl('ICO-N2K.png');
                    }}
                  />
                </div>
                <div className="space-y-1 mb-3">
                  <p className="font-mono text-sm font-bold text-primary">
                    {icon.icon_code}
                  </p>
                  <p className="text-sm text-foreground">
                    {icon.file_path}
                  </p>
                </div>
                
                {/* Action buttons - visible on hover */}
                <div className="flex justify-center gap-2 transition-opacity">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReplace(icon)}
                    className="h-8 px-2"
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Icon</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{icon.icon_name}" ({icon.icon_code})? 
                          This action cannot be undone and will remove both the file and database entry.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(icon)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Replace Icon Dialog */}
        <Dialog open={replaceDialogOpen} onOpenChange={setReplaceDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Replace Icon</DialogTitle>
            </DialogHeader>
            {selectedIcon && (
              <div className="space-y-4">
                <div className="text-center">
                  <img
                    src={getSafeIconUrl(selectedIcon.file_path)}
                    alt={selectedIcon.icon_name}
                    className="max-w-20 max-h-20 object-contain mx-auto mb-2"
                  />
                  <p className="font-mono text-sm font-bold text-primary">
                    {selectedIcon.icon_code}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedIcon.icon_name}
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="replaceFile">New Icon File</Label>
                  <Input
                    id="replaceFile"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1"
                  />
                  {newFile && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Selected: {newFile.name} ({(newFile.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setReplaceDialogOpen(false);
                      setSelectedIcon(null);
                      setNewFile(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleReplaceSubmit}
                    disabled={!newFile || replaceMutation.isPending}
                  >
                    {replaceMutation.isPending ? 'Replacing...' : 'Replace Icon'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default IconLibraryDisplay;