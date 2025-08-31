import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Database, HardDrive } from 'lucide-react';
import { useIconCache } from '@/contexts/IconCacheContext';
import { iconCacheService } from '@/services/IconCacheService';
import { useToast } from "@/hooks/use-toast";
import { ConnectionTestPanel } from './ConnectionTestPanel';

export const DiagnosticsAdminPanel: React.FC = () => {
  const { cacheStats, refreshStats } = useIconCache();
  const { toast } = useToast();

  const handleRefreshIconCache = async () => {
    try {
      iconCacheService.refreshAllIcons();
      refreshStats();
      toast({
        title: "Icon Cache Refreshed",
        description: "All icons will be reloaded with fresh data on next access.",
      });
    } catch (error) {
      toast({
        title: "Cache Refresh Failed",
        description: "Failed to refresh icon cache. Check console for details.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <ConnectionTestPanel />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Icon Cache Diagnostics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{cacheStats.size}</div>
              <div className="text-sm text-muted-foreground">Cached Icons</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{cacheStats.maxSize}</div>
              <div className="text-sm text-muted-foreground">Max Cache Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{cacheStats.loadingCount}</div>
              <div className="text-sm text-muted-foreground">Currently Loading</div>
            </div>
            <div className="text-center">
              <Badge variant={cacheStats.size > 0 ? "default" : "secondary"}>
                {cacheStats.size > 0 ? "Active" : "Empty"}
              </Badge>
              <div className="text-sm text-muted-foreground mt-1">Cache Status</div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleRefreshIconCache} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Icon Cache
            </Button>
          </div>
          
          {cacheStats.keys.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Cached Icon Keys ({cacheStats.keys.length})</h4>
              <div className="max-h-32 overflow-y-auto text-xs text-muted-foreground">
                {cacheStats.keys.map((key, index) => (
                  <div key={index} className="py-1 border-b border-border/30 last:border-0">
                    {key}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Diagnostics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Additional diagnostic tools and system health checks.</p>
        </CardContent>
      </Card>
    </div>
  );
};