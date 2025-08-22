import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { RefreshCw, Trash2, Edit3, ChevronUp, ChevronDown, Search, X } from 'lucide-react';
import { toast } from 'sonner';

interface IconLibraryItem {
  file_name_path: string;
  icon_name: string;
  label?: string | null;
  created_at: string;
  updated_at: string;
  usage_locations?: Array<{
    component: string;
    location: string;
    context: string;
  }>;
}

type SortColumn = 'file_name_path' | 'icon_name' | 'usage_locations';
type SortDirection = 'asc' | 'desc';

const IconLibraryDisplay = () => {
  const queryClient = useQueryClient();
  const [replaceDialogOpen, setReplaceDialogOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<IconLibraryItem | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn>('file_name_path');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: icons, isLoading, error, refetch } = useQuery({
    queryKey: ['icon-library'],
    queryFn: async () => {
      console.log('🔍 Fetching icon library data...');
      const { data, error } = await supabase
        .from('icon_library')
        .select('*')
        .order('icon_name', { ascending: true });

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
      console.log(`🗑️ Starting deletion of icon: ${icon.file_name_path}`);
      
      // First check if file exists in storage
      const { data: existingFiles } = await supabase.storage
        .from('icons')
        .list('', { search: icon.file_name_path });
      
      const fileExists = existingFiles?.some(file => file.name === icon.file_name_path);
      console.log(`📁 File exists in storage: ${fileExists}`);

      // Delete from storage if file exists
      if (fileExists) {
        const { error: storageError } = await supabase.storage
          .from('icons')
          .remove([icon.file_name_path]);

        if (storageError) {
          console.error('❌ Storage delete failed:', storageError);
          throw new Error(`Failed to delete file from storage: ${storageError.message}`);
        }

        // Verify the file was actually deleted
        const { data: verifyFiles } = await supabase.storage
          .from('icons')
          .list('', { search: icon.file_name_path });
        
        const stillExists = verifyFiles?.some(file => file.name === icon.file_name_path);
        if (stillExists) {
          throw new Error('File still exists in storage after deletion attempt');
        }
        
        console.log('✅ File successfully deleted from storage');
      } else {
        console.log('⚠️ File does not exist in storage, proceeding with database deletion');
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('icon_library')
        .delete()
        .eq('file_name_path', icon.file_name_path);

      if (dbError) {
        throw new Error(`Database delete failed: ${dbError.message}`);
      }

      console.log('✅ Database record deleted successfully');
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
      const baseName = icon.file_name_path.split('.')[0];
      const fileName = `${baseName}.${fileExt}`;
      
      // Upload new file to storage (overwrite)
      const { error: uploadError } = await supabase.storage
        .from('icons')
        .upload(fileName, file, {
          cacheControl: '0', // Disable caching to force refresh
          upsert: true
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Update database record with new file path if extension changed
      if (fileName !== icon.file_name_path) {
        const { error: dbError } = await supabase
          .from('icon_library')
          .update({ file_name_path: fileName, updated_at: new Date().toISOString() })
          .eq('file_name_path', icon.file_name_path);

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

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Filter and sort icons
  const filteredAndSortedIcons = icons 
    ? [...icons]
        .filter(icon => {
          if (!searchTerm) return true;
          const searchLower = searchTerm.toLowerCase();
          return (
            icon.file_name_path.toLowerCase().includes(searchLower) ||
            icon.icon_name.toLowerCase().includes(searchLower) ||
            icon.usage_locations?.some(location => 
              location.location.toLowerCase().includes(searchLower) ||
              location.component.toLowerCase().includes(searchLower)
            )
          );
        })
        .sort((a, b) => {
          let aValue: string;
          let bValue: string;

          switch (sortColumn) {
            case 'file_name_path':
              aValue = a.file_name_path;
              bValue = b.file_name_path;
              break;
            case 'icon_name':
              aValue = a.icon_name;
              bValue = b.icon_name;
              break;
            case 'usage_locations':
              aValue = a.usage_locations?.[0]?.location || '';
              bValue = b.usage_locations?.[0]?.location || '';
              break;
            default:
              return 0;
          }

          if (sortDirection === 'asc') {
            return aValue.localeCompare(bValue);
          } else {
            return bValue.localeCompare(aValue);
          }
        })
    : [];

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const SortableHeader = ({ column, children }: { column: SortColumn; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50 select-none"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-2">
        {children}
        <div className="flex flex-col">
          <ChevronUp 
            className={`h-3 w-3 ${
              sortColumn === column && sortDirection === 'asc' 
                ? 'text-primary' 
                : 'text-muted-foreground/30'
            }`} 
          />
          <ChevronDown 
            className={`h-3 w-3 -mt-1 ${
              sortColumn === column && sortDirection === 'desc' 
                ? 'text-primary' 
                : 'text-muted-foreground/30'
            }`} 
          />
        </div>
      </div>
    </TableHead>
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Icon Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-16 bg-muted rounded"></div>
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
          <span>Icon Library</span>
          <div className="flex items-center gap-4">
            {/* Search Box */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Search icons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 w-64 h-8 text-sm border-2 border-[#8B4513]"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSearch}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {searchTerm 
                  ? `${filteredAndSortedIcons.length} of ${icons?.length || 0}` 
                  : `${icons?.length || 0} icons`
                }
              </Badge>
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
          </div>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Click column headers to sort. Shows exact locations where each icon is used.
        </p>
      </CardHeader>
      <CardContent>
        {!icons || icons.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No icons found in the library
          </div>
        ) : (
          <Table style={{ backgroundColor: '#FFF8DC' }}>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Icon</TableHead>
                <SortableHeader column="file_name_path">
                  <span className="font-bold">File Name Path</span>
                </SortableHeader>
                <SortableHeader column="icon_name">
                  <span className="font-bold">Icon Name</span>
                </SortableHeader>
                <SortableHeader column="usage_locations">
                  <span className="font-bold">Used In</span>
                </SortableHeader>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedIcons.map((icon) => (
                <TableRow key={icon.file_name_path} className="h-16">
                  <TableCell className="p-2">
                    <div className="w-14 h-14 flex items-center justify-center border rounded">
                      <img
                        src={getSafeIconUrl(icon.file_name_path)}
                        alt={icon.icon_name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          console.warn(`Failed to load icon ${icon.file_name_path}, setting fallback`);
                          e.currentTarget.src = getSafeIconUrl('ICO-N2K.png');
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">
                    {icon.file_name_path}
                  </TableCell>
                  <TableCell>
                    {icon.icon_name}
                  </TableCell>
                  <TableCell>
                    {icon.usage_locations && icon.usage_locations.length > 0 ? (
                      <div className="space-y-1">
                        {icon.usage_locations.map((usage, idx) => (
                          <div key={idx} className="text-sm">
                            {usage.location}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Not assigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReplace(icon)}
                        className="h-8"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Icon</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{icon.icon_name}"? 
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
                     src={getSafeIconUrl(selectedIcon.file_name_path)}
                     alt={selectedIcon.icon_name}
                     className="max-w-20 max-h-20 object-contain mx-auto mb-2"
                   />
                   <p className="font-mono text-sm font-bold text-primary">
                     {selectedIcon.icon_name}
                   </p>
                   <p className="text-sm text-muted-foreground">
                     {selectedIcon.file_name_path}
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