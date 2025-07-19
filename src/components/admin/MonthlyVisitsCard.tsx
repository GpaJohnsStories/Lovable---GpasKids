import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendingUp, Users } from "lucide-react";

interface MonthlyVisit {
  id: string;
  year: number;
  month: number;
  visit_count: number;
  bot_visits_count: number;
  admin_visits_count: number;
  other_excluded_count: number;
  created_at: string;
  updated_at: string;
}

export const MonthlyVisitsCard = () => {
  const { data: monthlyVisits, isLoading } = useQuery({
    queryKey: ['monthly-visits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_visits')
        .select('*')
        .order('year', { ascending: true })
        .order('month', { ascending: true });

      if (error) throw error;
      return data as MonthlyVisit[];
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  // Transform data for chart
  const chartData = monthlyVisits?.map((visit) => ({
    period: `${visit.year}-${visit.month.toString().padStart(2, '0')}`,
    visits: visit.visit_count,
    fullDate: new Date(visit.year, visit.month - 1, 1),
  })) || [];

  // Calculate totals for different visit types
  const totalApprovedVisits = monthlyVisits?.reduce((sum, visit) => sum + visit.visit_count, 0) || 0;
  const totalBotVisits = monthlyVisits?.reduce((sum, visit) => sum + (visit.bot_visits_count || 0), 0) || 0;
  const totalAdminVisits = monthlyVisits?.reduce((sum, visit) => sum + (visit.admin_visits_count || 0), 0) || 0;
  const totalOtherExcluded = monthlyVisits?.reduce((sum, visit) => sum + (visit.other_excluded_count || 0), 0) || 0;
  const totalAllVisits = totalApprovedVisits + totalBotVisits + totalAdminVisits + totalOtherExcluded;

  const currentMonth = chartData[chartData.length - 1];
  const previousMonth = chartData[chartData.length - 2];
  const growth = previousMonth && currentMonth 
    ? ((currentMonth.visits - previousMonth.visits) / previousMonth.visits * 100)
    : 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Site Visits</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded mb-4"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Monthly Site Visits</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Approved Visitors (main metric) */}
          <div className="text-center">
            <div className="text-2xl font-bold">{totalApprovedVisits.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Approved Visitors</div>
          </div>
          
          {/* Excluded Visits Breakdown */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-orange-50 dark:bg-orange-950 p-2 rounded">
              <div className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                {totalBotVisits.toLocaleString()}
              </div>
              <div className="text-xs text-orange-500">Bot Visits</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded">
              <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {totalAdminVisits.toLocaleString()}
              </div>
              <div className="text-xs text-blue-500">Admin Visits</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {totalOtherExcluded.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Other Excluded</div>
            </div>
          </div>
          
          {/* Total All Visits */}
          <div className="text-center text-xs text-muted-foreground">
            Total All Visits: {totalAllVisits.toLocaleString()}
          </div>
        </div>
        
        {chartData.length > 0 && (
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="period" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis hide />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg shadow-lg p-2">
                          <p className="text-sm font-medium">{label}</p>
                          <p className="text-sm text-primary">
                            Visits: {payload[0].value?.toLocaleString()}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {chartData.length === 0 && (
          <div className="mt-4 text-center text-muted-foreground">
            <p className="text-sm">No visit data available yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};