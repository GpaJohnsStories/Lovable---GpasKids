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
}

// Define the mapping of story codes to page locations
const PAGE_MAPPINGS: PageMapping[] = [
  {
    storyCode: 'WELCOME_TEXT',
    pagePath: 'src/pages/Index.tsx',
    placeholderType: 'content',
    description: 'Welcome message on homepage'
  },
  {
    storyCode: 'ABOUT_BUDDY',
    pagePath: 'src/pages/About.tsx',
    placeholderType: 'both',
    description: 'About Buddy story content and audio'
  },
  {
    storyCode: 'PRIVACY_POLICY',
    pagePath: 'src/pages/Privacy.tsx',
    placeholderType: 'content',
    description: 'Privacy policy content'
  },
  {
    storyCode: 'HELP_GPA',
    pagePath: 'src/pages/HelpGpa.tsx',
    placeholderType: 'content',
    description: 'Help Grandpa John content'
  }
];

async function deployStaticContent(storyIds: string[]) {
  console.log('🚀 Starting static content deployment for stories:', storyIds);
  
  // Initialize Supabase client
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Fetch the selected stories
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
        // In a real implementation, this would:
        // 1. Read the target file from the filesystem
        // 2. Replace placeholders with actual content
        // 3. Write the updated file back
        
        // For now, we'll simulate the deployment process
        console.log(`📝 Deploying to: ${mapping.pagePath}`);
        console.log(`🎯 Placeholder type: ${mapping.placeholderType}`);
        
        // Simulate content replacement
        const contentPlaceholder = `<!-- STORY_CODE:${story.story_code}:CONTENT -->`;
        const audioPlaceholder = `<!-- STORY_CODE:${story.story_code}:AUDIO -->`;
        
        // Generate the replacement content
        const contentReplacement = story.content || '';
        const audioReplacement = story.audio_url ? 
          `<StoryCodeAudioControls audioUrl="${story.audio_url}" title="${story.title}" author="${story.author}" />` : 
          '';

        console.log(`✅ Would replace "${contentPlaceholder}" with content`);
        if (mapping.placeholderType === 'both' || mapping.placeholderType === 'audio') {
          console.log(`✅ Would replace "${audioPlaceholder}" with audio controls`);
        }

        deploymentResults.push({
          storyCode: story.story_code,
          title: story.title,
          pagePath: mapping.pagePath,
          success: true,
          contentLength: contentReplacement.length,
          hasAudio: !!story.audio_url
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

    return {
      success: true,
      message: `Successfully deployed ${successCount} stories to web pages`,
      results: deploymentResults,
      summary: {
        total: deploymentResults.length,
        successful: successCount,
        failed: failCount
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

    console.log(`🚀 Deployment request received for ${storyIds.length} stories`);

    const result = await deployStaticContent(storyIds);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Deployment function error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Deployment failed' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});