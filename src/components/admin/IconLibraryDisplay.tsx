import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

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

  const handleRefresh = async () => {
    console.log('🔄 Manual refresh triggered');
    await queryClient.invalidateQueries({ queryKey: ['icon-library'] });
    refetch();
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
                className="border rounded-lg p-4 text-center hover:shadow-md transition-shadow"
              >
                <div className="flex justify-center items-center h-16 mb-3">
                  <img
                    src={getIconUrl(icon.file_path)}
                    alt={icon.icon_name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Im0xMiAxNS01LTUtNSA1IiBzdHJva2U9IiM5Y2EzYWYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-sm font-bold text-primary">
                    {icon.icon_code}
                  </p>
                  <p className="text-sm text-foreground">
                    {icon.icon_name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IconLibraryDisplay;