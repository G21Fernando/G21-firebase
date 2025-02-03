import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Chat with Tutor v2.0 - Starting function execution');
  console.log('Request method:', req.method);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.log('No authorization header found');
      throw new Error('No authorization header');
    }

    console.log('Authorization header found:', authHeader.substring(0, 20) + '...');

    // Check for OpenAI API key
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) {
      console.error('OpenAI API key not found in environment');
      throw new Error('OpenAI API key not configured');
    }
    console.log('OpenAI API key found');

    // Create Supabase client with auth context
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

    // Verify the JWT token
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      throw new Error('Invalid JWT token');
    }

    console.log('Authenticated user:', user.id);

    // Parse request body
    let requestBody;
    try {
      const text = await req.text();
      console.log('Raw request body:', text);
      requestBody = JSON.parse(text);
    } catch (error) {
      console.error('Error parsing request body:', error);
      throw new Error('Invalid request body format');
    }

    console.log('Parsed request body:', requestBody);

    const { message, userProgress } = requestBody;
    
    if (!message || !userProgress) {
      console.error('Missing required data in request body');
      throw new Error('Missing required data in request body');
    }

    console.log('Received message:', message);
    console.log('User progress:', userProgress);

    // Get the latest chord sprinter result
    const { data: chordResults, error: chordError } = await supabaseAdmin
      .from('chord_sprinter_results')
      .select('reps')
      .eq('user_id', userProgress.user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (chordError) {
      console.error('Error fetching chord results:', chordError);
    } else {
      console.log('Chord results:', chordResults);
    }

    // Get the latest practice session
    const { data: lastSession, error: sessionError } = await supabaseAdmin
      .from('user_sessions')
      .select('practice_duration')
      .eq('user_id', userProgress.user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (sessionError) {
      console.error('Error fetching last session:', sessionError);
    } else {
      console.log('Last session:', lastSession);
    }

    // Format practice times for better context
    const totalPracticeMinutes = Math.round((userProgress.practice_time || 0) / 60);
    const dailyPracticeMinutes = Math.round((userProgress.daily_practice_time || 0) / 60);
    const lastSessionMinutes = lastSession ? Math.round(lastSession.practice_duration / 60) : 0;

    // Create a detailed system message with user context
    const systemMessage = `You are a friendly and encouraging guitar tutor assistant. Your role is to help students improve their guitar skills while maintaining a casual, supportive tone.

Current student progress:
- Total Points: ${userProgress.points || 0} points
- Total Practice Time: ${totalPracticeMinutes} minutes
- Today's Progress:
  * Points: ${userProgress.daily_points || 0} points
  * Practice Time: ${dailyPracticeMinutes} minutes
- Last Practice Session: ${lastSessionMinutes} minutes
${chordResults ? `- Latest Chord Sprint: ${chordResults.reps} transitions` : ''}

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

    console.log('Sending request to OpenAI');
    console.log('System message:', systemMessage);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
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
    console.log('OpenAI response received successfully');
    console.log('Response data:', data);

    return new Response(JSON.stringify({
      response: data.choices[0].message.content,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-with-tutor-v2 function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.message === 'Invalid JWT token' ? 401 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});