// WebText paths mapping for admin stories display
export const WEBTEXT_USAGE = [
  { code: 'about01', path: '/about', fallbackTitle: 'About Page' },
  { code: 'guide01', path: '/guide', fallbackTitle: 'Guide Page' },
  { code: 'help001', path: '/help-gpa', fallbackTitle: 'Help GPA Page' },
  { code: 'privacy', path: '/privacy', fallbackTitle: 'Privacy Policy' },
  { code: 'library', path: '/library', fallbackTitle: 'Library Page' },
  { code: 'club001', path: '/club', fallbackTitle: 'Club Page' },
  { code: 'writing', path: '/writing', fallbackTitle: 'Writing Page' },
  { code: 'authbio', path: '/public-author-bios', fallbackTitle: 'Author Bios Page' },
  { code: 'orangeg', path: '/orange-gang-photos', fallbackTitle: 'Orange Gang Photos' },
];

export const getWebtextPath = (storyCode: string): string => {
  const webtext = WEBTEXT_USAGE.find(item => item.code === storyCode);
  return webtext?.path || 'Unknown Path';
};