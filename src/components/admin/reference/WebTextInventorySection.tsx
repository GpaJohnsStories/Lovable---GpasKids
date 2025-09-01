import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw } from "lucide-react";

// Registry of all webtext usage across public pages
const WEBTEXT_USAGE = [
  { code: 'SYS-ABO', path: '/about', fallbackTitle: 'About Page Content' },
  { code: 'SYS-AGJ', path: '/about', fallbackTitle: 'About Grandpa John' },
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

// Hardcoded content for webtext codes not in database
const HARD_CODED_TEXTS: Record<string, string> = {
  'SYS-P2Y': `Safety First: This website is designed with children's safety in mind. There are no advertisements, no personal data collection, and strict security measures.

Quality Content: Many of these stories are written by me but all stories and other content are edited by me to be engaging, age-appropriate for grade school students, encouraging, and meaningful.

A Comfortable Space: I want you to feel at home here – like you're sitting in a cozy chair listening to your own grandparent tell you a story.

Thank you for visiting! I hope you enjoy the stories and come back often to see what's new.

Grandpa John`,

  'SYS-PR1': `We are proud to operate a completely cookie-free website. When you visit Grandpa John's Stories to read our stories, no cookies are stored on your device. No tracking, no analytics, no third-party cookies — just pure, uninterrupted storytelling.`,

  'SYS-PR2': `Our website hosting service (Supabase) uses Cloudflare for security protection. Cloudflare may set a temporary security cookie called __cf_bm to protect against malicious bot traffic and ensure the website remains safe and accessible. This cookie is essential for security, expires within 30 minutes, contains no personal information, and is managed entirely by Cloudflare's security systems. It helps keep our stories safe for children to enjoy.`,

  'SYS-PR3': `To improve your reading experience, we store a small piece of information called currentStoryPath in your browser's session storage. This helps you easily return to the story you were reading through our "Current Story" menu option. This information stays only in your browser, is never sent to our servers, and automatically disappears when you close your browser tab. It contains no personal information — just the path to the story you were reading.`,

  'SYS-PR4': `We don't use Google Analytics, Facebook Pixel, or any other tracking tools. Your reading habits, preferences, and browsing behavior remain completely private. We believe in respecting your digital privacy while you enjoy our stories.`,

  'SYS-PR4A': `After we completely review it, all audio, video and text files are stored safely in our secure storage. We NEVER permit links to third‑party sites.`,

  'SYS-PR5': `• Personal information
• Email addresses (no newsletter signups required)
• IP addresses for tracking
• Browsing history
• Device fingerprints
• Location data`,

  'SYS-PR6': `Our content management system uses cookie-free authentication exclusively for administrative purposes. Admin sessions are stored locally on authorized devices only and never transmitted as cookies. This ensures secure content management while maintaining our cookie-free promise to visitors. Additionally, administrative access requires a special external authentication key that is never stored on the website itself. This external key system provides an extra layer of security, ensuring that only authorized personnel can access the site's administrative functions while keeping all visitor interactions completely secure and private.`,

  'SYS-PR7': `If you have any questions about our cookie-free approach or privacy practices, please feel free to contact us by leaving a comment on our Comment Page. We're always happy to discuss our commitment to protecting your privacy while sharing Grandpa's stories.`,

  'SYS-PRQ': `"Privacy is not about hiding something. It's about protecting everything that matters."`,

  'SYS-AGJ': `With over 60 years of marriage and a lifetime of experiences, I've collected stories that I'm excited to share with children around the world. My journey has taught me valuable lessons about kindness, perseverance, and the importance of imagination.`,

  'SYS-BDY': `Buddy joined me at the end of July, 2024. It has been a rough year so far — I fell in June and broke 5 ribs — and I felt I deserved a comfort dog. He talks with me, growls, his whine is the most pathetic thing you've ever heard, and he barks from soft to loud.`,

  'SYS-THY': `None of this would have been possible without the incredible assistance of three amazing AI partners who have helped bring this vision to life. Each one has contributed their unique strengths to make this website a reality.`,

  'SYS-LIB': `Hover over a story title and it will turn red. Click on a story title and it will take you to the story page where you may enjoy it.

Click on any column heading to sort the library by that column. The first click will always sort down and the next click will sort up.

As more stories are loaded, you may want to keep a note on your device or even use pencil and paper to record the Story Code so you can find it easily in the future.`
};

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
                const wordCount = story 
                  ? countWords(story.content || '') 
                  : HARD_CODED_TEXTS[item.code] 
                    ? countWords(HARD_CODED_TEXTS[item.code])
                    : 0;
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