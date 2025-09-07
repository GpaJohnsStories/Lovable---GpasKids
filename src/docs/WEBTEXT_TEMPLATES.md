# WebText Templates Documentation

## Overview

The WebText template system provides a consistent, beautiful way to display webtext content with automatic styling derived from the content itself.

## Usage

### Simple Usage (Recommended)
```tsx
import WebTextBox from "@/components/WebTextBox";

// Auto-styled webtext box
<WebTextBox code="SYS-WEL" />
<WebTextBox code="AAA-BBB" title="Custom Title" />
```

### Legacy Usage (Backward Compatible)
```tsx
// Still works for existing code
<WebTextBox 
  webtextCode="SYS-WEL" 
  borderColor="#0B3D91" 
  backgroundColor="#f0f8ff" 
/>
```

## Auto-Styling Features

The new WebText template automatically:

1. **Extracts Primary Color**: Finds the first hex color (`#RRGGBB`) in the webtext content
2. **Derives Theme Colors**:
   - Border: Lighter shade of primary color
   - Background: 20% opacity tint of primary color
   - Photo Mat: 33% opacity of primary color
   - Badge: 90% opacity of primary color

3. **Selects Best Image**:
   - Priority 1: `BIGICON=url` from content
   - Priority 2: `photo_link_1` from story record
   - Fallback: No image

4. **Applies SYS-WEL Layout**:
   - Rounded container with derived border and background
   - Top-right audio button
   - Left-side image with 3D frame effect
   - Right-side content with title and body
   - Bottom-right "WebText" badge
   - Code indicator overlay

## Content Authoring Guidelines

To create a new webtext that uses the template system:

### 1. Create Story Record
```sql
INSERT INTO stories (story_code, title, content, photo_link_1, ...)
VALUES ('ABC-DEF', 'My Title', '...content...', 'image-url', ...);
```

### 2. Include Primary Color in Content
The first hex color found in the content will be used for theming:
```html
<span style="color: #1E5A96;">This blue will theme the entire box</span>
<p>Regular content follows...</p>
```

### 3. Optional: Include BIGICON
For a specific display image, include in content:
```html
BIGICON = /path/to/special-image.png
<p>Rest of content...</p>
```

### 4. Use in Components
```tsx
<WebTextBox code="ABC-DEF" />
```

## Components

### WebTextBox (Main Component)
- **Props**: `code`, `title?`, `id?`
- **Features**: Auto-routing to appropriate template, backward compatibility
- **Usage**: Primary interface for all webtext display

### SysWelWebTextBox (Template Component)
- **Props**: `code`, `title?`, `id?`
- **Features**: SYS-WEL styling, auto-theming, image handling
- **Usage**: Used internally by WebTextBox for new-style webtexts

### ProportionalWebTextBox (Legacy Component)
- **Props**: Full legacy prop set including `borderColor`, `backgroundColor`
- **Features**: Original webtext display logic
- **Usage**: Used for backward compatibility when legacy props provided

## Theme Utilities

### `src/utils/webtextTheme.ts`

#### `extractFirstColor(content: string): string | null`
Finds the first hex color in HTML content.

#### `deriveColorsFromBase(baseColor: string): ColorTheme`
Creates a complete color theme from a base color.

#### `selectBestImage(story: any): string | null`
Chooses the best available image from story data.

#### `getWebtextTheme(story: any): WebtextTheme`
Complete theme extraction for a story.

## Migration Strategy

1. **Existing Code**: All existing `ProportionalWebTextBox` usage continues to work unchanged
2. **New Code**: Use `<WebTextBox code="..." />` for auto-styled boxes
3. **Gradual Migration**: Replace existing boxes one at a time when convenient

## Error Handling

- **Missing Code**: Shows "Error: No webtext code provided"
- **Code Not Found**: Shows "Coming Soon" with code indicator
- **Loading State**: Shows "Loading..." while fetching
- **Missing Colors**: Falls back to SYS-WEL blue (`#0B3D91`)
- **Missing Images**: Omits image section gracefully

## Examples

### Basic Auto-Styled Box
```tsx
<WebTextBox code="WEL-COM" />
```

### With Custom Title
```tsx
<WebTextBox code="NEW-BOX" title="Welcome Message" />
```

### Legacy Compatibility
```tsx
<WebTextBox 
  webtextCode="OLD-BOX"
  borderColor="#333"
  backgroundColor="#f9f9f9"
/>
```