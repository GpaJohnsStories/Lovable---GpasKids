import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
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

  // Transform data for multi-line chart
  const chartData = monthlyVisits?.map((visit) => ({
    period: `${visit.year}-${visit.month.toString().padStart(2, '0')}`,
    approved: visit.visit_count,
    bots: visit.bot_visits_count || 0,
    admin: visit.admin_visits_count || 0,
    other: visit.other_excluded_count || 0,
    fullDate: new Date(visit.year, visit.month - 1, 1),
  })) || [];

  // Calculate total approved visits for main display
  const totalApprovedVisits = monthlyVisits?.reduce((sum, visit) => sum + visit.visit_count, 0) || 0;
  
  const currentMonth = chartData[chartData.length - 1];
  const previousMonth = chartData[chartData.length - 2];
  const growth = previousMonth && currentMonth 
    ? ((currentMonth.approved - previousMonth.approved) / previousMonth.approved * 100)
    : 0;

  // Custom legend component
  const renderLegend = () => (
    <div className="flex flex-wrap gap-3 text-xs justify-end">
      <div className="flex items-center gap-1">
        <div className="w-3 h-0.5 bg-green-600"></div>
        <span>Approved</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-0.5 bg-yellow-400"></div>
        <span>Bots</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-0.5 bg-blue-500"></div>
        <span>Admin</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-0.5 bg-orange-500"></div>
        <span>Other</span>
      </div>
    </div>
  );

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
        <div className="flex items-center gap-4">
          <CardTitle className="text-sm font-medium">Monthly Site Visits</CardTitle>
          {renderLegend()}
        </div>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {/* Main approved visitors metric */}
        <div className="mb-4">
          <div className="text-2xl font-bold">{totalApprovedVisits.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            Approved Visitors
            {growth !== 0 && (
              <>
                <TrendingUp className="h-3 w-3" />
                <span className={growth > 0 ? "text-green-600" : "text-red-600"}>
                  {growth > 0 ? "+" : ""}{growth.toFixed(1)}%
                </span>
              </>
            )}
          </div>
        </div>
        
        {chartData.length > 0 && (
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="period" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg shadow-lg p-3">
                          <p className="text-sm font-medium mb-2">{label}</p>
                          {payload.map((entry, index) => (
                            <p key={index} className="text-sm" style={{ color: entry.color }}>
                              {entry.name}: {entry.value?.toLocaleString()}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                
                {/* Approved visitors line - Forest Green */}
                <Line 
                  type="monotone" 
                  dataKey="approved" 
                  name="Approved"
                  stroke="#16a34a" 
                  strokeWidth={2}
                  dot={{ fill: "#16a34a", strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: "#16a34a", strokeWidth: 2 }}
                />
                
                {/* Bot visits line - Bright Yellow */}
                <Line 
                  type="monotone" 
                  dataKey="bots" 
                  name="Bots"
                  stroke="#facc15" 
                  strokeWidth={2}
                  dot={{ fill: "#facc15", strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: "#facc15", strokeWidth: 2 }}
                />
                
                {/* Admin visits line - Blue */}
                <Line 
                  type="monotone" 
                  dataKey="admin" 
                  name="Admin"
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: "#3b82f6", strokeWidth: 2 }}
                />
                
                {/* Other excluded line - Orange */}
                <Line 
                  type="monotone" 
                  dataKey="other" 
                  name="Other"
                  stroke="#f97316" 
                  strokeWidth={2}
                  dot={{ fill: "#f97316", strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: "#f97316", strokeWidth: 2 }}
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
