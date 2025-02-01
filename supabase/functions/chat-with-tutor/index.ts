import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userProgress } = await req.json();
    console.log('Received message:', message);
    console.log('User progress:', userProgress);

    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    );

    // Format practice time to minutes
    const totalPracticeMinutes = Math.round((userProgress.practice_time || 0) / 60);
    const dailyPracticeMinutes = Math.round((userProgress.daily_practice_time || 0) / 60);

    // Create a personalized system message
    const systemMessage = `You are a friendly and encouraging guitar tutor assistant. Your role is to help students improve their guitar skills while maintaining a casual, supportive tone.

Current student progress:
- Total Points: ${userProgress.points || 0} points
- Total Practice Time: ${totalPracticeMinutes} minutes
- Today's Progress:
  * Points: ${userProgress.daily_points || 0} points
  * Practice Time: ${dailyPracticeMinutes} minutes

Guidelines:
1. Be encouraging and acknowledge their practice efforts
2. Reference their specific stats when giving advice
3. Keep responses focused on guitar learning
4. Maintain a casual, friendly tone
5. Offer specific practice suggestions based on their level
6. NEVER give specific chord progressions or tabs
7. NEVER offer discounts or promotions

Remember to:
- Acknowledge their practice consistency
- Mention specific achievements
- Make suggestions based on their current stats
- Keep the conversation engaging and motivational`;

    console.log('Sending request to OpenAI with system message');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to get response from OpenAI');
    }

    const data = await response.json();
    console.log('OpenAI response received');

    return new Response(JSON.stringify({
      response: data.choices[0].message.content,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-with-tutor function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});