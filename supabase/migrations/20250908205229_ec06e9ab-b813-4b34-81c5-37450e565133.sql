-- Insert Admin Manual webtext content
INSERT INTO stories (story_code, title, content, category, author, publication_status_code) VALUES

-- ADM-MAA: Welcome & Overview
('ADM-MAA', 'GpasKids.com Admin Manual', 
'<h1>Welcome to the GpasKids.com Administration Manual! 🎯</h1>

<p>This comprehensive guide contains everything you need to know about managing and maintaining our child-safe storytelling platform. Each section is organized for quick reference and practical application.</p>

<p><strong>What You''ll Find Here:</strong></p>
<ul>
<li>WebText Box system templates and standards</li>
<li>Content creation guidelines</li>
<li>Security protocols for child safety</li>
<li>Emergency procedures</li>
<li>Maintenance schedules</li>
</ul>

<p>Remember: This site is designed for grade school children with strict security and safety protocols. Every decision should prioritize child safety, ease of use, and educational value.</p>', 
'WebText', 'system', 3),

-- ADM-MAB: WebText Box System Overview
('ADM-MAB', 'WebText Box System Overview',
'<h1>The WebText Box System 📦</h1>

<p>Our site uses two main webtext box templates for consistent, child-friendly content display:</p>

<p><strong>SYS-WEL (Welcome Style)</strong> - Blue themed boxes for introductory and welcoming content</p>
<p><strong>SYS-WE2 (Secondary Style)</strong> - Orange themed boxes for detailed information and instructions</p>

<p><strong>Key Features:</strong></p>
<ul>
<li>Large 21px+ fonts for easy reading</li>
<li>High contrast colors for accessibility</li>
<li>Audio playback with SuperAV integration</li>
<li>Touch-friendly design for tablets and phones</li>
<li>Consistent 4px outer borders, 3px photo borders</li>
<li>Rounded corners for child-friendly appearance</li>
</ul>

<p>Each box automatically handles loading states, displays story codes for reference, and maintains our strict content security standards.</p>',
'WebText', 'system', 3),

-- ADM-MAC: SYS-WEL Standards
('ADM-MAC', 'SYS-WEL Text Box Standards', 
'<h1>SYS-WEL Template Standards 💙</h1>

<p><strong>Visual Design:</strong></p>
<ul>
<li>Primary Color: Navy Blue (#0B3D91)</li>
<li>Background: Light blue tint with transparency</li>
<li>Border: 4px solid navy blue with rounded corners</li>
<li>Photo Border: 3px solid navy blue, no inner padding</li>
<li>Text: Navy blue for maximum contrast</li>
</ul>

<p><strong>Typography:</strong></p>
<ul>
<li>Minimum 21px font size (text-18-system class = 24px actual)</li>
<li>Handwritten font for titles (font-handwritten)</li>
<li>High contrast text for visual accessibility</li>
</ul>

<p><strong>Layout Features:</strong></p>
<ul>
<li>Floated images with text wrapping</li>
<li>Audio button positioned top-right</li>
<li>Story code display bottom-right</li>
<li>Tooltip functionality for images</li>
<li>SuperAV integration for audio playback</li>
</ul>

<p><strong>Best Used For:</strong> Welcome messages, introductions, main content areas, and primary information.</p>',
'WebText', 'system', 3),

-- ADM-MAD: SYS-WE2 Standards  
('ADM-MAD', 'SYS-WE2 Text Box Standards',
'<h1>SYS-WE2 Template Standards 🧡</h1>

<p><strong>Visual Design:</strong></p>
<ul>
<li>Primary Color: Orange (#F97316)</li>
<li>Border Color: Dark Orange (#D2691E)</li>
<li>Background: Orange with 20% transparency (#F9731633)</li>
<li>Border: 4px solid dark orange with rounded corners</li>
<li>Photo Border: 3px solid dark orange, no inner padding</li>
<li>Photo Mat: Orange tinted background</li>
</ul>

<p><strong>Typography:</strong></p>
<ul>
<li>Minimum 21px font size with proportional scaling</li>
<li>Orange text matching the theme</li>
<li>Bold titles (text-3xl font-bold)</li>
</ul>

<p><strong>Advanced Features:</strong></p>
<ul>
<li>Proportional font sizing enabled</li>
<li>Rich content cleaning</li>
<li>Header token extraction and processing</li>
<li>Cache-busted image URLs for reliability</li>
<li>Enhanced content rendering with IsolatedStoryRenderer</li>
</ul>

<p><strong>Best Used For:</strong> Secondary information, detailed instructions, supplementary content, and technical documentation.</p>',
'WebText', 'system', 3),

-- ADM-MAE: Content Creation Guidelines
('ADM-MAE', 'Content Creation Guidelines',
'<h1>Content Creation Guidelines ✍️</h1>

<p><strong>Child Safety First:</strong></p>
<ul>
<li>All content must be appropriate for grade school children</li>
<li>No external links without admin approval</li>
<li>No personal information collection</li>
<li>All images must have descriptive alt text</li>
<li>Use simple, encouraging language</li>
</ul>

<p><strong>Writing Standards:</strong></p>
<ul>
<li>Use active voice and simple sentences</li>
<li>Explain technical terms in kid-friendly language</li>
<li>Include encouraging and positive messaging</li>
<li>Keep paragraphs short for easy reading</li>
<li>Use bullet points for lists (like this one!)</li>
</ul>

<p><strong>Accessibility Requirements:</strong></p>
<ul>
<li>High contrast text and backgrounds</li>
<li>Large, touch-friendly buttons</li>
<li>Clear navigation with obvious paths</li>
<li>Alternative text for all images</li>
<li>Simple vocabulary appropriate for reading level</li>
</ul>

<p>Remember: We''re creating a safe, welcoming space where children feel comfortable exploring and learning!</p>',
'WebText', 'system', 3),

-- ADM-MAF: Code Naming Conventions
('ADM-MAF', 'Story Code Naming Conventions',
'<h1>Story Code System 🏷️</h1>

<p><strong>Standard Format: ABC-XYZ</strong></p>
<ul>
<li><strong>ABC:</strong> 3-letter category identifier</li>
<li><strong>XYZ:</strong> 3-character specific identifier</li>
</ul>

<p><strong>Category Prefixes:</strong></p>
<ul>
<li><strong>ADM:</strong> Admin Manual content</li>
<li><strong>SYS:</strong> System templates and components</li>
<li><strong>WEL:</strong> Welcome and introductory content</li>
<li><strong>STY:</strong> Individual stories</li>
<li><strong>INS:</strong> Instructions and help content</li>
<li><strong>GAM:</strong> Games and interactive content</li>
</ul>

<p><strong>Specific Identifier Rules:</strong></p>
<ul>
<li>For manual pages: First 2 letters = page abbreviation + sequential letter</li>
<li>Example: ADM-MAA (Admin Manual, page A)</li>
<li>For stories: Author initials + sequential number</li>
<li>For system: Template name abbreviation</li>
</ul>

<p><strong>Best Practices:</strong></p>
<ul>
<li>Keep codes short but meaningful</li>
<li>Use consistent patterns within categories</li>
<li>Document new prefixes in this manual</li>
<li>Test codes before publishing</li>
</ul>',
'WebText', 'system', 3),

-- ADM-MAG: Child Safety & Security
('ADM-MAG', 'Child Safety & Security Protocols',
'<h1>Child Safety & Security Protocols 🛡️</h1>

<p><strong>Content Security:</strong></p>
<ul>
<li>All user submissions require admin approval</li>
<li>Automated profanity filtering on all text input</li>
<li>No direct contact between users allowed</li>
<li>Report button available on all pages</li>
<li>Regular security audits and monitoring</li>
</ul>

<p><strong>Technical Security:</strong></p>
<ul>
<li>XSS protection on all content rendering</li>
<li>Encrypted data transmission (HTTPS only)</li>
<li>Secure authentication with WebAuthn when possible</li>
<li>Row Level Security (RLS) on all database tables</li>
<li>Regular backups with encryption</li>
</ul>

<p><strong>Privacy Protection:</strong></p>
<ul>
<li>No advertising or tracking</li>
<li>Minimal data collection</li>
<li>Anonymous user interactions when possible</li>
<li>No third-party analytics or cookies</li>
<li>COPPA compliance for child privacy</li>
</ul>

<p><strong>Emergency Response:</strong></p>
<ul>
<li>Immediate content removal capability</li>
<li>User account suspension tools</li>
<li>Direct reporting to appropriate authorities if needed</li>
<li>Incident documentation and follow-up procedures</li>
</ul>',
'WebText', 'system', 3),

-- ADM-MAH: Template Reference
('ADM-MAH', 'Quick Template Reference',
'<h1>Quick Template Reference 🚀</h1>

<p><strong>SYS-WEL Component Usage:</strong></p>
<pre><code>&lt;SysWelWebTextBox 
  code="YOUR-CODE"
  title="Optional Title Override"
  id="unique-section-id"
/&gt;</code></pre>

<p><strong>SYS-WE2 Component Usage:</strong></p>
<pre><code>&lt;SysWe2WebTextBox 
  code="YOUR-CODE"  
  title="Optional Title Override"
  id="unique-section-id"
/&gt;</code></pre>

<p><strong>Standard Database Entry:</strong></p>
<pre><code>INSERT INTO stories (story_code, title, content, category, author, publication_status_code) VALUES
(''YOUR-CODE'', ''Your Title'', ''&lt;p&gt;Your content here&lt;/p&gt;'', ''WebText'', ''system'', 3);</code></pre>

<p><strong>Common CSS Classes:</strong></p>
<ul>
<li><strong>text-18-system:</strong> Standard body text (21px actual)</li>
<li><strong>font-handwritten:</strong> Title font style</li>
<li><strong>text-3xl font-bold:</strong> Large heading style</li>
</ul>

<p><strong>Image Requirements:</strong></p>
<ul>
<li>Always include alt text</li>
<li>Use photo_link_1 and photo_alt_1 fields</li>
<li>Images auto-scale with max heights</li>
<li>Supported formats: PNG, JPG, WebP</li>
</ul>',
'WebText', 'system', 3),

-- ADM-MAI: Emergency Procedures
('ADM-MAI', 'Emergency Response Procedures',
'<h1>Emergency Response Procedures 🚨</h1>

<p><strong>Content Emergency (Inappropriate Content Found):</strong></p>
<ol>
<li>Immediately unpublish content (set publication_status_code = 5)</li>
<li>Document the incident with screenshots</li>
<li>Review how the content was submitted/approved</li>
<li>Update filtering rules to prevent similar content</li>
<li>Report to authorities if required</li>
</ol>

<p><strong>Security Breach Response:</strong></p>
<ol>
<li>Change all admin passwords immediately</li>
<li>Review recent database changes</li>
<li>Check system logs for unauthorized access</li>
<li>Rotate API keys and secrets</li>
<li>Notify hosting provider if needed</li>
</ol>

<p><strong>System Outage:</strong></p>
<ol>
<li>Check Supabase status dashboard</li>
<li>Review application logs</li>
<li>Verify SSL certificates</li>
<li>Test from multiple locations</li>
<li>Communicate with users via social channels</li>
</ol>

<p><strong>Emergency Contacts:</strong></p>
<ul>
<li>Site Owner: [Contact info in secure location]</li>
<li>Hosting Support: Supabase support portal</li>
<li>Legal: [Legal contact in secure location]</li>
</ul>',
'WebText', 'system', 3),

-- ADM-MAJ: Maintenance Schedule
('ADM-MAJ', 'Regular Maintenance Schedule',
'<h1>Regular Maintenance Schedule 🔧</h1>

<p><strong>Daily Tasks:</strong></p>
<ul>
<li>Review new user submissions</li>
<li>Check system error logs</li>
<li>Monitor site performance</li>
<li>Review security alerts</li>
</ul>

<p><strong>Weekly Tasks:</strong></p>
<ul>
<li>Update content categories if needed</li>
<li>Review analytics and user feedback</li>
<li>Test backup and restore procedures</li>
<li>Check for broken links or images</li>
<li>Update admin manual with new procedures</li>
</ul>

<p><strong>Monthly Tasks:</strong></p>
<ul>
<li>Review and update security policies</li>
<li>Analyze site performance metrics</li>
<li>Update SSL certificates if needed</li>
<li>Review user account activity</li>
<li>Test emergency procedures</li>
</ul>

<p><strong>Quarterly Tasks:</strong></p>
<ul>
<li>Full security audit</li>
<li>Database optimization and cleanup</li>
<li>Update dependencies and frameworks</li>
<li>Review child safety protocols</li>
<li>Plan new features and improvements</li>
</ul>

<p><strong>Documentation:</strong></p>
<p>Keep maintenance logs in the admin dashboard. Record any issues found, actions taken, and follow-up needed. This helps identify patterns and improve our processes over time.</p>',
'WebText', 'system', 3);