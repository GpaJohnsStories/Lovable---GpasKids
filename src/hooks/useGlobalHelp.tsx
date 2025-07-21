
import { useState, useEffect, useCallback } from 'react';
import { useStoryCodeLookup } from './useStoryCodeLookup';

// Map routes to their corresponding story codes for help content
const ROUTE_HELP_MAP: Record<string, string> = {
  '/': 'HLP-HOM',
  '/library': 'LIBRARY_HELP',
  '/story': 'STORY_HELP',
  '/about': 'ABOUT_HELP',
  '/make-comment': 'COMMENT_HELP',
  '/view-comments': 'VIEW_COMMENTS_HELP',
  '/writing': 'WRITING_HELP',
  '/privacy': 'PRIVACY_HELP',
  '/help-gpa': 'HELP_GPA_HELP',
  '/author': 'AUTHOR_HELP',
  '/buddys_admin': 'ADMIN_HELP',
  '/simple-admin': 'ADMIN_HELP',
  '/admin': 'ADMIN_HELP',
  '/admin-access': 'ADMIN_ACCESS_HELP'
};

const DEFAULT_HELP_MESSAGE = `
<div style="text-align: center; padding: 20px;">
  <h3>Welcome to Grandpa's Stories!</h3>
  <p>This is a safe place for children to read wonderful stories and share comments.</p>
  <p>Use the navigation buttons at the top to explore different sections:</p>
  <ul style="text-align: left; max-width: 300px; margin: 0 auto;">
    <li><strong>Home</strong> - Return to the main page</li>
    <li><strong>Library</strong> - Browse all available stories</li>
    <li><strong>About</strong> - Learn more about this website</li>
    <li><strong>Comments</strong> - Share your thoughts safely</li>
  </ul>
  <p>Press <kbd>Ctrl+H</kbd> anytime to see help for the current page!</p>
</div>
`;

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
    
    return ROUTE_HELP_MAP[route] || 'HLP-HOM';
  }, []);

  const fetchHelpContent = useCallback(async (route: string) => {
    const helpCode = getHelpCodeForRoute(route);
    setIsLoading(true);
    
    console.log('🔍 Fetching help content for route:', route, 'with code:', helpCode);
    
    try {
      const story = await lookupStoryByCode(helpCode);
      
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
