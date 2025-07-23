import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface IconLibraryItem {
  id: string;
  icon_code: string;
  icon_name: string;
  file_path: string;
  created_at: string;
  updated_at: string;
}

const IconLibraryDisplay = () => {
  const { data: icons, isLoading, error } = useQuery({
    queryKey: ['icon-library'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('icon_library')
        .select('*')
        .order('icon_code', { ascending: true });

      if (error) throw error;
      return data as IconLibraryItem[];
    },
  });

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
    return supabase.storage.from('icons').getPublicUrl(filePath).data.publicUrl;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Icon Library
          <Badge variant="secondary">{icons?.length || 0} icons</Badge>
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