import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting resume generation...');
    const { resume, jobDescription } = await req.json();

    if (!resume || !jobDescription) {
      throw new Error('Resume and job description are required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Calling OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert resume writer. Your task is to optimize the resume to match the job description perfectly. Follow these rules:
1. Create a clean, professional version of the resume
2. Remove ALL special characters (*, -, •) and replace with numbers for lists
3. Use these exact section headers: Professional Experience, Education, Skills, Certifications (if applicable)
4. Format each bullet point as a complete sentence starting with an action verb
5. Focus on matching keywords from the job description
6. Keep the output clean and simple - no markdown or special formatting
7. Number each point (1. 2. 3. etc)`
          },
          {
            role: 'user',
            content: `Original Resume:\n${resume}\n\nJob Description:\n${jobDescription}\n\nPlease create an optimized version of this resume that matches the job requirements. Use only numbers for lists, no special characters.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', await response.text());
      throw new Error('Failed to generate resume from OpenAI');
    }

    const data = await response.json();
    console.log('Successfully received OpenAI response');
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI');
    }

    const generatedResume = data.choices[0].message.content;
    console.log('Generated resume length:', generatedResume.length);

    return new Response(
      JSON.stringify({ 
        generatedResume,
        success: true
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('Error in generate-resume function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate resume',
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  }
});