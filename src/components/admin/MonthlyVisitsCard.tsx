import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, LabelList } from "recharts";
import { TrendingUp, Users } from "lucide-react";

interface MonthlyVisit {
  id: string;
  year: number;
  month: number;
  visit_count: number;
  bot_visits_count: number;
  search_engine_visits_count: number;
  site_identifier: string | null;
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

  // Create 15 months of data starting from September 2025
  const generateMonthRange = () => {
    const months = [];
    const startDate = new Date(2025, 8, 1); // September 2025 (month 8 = September, 0-indexed)
    
    for (let i = 0; i < 15; i++) {
      const date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      
      // Find existing data for this month/year
      const existingData = monthlyVisits?.find(visit => 
        visit.year === year && visit.month === month
      );
      
      months.push({
        period: `${year}-${month.toString().padStart(2, '0')} |`,
        approved: existingData?.visit_count || 0,
        searchEngines: existingData?.search_engine_visits_count || 0,
        bots: existingData?.bot_visits_count || 0,
        fullDate: date,
      });
    }
    
    return months;
  };

  // Transform data for multi-line chart with 15 months pre-filled
  const chartData = generateMonthRange();

  // Calculate total approved visits for main display
  const totalApprovedVisits = monthlyVisits?.reduce((sum, visit) => sum + visit.visit_count, 0) || 0;
  
  const currentMonth = chartData[chartData.length - 1];
  const previousMonth = chartData[chartData.length - 2];
  const growth = previousMonth && currentMonth && previousMonth.approved > 0
    ? ((currentMonth.approved - previousMonth.approved) / previousMonth.approved * 100)
    : 0;

  // Custom legend component
  const renderLegend = () => (
    <div className="flex flex-wrap gap-3 text-xs">
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-1 bg-green-600 rounded-sm"></div>
        <span>Approved</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-1 bg-blue-400 rounded-sm"></div>
        <span>Search Engines</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-1 bg-red-600 rounded-sm"></div>
        <span>Bots</span>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-0">
          {renderLegend()}
        </CardHeader>
        <CardContent className="pt-2">
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
      <CardHeader className="pb-0">
        {renderLegend()}
      </CardHeader>
      <CardContent className="pt-2">
        
        {chartData.length > 0 && (
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart 
                data={chartData}
                margin={{ left: 0, right: 50, top: 5, bottom: 5 }}
              >
                <CartesianGrid 
                  strokeDasharray="none" 
                  stroke="#6b7280" 
                  horizontal={true} 
                  vertical={false}
                />
                <XAxis 
                  dataKey="period" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tick={{ textAnchor: 'middle' }}
                  domain={['dataMin', 'dataMax']}
                  type="category"
                  interval={0}
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
                  strokeWidth={3}
                  dot={{ fill: "#16a34a", strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: "#16a34a", strokeWidth: 2 }}
                >
                  <LabelList 
                    dataKey="approved" 
                    position="top" 
                    style={{ fontSize: '14px', fontWeight: 'bold', fill: '#16a34a' }}
                    offset={8}
                  />
                </Line>
                
                {/* Search Engine visits line - Light Blue */}
                <Line 
                  type="monotone" 
                  dataKey="searchEngines" 
                  name="Search Engines"
                  stroke="#60a5fa" 
                  strokeWidth={2}
                  dot={{ fill: "#60a5fa", strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: "#60a5fa", strokeWidth: 2 }}
                >
                  <LabelList 
                    dataKey="searchEngines" 
                    position="top" 
                    style={{ fontSize: '14px', fontWeight: 'bold', fill: '#60a5fa' }}
                    offset={8}
                  />
                </Line>
                
                {/* Bot visits line - Fire Engine Red */}
                <Line 
                  type="monotone" 
                  dataKey="bots" 
                  name="Bots"
                  stroke="#dc2626" 
                  strokeWidth={2}
                  dot={{ fill: "#dc2626", strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: "#dc2626", strokeWidth: 2 }}
                >
                  <LabelList 
                    dataKey="bots" 
                    position="top" 
                    style={{ fontSize: '14px', fontWeight: 'bold', fill: '#dc2626' }}
                    offset={8}
                  />
                </Line>
                
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
