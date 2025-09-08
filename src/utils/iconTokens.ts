import { supabase } from '@/integrations/supabase/client';

/**
 * Process {{ICON}}...{{/ICON}} tokens in content
 * Note: {{BIGICON}} tokens are no longer supported and will be ignored
 */
export const processIconTokens = (content: string): string => {
  // Handle {{ICON}}filename.ext{{/ICON}} format
  content = content.replace(/\{\{ICON\}\}([^{]+?)\{\{\/ICON\}\}/g, (match, iconPath) => {
    const trimmedPath = iconPath.trim();
    let resolvedPath = trimmedPath;
    
    // If it's already a full URL, use as-is
    if (trimmedPath.startsWith('http://') || trimmedPath.startsWith('https://')) {
      resolvedPath = trimmedPath;
    }
    // If it starts with /, treat as site-relative
    else if (trimmedPath.startsWith('/')) {
      resolvedPath = trimmedPath;
    }
    // Otherwise, assume it's from Supabase icons bucket
    else {
      const { data } = supabase.storage.from('icons').getPublicUrl(trimmedPath);
      resolvedPath = data.publicUrl;
    }
    
    return `<img src="${resolvedPath}" alt="Icon" class="inline-icon-55" />`;
  });
  
  // Handle {{ICON: filename.ext}} format (alternative syntax)
  content = content.replace(/\{\{ICON:\s*([^}]+?)\}\}/g, (match, iconPath) => {
    const trimmedPath = iconPath.trim();
    let resolvedPath = trimmedPath;
    
    // If it's already a full URL, use as-is
    if (trimmedPath.startsWith('http://') || trimmedPath.startsWith('https://')) {
      resolvedPath = trimmedPath;
    }
    // If it starts with /, treat as site-relative
    else if (trimmedPath.startsWith('/')) {
      resolvedPath = trimmedPath;
    }
    // Otherwise, assume it's from Supabase icons bucket
    else {
      const { data } = supabase.storage.from('icons').getPublicUrl(trimmedPath);
      resolvedPath = data.publicUrl;
    }
    
    return `<img src="${resolvedPath}" alt="Icon" class="inline-icon-55" />`;
  });
  
  return content;
};
