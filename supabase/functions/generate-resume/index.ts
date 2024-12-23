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
    const { resume, jobDescription } = await req.json();
    console.log('Processing resume optimization request');
    console.log('Resume length:', resume?.length);
    console.log('Job description length:', jobDescription?.length);

    if (!resume || !jobDescription) {
      throw new Error('Missing resume or job description');
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
            content: `You are a professional resume optimizer. Your task is to completely rewrite and optimize the resume to match the job description while following these strict rules:
              1. Remove ALL special characters including asterisks (*), dashes (-), and bullet points
              2. Use clear section headers in title case (e.g., "Professional Experience", "Education", "Skills")
              3. Use one blank line between sections
              4. Format experience items as complete sentences starting with action verbs
              5. Focus on matching skills and experience to the job description
              6. Use clear, action-oriented language
              7. Return ONLY the formatted resume text
              8. Use numbers and periods for lists (1. 2. 3. etc)
              9. Keep formatting minimal and clean
              10. Do not include any markdown or special formatting
              11. Start each experience point with a number followed by a period
              12. IMPORTANT: The output must be completely different from the input resume - do not return the same text
              13. Optimize and rewrite every bullet point to match the job requirements`
          },
          {
            role: 'user',
            content: `Please optimize this resume for the following job description:

            Resume:
            ${resume}
            
            Job Description:
            ${jobDescription}
            
            Remember: Create a completely new version of the resume, optimized for this specific job. Do not return the same text. Remove all special characters and use only numbers and periods for lists.`
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