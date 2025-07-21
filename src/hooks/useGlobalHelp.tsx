
import { useState, useEffect, useCallback } from 'react';
import { useStoryCodeLookup } from './useStoryCodeLookup';

// Map routes to their corresponding story codes for help content
const ROUTE_HELP_MAP: Record<string, string> = {
  '/': 'HLP-HOME',
  '/library': 'HLP-LIB',
  '/story': 'STORY_HELP',
  '/about': 'HLP-ABT',
  '/make-comment': 'HLP-COM1',
  '/view-comments': 'HLP-COM2',
  '/writing': 'HLP-WR',
  '/privacy': 'HLP-PRV',
  '/help-gpa': 'HELP_GPA_HELP',
  '/author': 'AUTHOR_HELP',
  '/buddys_admin': 'ADMIN_HELP',
  '/simple-admin': 'ADMIN_HELP',
  '/admin': 'ADMIN_HELP',
  '/admin-access': 'ADMIN_ACCESS_HELP'
};

const DEFAULT_HELP_MESSAGE = "I'm sorry but Grandpa John has not yet written the help message for this page. You can, however, post a comment and he will see it and respond as soon as he can.\nEnjoy your visit to our website.\nYour friend,\nBuddy";

export const useGlobalHelp = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [helpContent, setHelpContent] = useState<string>(DEFAULT_HELP_MESSAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<string>('/');
  const { lookupStoryByCode } = useStoryCodeLookup();

  const getHelpCodeForRoute = useCallback((route: string): string => {
    // Handle dynamic routes
    if (route.startsWith('/story/')) return 'STORY_HELP';
    if (route.startsWith('/author/')) return 'AUTHOR_HELP';
    if (route.startsWith('/comment/')) return 'COMMENT_HELP';
    if (route.startsWith('/buddys_admin')) return 'ADMIN_HELP';
    
    return ROUTE_HELP_MAP[route] || 'HLP-HOME';
  }, []);

  const fetchHelpContent = useCallback(async (route: string) => {
    const helpCode = getHelpCodeForRoute(route);
    setIsLoading(true);
    
    console.log('🔍 Fetching help content for route:', route, 'with code:', helpCode);
    
    try {
      const story = await lookupStoryByCode(helpCode, true); // Silent mode for help lookups
      
      if (story && story.content) {
        console.log('✅ Help content found:', story.title);
        setHelpContent(story.content);
      } else {
        console.log('⚠️ No help content found, using default');
        setHelpContent(DEFAULT_HELP_MESSAGE);
      }
    } catch (error) {
      console.error('❌ Error fetching help content:', error);
      setHelpContent(DEFAULT_HELP_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  }, [lookupStoryByCode, getHelpCodeForRoute]);

  const showHelp = useCallback((route: string) => {
    console.log('🆘 Showing help for route:', route);
    setCurrentRoute(route);
    setIsHelpOpen(true);
    console.log('🔓 Help popup state set to: true');
    alert('State update called! isHelpOpen should be true now');
    fetchHelpContent(route);
  }, [fetchHelpContent]);

  const hideHelp = useCallback(() => {
    setIsHelpOpen(false);
  }, []);

  // Global keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'h') {
        event.preventDefault();
        const currentPath = window.location.pathname;
        showHelp(currentPath);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showHelp]);

  return {
    isHelpOpen,
    helpContent,
    isLoading,
    currentRoute,
    showHelp,
    hideHelp
  };
};
