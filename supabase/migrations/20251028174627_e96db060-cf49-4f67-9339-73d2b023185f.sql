-- Update ADM-MAK documentation with corrected super-box plan
UPDATE stories 
SET content = '<h2>New Super-Box Template Requirements</h2>
<p><strong>Build a clean, straightforward template called "super-box":</strong></p>
<ul>
  <li>Self-contained component</li>
  <li>No complex logic</li>
  <li>Fully database-driven styling</li>
  <li>Category validation built-in</li>
</ul>

<h2>Required Props</h2>
<ul>
  <li><code>code</code> (required) - Story code like "SYS-WE2"</li>
  <li><code>title</code> (required) - Box title to display</li>
  <li><code>id</code> (required) - Auto-generated anchor at top of box for linking</li>
</ul>

<h2>Category Restrictions</h2>
<p><strong>super-box ONLY accepts stories with these categories:</strong></p>
<ul>
  <li>webtext</li>
  <li>admin</li>
</ul>
<p><strong>Other pages have fixed formatting:</strong></p>
<ul>
  <li>/story - Uses its own formatting (working fine as-is)</li>
  <li>/public-author-bios - Will have its own formatting rules (not active yet)</li>
</ul>

<h2>Color Preset Integration</h2>
<p><strong>Actual Color Presets in Database:</strong></p>
<table border="1" cellpadding="8" style="border-collapse: collapse; margin: 10px 0;">
  <tr><th>ID</th><th>Name</th><th>Font</th><th>Background</th><th>Border</th><th>Photo Border</th></tr>
  <tr><td>1</td><td>Story Text & Brown on Brown</td><td>#654321</td><td>#e8d3c0</td><td>#9c441a</td><td>#9c441a</td></tr>
  <tr><td>2</td><td>Orange on Orange</td><td>#F97316</td><td>rgba(249,115,22,0.2)</td><td>#F97316</td><td>#F97316</td></tr>
  <tr><td>3</td><td>Green on Green</td><td>#228B22</td><td>rgba(22,163,74,0.2)</td><td>#16a34a</td><td>#16a34a</td></tr>
  <tr><td>4</td><td>Black on Blue</td><td>#333333</td><td>#ADD8E6</td><td>#3b82f6</td><td>#3b82f6</td></tr>
  <tr><td>5</td><td>Black on Purple</td><td>#333333</td><td>rgba(99,102,241,0.2)</td><td>#6366f1</td><td>#6366f1</td></tr>
  <tr><td>6</td><td>Black on Red</td><td>#333333</td><td>#dc262633</td><td>#dc2626</td><td>#dc2626</td></tr>
  <tr><td>7</td><td>To be set</td><td>#333333</td><td>rgba(156,163,175,0.2)</td><td>#9ca3af</td><td>#9ca3af</td></tr>
  <tr><td>8</td><td>Yellow on Red</td><td>#FFD700</td><td>#8b0000</td><td>#FFD700</td><td>#dc2626</td></tr>
</table>

<p><strong>super-box should NOT know preset names - only where to find them:</strong></p>
<ul>
  <li>Component fetches color_preset_id from story record</li>
  <li>Component queries color_presets table by ID</li>
  <li>Uses anchor/reference system for quick internal location</li>
</ul>

<h2>Font Name Addition (NEW REQUIREMENT)</h2>
<p><strong>Add font_name column to color_presets table:</strong></p>
<ul>
  <li>Options: Georgia, Kalam, Lexend</li>
  <li>super-box applies font from preset</li>
  <li>Consider CSS class generation for each preset</li>
  <li>Auto-update CSS classes when presets change</li>
</ul>

<h2>HTML Override Priority</h2>
<p><strong>HTML coding in webtext MUST override color preset:</strong></p>
<ul>
  <li>Font name - inline HTML wins</li>
  <li>Font size - inline HTML wins</li>
  <li>Font color - inline HTML wins</li>
  <li>Bold - inline HTML wins</li>
  <li>Italic - inline HTML wins</li>
  <li>Underline - inline HTML wins</li>
</ul>
<p>This allows special emphasis in content created via /buddys_admin/super-text</p>

<h2>Anchor System</h2>
<p><strong>Every super-box creates an anchor at the top:</strong></p>
<ul>
  <li>ID placed at top of box (before title)</li>
  <li>Allows linking directly to box</li>
  <li>User sees top of box with title when navigating via link</li>
</ul>

<h2>Implementation Steps</h2>
<p><strong>Phase 1: Database Changes (1 credit)</strong></p>
<ul>
  <li>Add font_name column to color_presets table</li>
  <li>Populate with Georgia, Kalam, or Lexend for each preset</li>
  <li>Consider auto-generating CSS classes for presets</li>
</ul>

<p><strong>Phase 2: Build super-box Component (2 credits)</strong></p>
<ul>
  <li>Create src/components/templates/SuperBox.tsx</li>
  <li>Fetch story data by code</li>
  <li>Validate category (webtext or admin only)</li>
  <li>Fetch color preset if assigned</li>
  <li>Apply preset styling including font name</li>
  <li>Respect HTML overrides for formatting</li>
  <li>Create anchor at top of box</li>
</ul>

<p><strong>Phase 3: Update All Usage Sites (1-2 credits)</strong></p>
<ul>
  <li>Replace BaseWebTextBox with SuperBox</li>
  <li>Replace SysWe2WebTextBox with SuperBox</li>
  <li>Replace SysWelWebTextBox with SuperBox</li>
  <li>Replace WebTextBox with SuperBox</li>
  <li>Update all pages: Guide, Index, Club, HelpGpa, Writing, AdminManual, etc.</li>
</ul>

<p><strong>Phase 4: Cleanup (1 credit)</strong></p>
<ul>
  <li>Delete BaseWebTextBox.tsx</li>
  <li>Delete SysWe2WebTextBox.tsx</li>
  <li>Delete SysWelWebTextBox.tsx</li>
  <li>Delete SysLaaWebTextBox.tsx</li>
  <li>Delete WebTextBox.tsx</li>
  <li>Delete /buddys_admin/unified_story_system/ route and component</li>
  <li>Update WEBTEXT_TEMPLATES.md</li>
</ul>

<h2>Files to Create</h2>
<ul>
  <li>src/components/templates/SuperBox.tsx (new clean template)</li>
</ul>

<h2>Files to Delete</h2>
<ul>
  <li>src/components/templates/BaseWebTextBox.tsx</li>
  <li>src/components/templates/SysWe2WebTextBox.tsx</li>
  <li>src/components/templates/SysWelWebTextBox.tsx</li>
  <li>src/components/templates/SysLaaWebTextBox.tsx</li>
  <li>src/components/WebTextBox.tsx</li>
  <li>src/components/admin/UnifiedStoryDeprecated.tsx</li>
</ul>

<h2>Files to Modify</h2>
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
  <li>src/App.tsx (remove unified_story_system route)</li>
  <li>src/docs/WEBTEXT_TEMPLATES.md</li>
</ul>'
WHERE story_code = 'ADM-MAK';