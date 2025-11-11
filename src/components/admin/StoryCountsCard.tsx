import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryCount {
  description: string;
  count: number;
}

export const StoryCountsCard = () => {
  const { data: counts, isLoading } = useQuery({
    queryKey: ['story-counts-by-category'],
    queryFn: async () => {
      // Get all stories
      const { data: allStories, error } = await supabase
        .from('stories')
        .select('category');

      if (error) {
        console.error('Error fetching story counts:', error);
        throw error;
      }

      const stories = allStories || [];
      
      // Calculate counts
      const allCount = stories.length;
      const webtextCount = stories.filter(s => s.category === 'WebText').length;
      const adminCount = stories.filter(s => s.category === 'Admin').length;
      const storyCount = stories.filter(s => s.category !== 'WebText' && s.category !== 'Admin').length;
      const funStuffCount = stories.filter(s => s.category === 'Fun').length;
      const lifeLessonsCount = stories.filter(s => s.category === 'Life').length;
      const northPoleCount = stories.filter(s => s.category === 'North Pole').length;
      const worldChangersCount = stories.filter(s => s.category === 'World Changers').length;

      const categoryCounts: CategoryCount[] = [
        { description: 'All Records (Story Table)', count: allCount },
        { description: 'All Webtext Records', count: webtextCount },
        { description: 'All Admin Records', count: adminCount },
        { description: 'Story Records (not webtext/admin)', count: storyCount },
        { description: 'Fun Stuff Category', count: funStuffCount },
        { description: 'Life Lessons Category', count: lifeLessonsCount },
        { description: 'North Pole Category', count: northPoleCount },
        { description: 'World Changers Category', count: worldChangersCount },
      ];

      return categoryCounts;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-lg">Description</TableHead>
            <TableHead className="font-bold text-lg text-right">Count</TableHead>
            {/* Reserve space for 5-10 future columns */}
            <TableHead className="w-20"></TableHead>
            <TableHead className="w-20"></TableHead>
            <TableHead className="w-20"></TableHead>
            <TableHead className="w-20"></TableHead>
            <TableHead className="w-20"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {counts?.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium text-base">{item.description}</TableCell>
              <TableCell className="text-right text-base font-semibold">{item.count}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};