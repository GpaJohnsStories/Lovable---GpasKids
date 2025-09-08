# WEBTEXT TEMPLATES

Templates for creating web text boxes in the application.

## Available Templates

### SuperWebBox
Modern template with color theming and proportional layout.

**Usage:**
```jsx
<SuperWebBox 
  code="STORY_CODE" 
  color="#FF6B35" 
  title="Optional Title Override"
/>
```

**Features:**
- Uses direct database fields (title, tagline, author, excerpt)
- 4px border color matching
- 3px image border
- Luminance-based background tinting
- Responsive image layout
- 24px text content with theme color
- Audio button integration

**Field Sources:**
- Title: story.title (database field)
- Tagline: story.tagline (database field) 
- Author: story.author (database field)
- Image: story.photo_link_1 (database field)
- Content: story.content (with legacy tokens stripped)

## Token System

### Supported Tokens
- `{{ICON}}filename.ext{{/ICON}}` - Inline icons (55px x 55px)
- `{{ICON: filename.ext}}` - Alternative icon syntax
- `{{PRT-*}}` tokens - Print system tokens

### Removed Tokens
- `{{TITLE}}`, `{{TAGLINE}}`, `{{AUTHOR}}`, `{{EXCERPT}}` - Use database fields
- `{{BIGICON}}` - Use photo_link_1 database field

## Implementation Notes
- All header information comes from database fields
- Legacy token wrappers are stripped from content during rendering
- Icon tokens continue to work for inline content icons
- Print tokens remain functional for print system