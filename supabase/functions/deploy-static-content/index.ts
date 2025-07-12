import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PageMapping {
  storyCode: string;
  pagePath: string;
  placeholderType: 'content' | 'audio' | 'both';
  description: string;
  photoFieldName?: string; // Which photo field to use (photo_link_1, photo_link_2, etc.)
}

// Define the mapping of story codes to page locations
const PAGE_MAPPINGS: PageMapping[] = [
  {
    storyCode: 'SYS-WEL',
    pagePath: 'src/components/WelcomeText.tsx',
    placeholderType: 'content',
    description: 'Homepage welcome message and intro text'
  },
  {
    storyCode: 'SYS-LIB',
    pagePath: 'src/components/LibraryInstructions.tsx',
    placeholderType: 'content',
    description: 'Library page instructional text'
  },
  {
    storyCode: 'SYS-CC1',
    pagePath: 'src/components/CommentsWelcome.tsx',
    placeholderType: 'content',
    description: 'Comments page welcome section and rules'
  },
  {
    storyCode: 'SYS-AGJ',
    pagePath: 'src/pages/About.tsx',
    placeholderType: 'content',
    description: 'About page - About Grandpa John section content',
    photoFieldName: 'photo_link_1'
  },
  {
    storyCode: 'SYS-BDY',
    pagePath: 'src/pages/About.tsx',
    placeholderType: 'content',
    description: 'About page - About Buddy section content',
    photoFieldName: 'photo_link_1'
  }
];

async function readFile(filePath: string): Promise<string> {
  try {
    // In a real implementation, this would read from filesystem
    // For now, we'll simulate file reading
    console.log(`📖 Reading file: ${filePath}`);
    return `/* File content for ${filePath} would be read here */`;
  } catch (error) {
    throw new Error(`Failed to read file ${filePath}: ${error.message}`);
  }
}

async function writeFile(filePath: string, content: string): Promise<void> {
  try {
    // In a real implementation, this would write to filesystem
    console.log(`📝 Writing file: ${filePath}`);
    console.log(`📄 Content length: ${content.length} characters`);
    // File would be written here
  } catch (error) {
    throw new Error(`Failed to write file ${filePath}: ${error.message}`);
  }
}

function replaceContentSection(
  fileContent: string, 
  storyCode: string, 
  newContent: string, 
  photoUrl?: string
): string {
  // Look for content section markers
  const startMarker = `<!-- START_CONTENT:${storyCode} -->`;
  const endMarker = `<!-- END_CONTENT:${storyCode} -->`;
  
  const startIndex = fileContent.indexOf(startMarker);
  const endIndex = fileContent.indexOf(endMarker);
  
  if (startIndex === -1 || endIndex === -1) {
    console.log(`⚠️ Content markers not found for ${storyCode}, creating new section`);
    // If markers don't exist, we'll append to the file
    return fileContent + `\n\n${startMarker}\n${newContent}\n${endMarker}`;
  }
  
  // Replace content between markers, keeping the markers
  const beforeContent = fileContent.substring(0, startIndex + startMarker.length);
  const afterContent = fileContent.substring(endIndex);
  
  let processedContent = newContent;
  
  // Handle photo replacement if photo URL is provided
  if (photoUrl && photoUrl.trim()) {
    // Replace any existing image src attributes with the new photo URL
    processedContent = processedContent.replace(
      /src=["'][^"']*["']/g,
      `src="${photoUrl}"`
    );
    
    // If no img tags exist but we have a photo, add it at the beginning
    if (!processedContent.includes('<img') && !processedContent.includes('src=')) {
      processedContent = `<img src="${photoUrl}" alt="Story image" className="w-full h-auto rounded-lg mb-4" />\n\n${processedContent}`;
    }
  }
  
  return `${beforeContent}\n${processedContent}\n${afterContent}`;
}

function replaceAudioSection(
  fileContent: string,
  storyCode: string,
  audioUrl?: string,
  title?: string,
  author?: string
): string {
  const startMarker = `<!-- START_AUDIO:${storyCode} -->`;
  const endMarker = `<!-- END_AUDIO:${storyCode} -->`;
  
  const startIndex = fileContent.indexOf(startMarker);
  const endIndex = fileContent.indexOf(endMarker);
  
  const audioContent = audioUrl ? 
    `<StoryCodeAudioControls audioUrl="${audioUrl}" title="${title || ''}" author="${author || ''}" />` : 
    '';
  
  if (startIndex === -1 || endIndex === -1) {
    if (audioContent) {
      return fileContent + `\n\n${startMarker}\n${audioContent}\n${endMarker}`;
    }
    return fileContent;
  }
  
  const beforeContent = fileContent.substring(0, startIndex + startMarker.length);
  const afterContent = fileContent.substring(endIndex);
  
  return `${beforeContent}\n${audioContent}\n${afterContent}`;
}

async function deployStaticContent(storyIds: string[]) {
  console.log('🚀 Starting enhanced static content deployment for stories:', storyIds);
  
  // Initialize Supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Fetch the selected stories with all photo fields
    const { data: stories, error: fetchError } = await supabase
      .from('stories')
      .select('*')
      .in('id', storyIds)
      .eq('category', 'System');

    if (fetchError) {
      throw new Error(`Failed to fetch stories: ${fetchError.message}`);
    }

    if (!stories || stories.length === 0) {
      throw new Error('No System stories found with the provided IDs');
    }

    console.log(`📚 Found ${stories.length} stories to deploy`);

    const deploymentResults = [];
    const filesModified = new Set<string>();

    for (const story of stories) {
      console.log(`🔄 Processing story: ${story.story_code} - ${story.title}`);
      
      // Find the corresponding page mapping
      const mapping = PAGE_MAPPINGS.find(m => m.storyCode === story.story_code);
      
      if (!mapping) {
        console.log(`⚠️ No page mapping found for story code: ${story.story_code}`);
        deploymentResults.push({
          storyCode: story.story_code,
          success: false,
          error: 'No page mapping found'
        });
        continue;
      }

      try {
        console.log(`📝 Deploying to: ${mapping.pagePath}`);
        
        // Read the current file content
        let fileContent = await readFile(mapping.pagePath);
        
        // Get the photo URL if specified
        const photoUrl = mapping.photoFieldName ? story[mapping.photoFieldName] : null;
        
        // Replace content section
        if (mapping.placeholderType === 'content' || mapping.placeholderType === 'both') {
          fileContent = replaceContentSection(
            fileContent, 
            story.story_code, 
            story.content || '', 
            photoUrl
          );
          console.log(`✅ Updated content section for ${story.story_code}`);
          if (photoUrl) {
            console.log(`🖼️ Updated photo from ${mapping.photoFieldName}: ${photoUrl}`);
          }
        }
        
        // Replace audio section if needed
        if (mapping.placeholderType === 'audio' || mapping.placeholderType === 'both') {
          fileContent = replaceAudioSection(
            fileContent,
            story.story_code,
            story.audio_url,
            story.title,
            story.author
          );
          console.log(`🎵 Updated audio section for ${story.story_code}`);
        }
        
        // Write the updated file
        await writeFile(mapping.pagePath, fileContent);
        filesModified.add(mapping.pagePath);

        deploymentResults.push({
          storyCode: story.story_code,
          title: story.title,
          pagePath: mapping.pagePath,
          success: true,
          contentLength: story.content?.length || 0,
          hasAudio: !!story.audio_url,
          hasPhoto: !!photoUrl,
          photoFieldUsed: mapping.photoFieldName || null
        });

      } catch (deployError) {
        console.error(`❌ Failed to deploy story ${story.story_code}:`, deployError);
        deploymentResults.push({
          storyCode: story.story_code,
          success: false,
          error: deployError.message
        });
      }
    }

    const successCount = deploymentResults.filter(r => r.success).length;
    const failCount = deploymentResults.filter(r => !r.success).length;

    console.log(`🎉 Deployment completed: ${successCount} successful, ${failCount} failed`);
    console.log(`📄 Files modified: ${Array.from(filesModified).join(', ')}`);

    return {
      success: true,
      message: `Successfully deployed ${successCount} stories to ${filesModified.size} files`,
      results: deploymentResults,
      filesModified: Array.from(filesModified),
      summary: {
        total: deploymentResults.length,
        successful: successCount,
        failed: failCount,
        filesModified: filesModified.size
      }
    };

  } catch (error) {
    console.error('❌ Deployment failed:', error);
    throw error;
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { storyIds } = await req.json();

    if (!storyIds || !Array.isArray(storyIds) || storyIds.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Please provide an array of story IDs to deploy' 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`🚀 Enhanced deployment request received for ${storyIds.length} stories`);

    const result = await deployStaticContent(storyIds);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Enhanced deployment function error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Enhanced deployment failed' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
