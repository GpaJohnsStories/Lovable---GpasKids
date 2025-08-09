import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount } = await req.json();

    // Validate amount
    if (!amount || typeof amount !== 'number' || amount <= 0 || amount > 50) {
      console.error('Invalid amount:', amount);
      return new Response(
        JSON.stringify({ error: 'Invalid donation amount' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Set client type for trusted operations
    await supabase.rpc('set_config', {
      setting_name: 'app.client_type',
      setting_value: 'service'
    });

    // Get current year and month
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // JavaScript months are 0-indexed

    console.log(`Recording donation: $${amount} for ${year}-${month}`);

    // Update or insert monthly donation record
    const { data, error } = await supabase
      .from('donations_monthly')
      .upsert(
        {
          year,
          month,
          total_amount: amount,
          donation_count: 1,
          updated_at: new Date().toISOString()
        },
        {
          onConflict: 'year,month',
          ignoreDuplicates: false
        }
      )
      .select()
      .single();

    if (error) {
      // If record exists, we need to update it by adding to existing values
      console.log('Record exists, updating existing totals...');
      
      const { data: existingData, error: fetchError } = await supabase
        .from('donations_monthly')
        .select('total_amount, donation_count')
        .eq('year', year)
        .eq('month', month)
        .single();

      if (fetchError) {
        console.error('Error fetching existing record:', fetchError);
        throw fetchError;
      }

      const { error: updateError } = await supabase
        .from('donations_monthly')
        .update({
          total_amount: Number(existingData.total_amount) + amount,
          donation_count: existingData.donation_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('year', year)
        .eq('month', month);

      if (updateError) {
        console.error('Error updating donation record:', updateError);
        throw updateError;
      }
    }

    console.log('Donation tracking successful');

    return new Response(
      JSON.stringify({ success: true, year, month, amount }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in track-donation function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});