import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-client-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('🚀 Deploy function started');
    
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

    console.log(`📚 Processing ${storyIds.length} stories`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the selected stories
    const { data: stories, error: fetchError } = await supabase
      .from('stories')
      .select('*')
      .in('id', storyIds)
      .eq('category', 'WebText');

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      throw new Error(`Failed to fetch stories: ${fetchError.message}`);
    }

    if (!stories || stories.length === 0) {
      throw new Error('No System stories found with the provided IDs');
    }

    console.log(`📚 Found ${stories.length} stories to deploy`);

    const deploymentResults = [];

    for (const story of stories) {
      console.log(`🔄 Processing story: ${story.story_code} - ${story.title}`);
      
      try {
        // Store content in database
        const deploymentData = {
          story_code: story.story_code,
          content: story.content || '',
          photo_url: story.photo_link_1 || null,
          photo_alt_text: story.photo_alt_1 || null,
          audio_url: story.audio_url || null,
          title: story.title || null,
          author: story.author || null,
          deployed_at: new Date().toISOString(),
          is_active: true
        };

        console.log('About to upsert deployment data for:', story.story_code);

        const { error: upsertError } = await supabase
          .from('deployed_content')
          .upsert(deploymentData, { 
            onConflict: 'story_code'
          });

        if (upsertError) {
          console.error('Upsert error:', upsertError);
          throw new Error(`Failed to store deployment data: ${upsertError.message}`);
        }

        deploymentResults.push({
          storyCode: story.story_code,
          title: story.title,
          success: true,
          contentLength: story.content?.length || 0,
          hasAudio: !!story.audio_url,
          hasPhoto: !!story.photo_link_1
        });

        console.log(`✅ Successfully deployed ${story.story_code}`);

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

    return new Response(JSON.stringify({
      success: true,
      message: `Successfully deployed ${successCount} stories to database`,
      results: deploymentResults,
      summary: {
        total: deploymentResults.length,
        successful: successCount,
        failed: failCount
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Deployment function error:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'Deployment failed' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});