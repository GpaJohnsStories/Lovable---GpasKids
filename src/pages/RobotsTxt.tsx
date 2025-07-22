
import { useEffect } from 'react';

const RobotsTxt = () => {
  useEffect(() => {
    // Set the content type to plain text
    document.title = 'robots.txt';
  }, []);

  const robotsContent = `User-agent: *
Allow: /
Disallow: /buddys_admin/
Disallow: /make-comment
Disallow: /forgot-password
Disallow: /reset-password

# Allow crawling of story pages and public content
Allow: /story/*
Allow: /library
Allow: /about
Allow: /writing
Allow: /help-gpa
Allow: /view-comments
Allow: /privacy

# Social media bots
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

# Sitemap location
Sitemap: https://gpaskids.com/sitemap.xml

# Additional directives for child safety
Crawl-delay: 1`;

  // Return the content as plain text
  return (
    <pre style={{ 
      fontFamily: 'monospace', 
      whiteSpace: 'pre-wrap',
      margin: 0,
      padding: 0
    }}>
      {robotsContent}
    </pre>
  );
};

export default RobotsTxt;
