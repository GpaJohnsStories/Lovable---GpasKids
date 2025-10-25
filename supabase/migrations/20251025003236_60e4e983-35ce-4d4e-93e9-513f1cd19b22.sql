
-- Insert ADM-MAK: BaseWebTextBox Refactor Project Documentation
INSERT INTO public.stories (
  story_code,
  title,
  tagline,
  excerpt,
  author,
  category,
  publication_status_code,
  content,
  color_preset_id
) VALUES (
  'ADM-MAK',
  'BaseWebTextBox Refactor Project - November 2025',
  'Technical documentation for upcoming template system refactor',
  'Comprehensive plan and context for refactoring the BaseWebTextBox component system to be fully self-contained. Save for November 2025 implementation.',
  'GpaJohn',
  'WebText',
  0,
  '<h2>Current Architecture Issues</h2>
<p><strong>BaseWebTextBox is "half-transformed":</strong></p>
<ul>
  <li>Currently fetches story data internally ✓</li>
  <li>Does NOT fetch color presets internally ✗</li>
  <li>Requires wrapper components to pass theme props</li>
  <li>Wrappers needed: SysWe2WebTextBox, SysWelWebTextBox, SysLaaWebTextBox</li>
  <li>Each wrapper fetches color_preset_id and passes theme to BaseWebTextBox</li>
  <li>Inconsistent behavior: Guide page shows brown on green for SYS-WE2 despite preset 3 being assigned (which should be green)</li>
</ul>

<h2>Goal: Fully Self-Contained BaseWebTextBox</h2>
<p><strong>Accept ONLY these props:</strong></p>
<ul>
  <li><code>code</code> (required) - Story code like "SYS-WE2"</li>
  <li><code>title</code> (optional) - Override title</li>
  <li><code>id</code> (optional) - HTML id attribute</li>
</ul>

<p><strong>Component should handle internally:</strong></p>
<ul>
  <li>Fetch story data including color_preset_id</li>
  <li>Fetch color preset from database if assigned</li>
  <li>Auto-generate cssClassPrefix from code (e.g., "SYS-WE2" → "syswe2")</li>
  <li>Build theme object from color preset data</li>
  <li>Apply all styling and theming</li>
</ul>

<h2>CoPilot Optimization Recommendations</h2>
<p><strong>Code quality improvements suggested:</strong></p>
<ol>
  <li><strong>Move font scale map to utils:</strong> Create <code>src/utils/fontScaleUtils.ts</code> with the FONT_SCALE_MAP</li>
  <li><strong>Use CSS variables for theming:</strong> Replace inline styles with CSS variables (--wt-border, --wt-bg, --wt-fg, --wt-photo-border, --wt-photo-mat)</li>
  <li><strong>Extract subcomponents:</strong> Create WebTextImage and WebTextControls components</li>
  <li><strong>Replace float-left wrapper:</strong> Use CSS class instead of wrapper div</li>
  <li><strong>Consolidate UI states:</strong> Single loading/error handling approach</li>
  <li><strong>Move dynamic style building:</strong> Extract stylesheet generation logic</li>
</ol>

<h2>Implementation Plan (4-5 Credits)</h2>
<p><strong>Phase 1: Core Template Refactor (2 credits)</strong></p>
<ul>
  <li>Make BaseWebTextBox fully self-contained</li>
  <li>Add internal color preset fetching</li>
  <li>Auto-generate cssClassPrefix from code</li>
  <li>Build theme object internally</li>
  <li>Create src/utils/fontScaleUtils.ts</li>
  <li>Implement CSS variables approach</li>
</ul>

<p><strong>Phase 2: Update All Usage Sites (1-2 credits)</strong></p>
<ul>
  <li>Convert Guide.tsx - replace SysWe2WebTextBox with BaseWebTextBox</li>
  <li>Convert Index.tsx, Club.tsx, HelpGpa.tsx, Writing.tsx - replace WebTextBox</li>
  <li>Update AdminManual.tsx</li>
  <li>Update GpaJohnComments.tsx, CommentPopupDialog.tsx, ReportProblemDialog.tsx</li>
</ul>

<p><strong>Phase 3: Cleanup (1 credit)</strong></p>
<ul>
  <li>Delete src/components/WebTextBox.tsx (router component)</li>
  <li>Delete src/components/templates/SysWe2WebTextBox.tsx</li>
  <li>Delete src/components/templates/SysWelWebTextBox.tsx</li>
  <li>Delete src/components/templates/SysLaaWebTextBox.tsx</li>
  <li>Update src/docs/WEBTEXT_TEMPLATES.md</li>
</ul>

<h2>Database Structure Reference</h2>
<p><strong>Color Presets Table (8 presets defined):</strong></p>
<ul>
  <li>Preset 1 (green-orange): Green font, orange borders</li>
  <li>Preset 2 (navy-blue): Navy font, blue borders</li>
  <li>Preset 3 (green-green): Green font, green borders, green tinted bg</li>
  <li>Preset 4 (brown-orange): Brown font, orange borders</li>
  <li>Preset 5 (brown-green): Brown font, green borders</li>
  <li>Preset 6 (black-red): Black font, red borders, red tinted bg</li>
  <li>Preset 7 (navy-green): Navy font, green borders, green tinted bg</li>
  <li>Preset 8 (golden-brown): Golden font, brown borders</li>
</ul>

<p><strong>Current Guide Page Story Assignments:</strong></p>
<ul>
  <li>SYS-G2A: Preset 6 (black-red)</li>
  <li>SYS-G2B: Preset 3 (green-green)</li>
  <li>SYS-G2C: Preset 7 (navy-green)</li>
  <li>SYS-G2D: Preset 2 (navy-blue)</li>
  <li>SYS-G2E: Preset 8 (golden-brown)</li>
</ul>

<h2>Files to Modify</h2>
<p><strong>Core Refactor:</strong></p>
<ul>
  <li>src/components/templates/BaseWebTextBox.tsx (major refactor)</li>
</ul>

<p><strong>New Files:</strong></p>
<ul>
  <li>src/utils/fontScaleUtils.ts (create)</li>
</ul>

<p><strong>Update Usage:</strong></p>
<ul>
  <li>src/pages/Guide.tsx</li>
  <li>src/pages/Index.tsx</li>
  <li>src/pages/Club.tsx</li>
  <li>src/pages/HelpGpa.tsx</li>
  <li>src/pages/Writing.tsx</li>
  <li>src/pages/AdminManual.tsx</li>
  <li>src/components/GpaJohnComments.tsx</li>
  <li>src/components/CommentPopupDialog.tsx</li>
  <li>src/components/ReportProblemDialog.tsx</li>
</ul>

<p><strong>Delete:</strong></p>
<ul>
  <li>src/components/WebTextBox.tsx</li>
  <li>src/components/templates/SysWe2WebTextBox.tsx</li>
  <li>src/components/templates/SysWelWebTextBox.tsx</li>
  <li>src/components/templates/SysLaaWebTextBox.tsx</li>
</ul>

<p><strong>Documentation:</strong></p>
<ul>
  <li>src/docs/WEBTEXT_TEMPLATES.md (update)</li>
</ul>

<h2>Expected Result</h2>
<p><strong>After implementation, usage will be:</strong></p>
<pre><code>&lt;BaseWebTextBox code="SYS-WE2" /&gt;</code></pre>

<p><strong>Component will automatically:</strong></p>
<ul>
  <li>Fetch story by code</li>
  <li>Fetch assigned color preset</li>
  <li>Apply all colors and theming</li>
  <li>Display with proper text wrapping</li>
  <li>Work consistently everywhere</li>
</ul>

<h2>Alternative Consideration</h2>
<p><strong>Build New Template From Scratch:</strong></p>
<p>Instead of refactoring accumulated complexity, consider building a completely new template based on all learned requirements. Fresh start might be cleaner and more maintainable.</p>

<p><strong>Decision Point:</strong> Discuss in November 2025 whether to refactor or rebuild.</p>

<hr>
<p><em>Document created: October 2025 | Implementation target: Early November 2025</em></p>',
  '2'
);
