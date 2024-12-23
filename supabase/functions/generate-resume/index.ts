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
      console.error('Missing required fields');
      throw new Error('Resume and job description are required');
    }

    console.log('Resume length:', resume.length);
    console.log('Job description length:', jobDescription.length);

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
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
            content: `You are an expert resume writer. Your task is to completely rewrite and optimize the resume to match the job description. Follow these rules exactly:

1. Create a completely new version of the resume
2. Remove ALL special characters (*, -, •)
3. Use these exact section headers:
   - Professional Experience
   - Education
   - Skills
   - Certifications (if any)
4. Use one blank line between sections
5. Format each bullet point as a complete sentence starting with an action verb
6. Number each point (1. 2. 3. etc)
7. Focus heavily on matching the job requirements
8. Use clear, professional language
9. Do not include any formatting or markdown
10. Ensure the output is completely different from the input
11. Optimize every point to highlight relevant experience

Format the resume exactly like this example:

Professional Experience

1. Led development of enterprise software platform resulting in 40% increase in efficiency.
2. Implemented automated testing framework reducing bug reports by 60%.

Skills

1. Advanced expertise in React and TypeScript development.
2. Strong background in cloud infrastructure and AWS services.`
          },
          {
            role: 'user',
            content: `Original Resume:
${resume}

Job Description:
${jobDescription}

Create a completely new optimized version of this resume that matches the job requirements. Remove ALL special characters and use only numbers and periods for lists.`
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