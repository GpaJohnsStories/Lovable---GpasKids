
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Wifi, WifiOff, AlertTriangle, Clock } from "lucide-react";
import { useState } from "react";

const SessionStatusIndicator = () => {
  const { session, isLoading, isRecovering, isNewTab, lastActiveTab, forceRefresh } = useEnhancedAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await forceRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  if (isLoading) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <div className="animate-spin rounded-full h-3 w-3 border border-current border-t-transparent" />
        Checking...
      </Badge>
    );
  }

  if (isNewTab) {
    return (
      <Badge variant="outline" className="flex items-center gap-1 text-blue-600 border-blue-200">
        <Clock className="h-3 w-3 animate-pulse" />
        Syncing Tab
      </Badge>
    );
  }

  if (isRecovering) {
    return (
      <Badge variant="outline" className="flex items-center gap-1 text-amber-600 border-amber-200">
        <RefreshCw className="h-3 w-3 animate-spin" />
        Recovering
      </Badge>
    );
  }

  if (!session) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <WifiOff className="h-3 w-3" />
        Disconnected
      </Badge>
    );
  }

  const isSessionHealthy = session && !isRecovering;
  const showLastActiveTab = lastActiveTab && lastActiveTab !== session?.user?.id;

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={isSessionHealthy ? "default" : "secondary"} 
        className="flex items-center gap-1"
      >
        <Wifi className="h-3 w-3" />
        Connected
      </Badge>
      
      {showLastActiveTab && (
        <Badge variant="outline" className="text-xs">
          Synced from tab
        </Badge>
      )}
      
      <Button
        size="sm"
        variant="ghost"
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="h-6 px-2"
      >
        <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
};

export default SessionStatusIndicator;
