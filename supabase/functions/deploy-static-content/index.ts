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

// Store content in database for dynamic loading
async function storeContentForDeployment(
  supabase: any,
  storyCode: string, 
  content: string, 
  photoUrl?: string,
  audioUrl?: string,
  title?: string,
  author?: string
) {
  const deploymentData = {
    story_code: storyCode,
    content: content,
    photo_url: photoUrl || null,
    audio_url: audioUrl || null,
    title: title || null,
    author: author || null,
    deployed_at: new Date().toISOString(),
    is_active: true
  };

  // Insert or update deployment record
  const { error } = await supabase
    .from('deployed_content')
    .upsert(deploymentData, { 
      onConflict: 'story_code'
    });

  if (error) {
    throw new Error(`Failed to store deployment data: ${error.message}`);
  }

  console.log(`✅ Stored deployment data for ${storyCode}`);
}


async function deployStaticContent(storyIds: string[]) {
  console.log('🚀 Starting database-based content deployment for stories:', storyIds);
  
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
        console.log(`📝 Storing content for: ${mapping.pagePath}`);
        
        // Get the photo URL if specified
        const photoUrl = mapping.photoFieldName ? story[mapping.photoFieldName] : null;
        
        // Store content in database for dynamic loading
        await storeContentForDeployment(
          supabase,
          story.story_code,
          story.content || '',
          photoUrl,
          story.audio_url,
          story.title,
          story.author
        );

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

        console.log(`✅ Successfully deployed ${story.story_code}`);
        if (photoUrl) {
          console.log(`🖼️ Included photo from ${mapping.photoFieldName}: ${photoUrl}`);
        }

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
      message: `Successfully deployed ${successCount} stories to database`,
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
