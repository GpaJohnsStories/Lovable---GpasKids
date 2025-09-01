import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw } from "lucide-react";

// Registry of all webtext usage across public pages
const WEBTEXT_USAGE = [
  { code: 'SYS-AGJ', path: '/about', fallbackTitle: 'About Grandpa John' },
  { code: 'SYS-ABO', path: '/about', fallbackTitle: 'About Page Content' },
  { code: 'SYS-BDY', path: '/about', fallbackTitle: 'Buddy Introduction' },
  { code: 'SYS-THY', path: '/about', fallbackTitle: 'Thank You Message' },
  { code: 'SYS-CLB', path: '/club', fallbackTitle: 'Club Information' },
  { code: 'SYS-CLU', path: '/club', fallbackTitle: 'Club Welcome' },
  { code: 'SYS-CHT', path: '/gpas-chat', fallbackTitle: 'Chat Introduction' },
  { code: 'SYS-G1A', path: '/guide', fallbackTitle: 'Getting Started' },
  { code: 'SYS-G2A', path: '/guide', fallbackTitle: 'Understanding the Library' },
  { code: 'SYS-G3A', path: '/guide', fallbackTitle: 'Reading Stories' },
  { code: 'SYS-G3B', path: '/guide', fallbackTitle: 'Story Features' },
  { code: 'SYS-G6A', path: '/guide', fallbackTitle: 'Audio and Voice' },
  { code: 'SYS-G7A', path: '/guide', fallbackTitle: 'Mobile Experience' },
  { code: 'SYS-HEL', path: '/help-gpa', fallbackTitle: 'Help Page Content' },
  { code: 'SYS-HGJ', path: '/help-gpa', fallbackTitle: 'Help from Grandpa John' },
  { code: 'SYS-WEL', path: '/home', fallbackTitle: 'Welcome Message' },
  { code: 'SYS-LIB', path: '/library', fallbackTitle: 'Library Instructions' },
  { code: 'SYS-CCR', path: '/make-comment', fallbackTitle: 'Comments Rules' },
  { code: 'SYS-CCW', path: '/make-comment', fallbackTitle: 'Comments Welcome' },
  { code: 'SYS-OSP', path: '/orange-gang-photos', fallbackTitle: 'Orange Gang Photo Gallery' },
  { code: 'SYS-P2Y', path: '/security', fallbackTitle: 'My Promise To You!' },
  { code: 'SYS-PR1', path: '/security', fallbackTitle: 'Zero Cookies Promise' },
  { code: 'SYS-PR2', path: '/security', fallbackTitle: 'Cloudflare Security Protection' },
  { code: 'SYS-PR3', path: '/security', fallbackTitle: 'Local Browser Storage' },
  { code: 'SYS-PR4', path: '/security', fallbackTitle: 'No Tracking or Analytics' },
  { code: 'SYS-PR4A', path: '/security', fallbackTitle: 'Secure Hosting of Stories, Audio, and Video' },
  { code: 'SYS-PR5', path: '/security', fallbackTitle: 'What We Don\'t Collect' },
  { code: 'SYS-PR6', path: '/security', fallbackTitle: 'Secure Admin Access' },
  { code: 'SYS-PR7', path: '/security', fallbackTitle: 'Questions About Our Privacy Policy?' },
  { code: 'SYS-PRQ', path: '/security', fallbackTitle: 'Privacy Quote' },
  { code: 'SYS-GJC', path: '/view-comments', fallbackTitle: 'Grandpa John Comments' },
  { code: 'SYS-CP2', path: '/writing', fallbackTitle: 'Writing Instructions Part 2' },
  { code: 'SYS-CP3', path: '/writing', fallbackTitle: 'Writing Instructions Part 3' },
  { code: 'SYS-CPR', path: '/writing', fallbackTitle: 'Writing Instructions' },
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