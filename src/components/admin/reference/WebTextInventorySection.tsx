import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw } from "lucide-react";

// Registry of all webtext usage across public pages
const WEBTEXT_USAGE = [
  { code: 'SYS-WEL', path: '/home', fallbackTitle: 'Welcome Message' },
  { code: 'SYS-G3A', path: '/guide', fallbackTitle: 'Guide Introduction' },
  { code: 'SYS-G3B', path: '/guide', fallbackTitle: 'Library Categories' },
  { code: 'SYS-G3C', path: '/guide', fallbackTitle: 'Reading Guidelines' },
  { code: 'SYS-G3D', path: '/guide', fallbackTitle: 'Story Navigation' },
  { code: 'SYS-G3E', path: '/guide', fallbackTitle: 'Audio Features' },
  { code: 'SYS-G3F', path: '/guide', fallbackTitle: 'Mobile Experience' },
  { code: 'SYS-G3G', path: '/guide', fallbackTitle: 'Comments & Community' },
  { code: 'SYS-G3H', path: '/guide', fallbackTitle: 'Technical Support' },
  { code: 'SYS-LIB', path: '/library', fallbackTitle: 'Library Instructions' },
  { code: 'SYS-ABO', path: '/about', fallbackTitle: 'About Page Content' },
  { code: 'SYS-PRI', path: '/privacy', fallbackTitle: 'Privacy Policy' },
  { code: 'SYS-CLU', path: '/club', fallbackTitle: 'Club Welcome' },
  { code: 'SYS-HEL', path: '/help-gpa', fallbackTitle: 'Help Page Content' },
  { code: 'SYS-CHT', path: '/gpas-chat', fallbackTitle: 'Chat Introduction' },
];

const countWords = (text: string): number => {
  if (!text) return 0;
  // Strip HTML tags and count words
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = text;
  const plainText = tempDiv.textContent || tempDiv.innerText || '';
  return plainText.trim().split(/\s+/).filter(word => word.length > 0).length;
};

const getHeading = (story: any, fallbackTitle: string): string => {
  if (story?.title && story.title !== story.story_code) {
    return story.title;
  }
  return fallbackTitle;
};

export const WebTextInventorySection: React.FC = () => {
  const { data: stories = [], refetch, isLoading } = useQuery({
    queryKey: ['webtext-inventory'],
    queryFn: async () => {
      const codes = WEBTEXT_USAGE.map(item => item.code);
      const { data, error } = await supabase
        .from('stories')
        .select('story_code, title, content, publication_status_code')
        .in('story_code', codes);
      
      if (error) {
        console.error('Error fetching webtext inventory:', error);
        return [];
      }
      
      return data || [];
    },
  });

  const handleRefresh = () => {
    refetch();
  };

  // Create lookup map for stories
  const storiesMap = new Map(stories.map(story => [story.story_code, story]));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-primary">WebText Inventory</CardTitle>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead className="w-32">Webtext Code</TableHead>
                <TableHead className="w-20">Status</TableHead>
                <TableHead className="w-24">Word Count</TableHead>
                <TableHead className="w-32">Page Path</TableHead>
                <TableHead>Heading/Title</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {WEBTEXT_USAGE.map((item, index) => {
                const story = storiesMap.get(item.code);
                const wordCount = story ? countWords(story.content || '') : 0;
                const status = story ? story.publication_status_code.toString() : 'N/A';
                const heading = story ? getHeading(story, item.fallbackTitle) : item.fallbackTitle;

                return (
                  <TableRow key={item.code}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-mono text-sm">{item.code}</TableCell>
                    <TableCell className={status === 'N/A' ? 'text-muted-foreground' : ''}>{status}</TableCell>
                    <TableCell className="text-right">{wordCount.toLocaleString()}</TableCell>
                    <TableCell className="font-mono text-sm">{item.path}</TableCell>
                    <TableCell>{heading}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Total webtext boxes: {WEBTEXT_USAGE.length}</p>
          <p>Existing in database: {stories.length}</p>
          <p>Missing from database: {WEBTEXT_USAGE.length - stories.length}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebTextInventorySection;