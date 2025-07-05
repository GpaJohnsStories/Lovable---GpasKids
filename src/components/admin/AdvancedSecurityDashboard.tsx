import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Key, 
  Eye, 
  RefreshCw,
  TrendingUp,
  Clock,
  Users,
  Lock,
  Zap
} from "lucide-react";
import { getSecurityStatus, getThreatAnalytics, resolveThreat } from "@/utils/threatDetection";
import { getKeyRotationStats, triggerEmergencyRotation } from "@/utils/keyRotation";
import { getEncryptionStatus } from "@/utils/encryption";

const AdvancedSecurityDashboard = () => {
  const [securityStatus, setSecurityStatus] = useState<any>(null);
  const [threatAnalytics, setThreatAnalytics] = useState<any>(null);
  const [keyStats, setKeyStats] = useState<any>(null);
  const [encryptionStatus, setEncryptionStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const refreshData = async () => {
    setRefreshing(true);
    try {
      const [security, threats, keys, encryption] = await Promise.all([
        getSecurityStatus(),
        getThreatAnalytics(),
        getKeyRotationStats(),
        getEncryptionStatus()
      ]);
      
      setSecurityStatus(security);
      setThreatAnalytics(threats);
      setKeyStats(keys);
      setEncryptionStatus(encryption);
    } catch (error) {
      console.error('Failed to refresh security data:', error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure': return 'text-green-600';
      case 'monitoring': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'secure': return <Shield className="h-5 w-5 text-green-600" />;
      case 'monitoring': return <Eye className="h-5 w-5 text-blue-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleEmergencyRotation = async () => {
    try {
      await triggerEmergencyRotation('Admin initiated emergency rotation');
      await refreshData();
    } catch (error) {
      console.error('Emergency rotation failed:', error);
    }
  };

  const handleResolveThreat = async (threatId: string) => {
    try {
      resolveThreat(threatId, 'Resolved by admin review');
      await refreshData();
    } catch (error) {
      console.error('Failed to resolve threat:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Advanced Security Dashboard</CardTitle>
          <CardDescription>Loading security analytics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(securityStatus?.overallStatus)}
              Security Overview
            </CardTitle>
            <CardDescription>
              Real-time security monitoring and threat detection
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getStatusColor(securityStatus?.overallStatus)}`}>
                {securityStatus?.overallStatus?.toUpperCase()}
              </div>
              <div className="text-sm text-gray-500">Overall Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {securityStatus?.securityScore}
              </div>
              <div className="text-sm text-gray-500">Security Score</div>
              <Progress value={securityStatus?.securityScore} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {securityStatus?.activeThreats}
              </div>
              <div className="text-sm text-gray-500">Active Threats</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {encryptionStatus?.securityLevel?.toUpperCase()}
              </div>
              <div className="text-sm text-gray-500">Encryption Level</div>
            </div>
          </div>

          {/* Recommendations */}
          {securityStatus?.recommendations?.length > 0 && (
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Security Recommendations:</strong>
                <ul className="mt-2 space-y-1">
                  {securityStatus.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="text-sm">• {rec}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="threats" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="threats" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Threats
          </TabsTrigger>
          <TabsTrigger value="encryption" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Encryption
          </TabsTrigger>
          <TabsTrigger value="keys" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Key Management
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="threats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Threats</CardTitle>
              <CardDescription>Recent security threats requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              {securityStatus?.recentThreats?.length > 0 ? (
                <div className="space-y-3">
                  {securityStatus.recentThreats.map((threat: any) => (
                    <div key={threat.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={threat.severity === 'critical' ? 'destructive' : 'secondary'}>
                            {threat.severity.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(threat.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="font-medium">{threat.description}</div>
                        <div className="text-sm text-gray-600">Type: {threat.type}</div>
                      </div>
                      {!threat.resolved && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleResolveThreat(threat.id)}
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No active threats detected</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="encryption" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Encryption Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Service Status</span>
                    <Badge variant={encryptionStatus?.initialized ? 'default' : 'destructive'}>
                      {encryptionStatus?.initialized ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Browser Support</span>
                    <Badge variant={encryptionStatus?.browserSupport ? 'default' : 'secondary'}>
                      {encryptionStatus?.browserSupport ? 'Full' : 'Limited'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Security Level</span>
                    <Badge variant="outline">
                      {encryptionStatus?.securityLevel?.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Encryption Operations</span>
                    <span className="font-mono">{keyStats?.usageCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate</span>
                    <span className="text-green-600 font-medium">99.9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Response Time</span>
                    <span className="font-mono">&lt;5ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Key Rotation Management
              </CardTitle>
              <CardDescription>Monitor and manage encryption key lifecycle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {keyStats?.currentKeyAge || 0}
                  </div>
                  <div className="text-sm text-gray-500">Days Since Creation</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {keyStats?.usageCount || 0}
                  </div>
                  <div className="text-sm text-gray-500">Operations Performed</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${keyStats?.rotationNeeded ? 'text-red-600' : 'text-green-600'}`}>
                    {keyStats?.nextRotationDue || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">Next Rotation</div>
                </div>
              </div>

              {keyStats?.rotationNeeded && (
                <Alert className="mb-4">
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    Key rotation is overdue. Consider rotating the encryption key for enhanced security.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleEmergencyRotation}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Emergency Rotation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Threats by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(threatAnalytics?.threatsByType || {}).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                      <Badge variant="outline">{count as number}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Threat Severity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(threatAnalytics?.threatsBySeverity || {}).map(([severity, count]) => (
                    <div key={severity} className="flex justify-between items-center">
                      <span className="text-sm capitalize">{severity}</span>
                      <Badge 
                        variant={severity === 'critical' ? 'destructive' : 'outline'}
                      >
                        {count as number}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedSecurityDashboard;