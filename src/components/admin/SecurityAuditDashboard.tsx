import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Database as DatabaseIcon, Activity, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

import { Database } from "@/integrations/supabase/types";

type AuditLog = Database['public']['Tables']['database_operations_audit']['Row'];

const SecurityAuditDashboard = () => {
  const [filter, setFilter] = useState<'all' | 'public' | 'admin'>('all');

  const { data: auditLogs, isLoading, refetch } = useQuery<AuditLog[]>({
    queryKey: ["security_audit", filter],
    queryFn: async () => {
      console.log("🔍 Fetching security audit logs...");
      
      let query = supabase
        .from("database_operations_audit")
        .select("*")
        .order('created_at', { ascending: false })
        .limit(100);

      if (filter !== 'all') {
        query = query.eq('client_type', filter);
      }

      const { data, error } = await query;

      if (error) {
        console.error("❌ Error fetching audit logs:", error);
        throw new Error(`Failed to fetch audit logs: ${error.message}`);
      }
      
      return data || [];
    },
  });

  const getClientTypeBadge = (clientType: string) => {
    const variants = {
      'public': 'secondary',
      'admin': 'destructive',
      'service': 'default'
    } as const;
    
    return (
      <Badge variant={variants[clientType as keyof typeof variants] || 'default'}>
        {clientType.toUpperCase()}
      </Badge>
    );
  };

  const getOperationIcon = (operation: string) => {
    switch (operation.toLowerCase()) {
      case 'insert':
        return <DatabaseIcon className="h-4 w-4 text-green-600" />;
      case 'update':
        return <Activity className="h-4 w-4 text-blue-600" />;
      case 'delete':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Audit Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading audit logs...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Audit Dashboard
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All Operations
          </Button>
          <Button
            variant={filter === 'public' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('public')}
          >
            Public Client
          </Button>
          <Button
            variant={filter === 'admin' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('admin')}
          >
            Admin Client
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
          >
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {auditLogs && auditLogs.length > 0 ? (
            auditLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  {getOperationIcon(log.operation_type)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{log.operation_type}</span>
                      <span className="text-gray-600">on</span>
                      <span className="font-medium">{log.table_name}</span>
                      {getClientTypeBadge(log.client_type)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm:ss')}
                      {log.ip_address && ` • IP: ${log.ip_address}`}
                    </div>
                  </div>
                </div>
                {log.operation_details && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-gray-600">Details</summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-w-md">
                      {JSON.stringify(log.operation_details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">
              No audit logs found for the selected filter.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityAuditDashboard;