import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    // System message to guide the AI's behavior
    const systemMessage = `You are a guitar tutor assistant. Your role is to:
    - Provide personalized guidance based on the student's progress
    - Give guitar and music advice
    - Help evaluate if songs are suitable for their skill level
    - NEVER give specific chord progressions or tabs
    - NEVER offer discounts or promotions
    - Keep responses focused on helping students improve their guitar skills
    - Base advice on their current progress metrics when available
    - Be encouraging and supportive
    - Keep responses concise and clear
    - Use a friendly, conversational tone

    Current user progress:
    ${JSON.stringify(userProgress, null, 2)}`;

    console.log('Sending request to OpenAI with message:', message);
    console.log('System message:', systemMessage);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
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
    console.log('OpenAI response:', data);

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