import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { resume, jobDescription } = await req.json()
    console.log('Processing resume optimization request')

    // Generate the optimized resume
    const resumeResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a professional resume optimizer. Your task is to rewrite the resume to match the job description while following these strict rules:
            1. DO NOT use any special characters like asterisks (*), dashes (-), or bullet points
            2. Use clear section headers in title case (e.g., "Professional Experience", "Education", "Skills")
            3. Use one blank line between sections
            4. Format experience items as complete sentences
            5. Focus on matching skills and experience to the job description
            6. Use clear, action-oriented language
            7. Return ONLY the formatted resume text
            8. Use numbers and periods for lists (1. 2. 3. etc)
            9. Keep formatting minimal and clean`
          },
          {
            role: 'user',
            content: `Please optimize this resume for the following job description:

            Resume:
            ${resume}
            
            Job Description:
            ${jobDescription}
            
            Remember: Do not use any special characters, bullet points, or dashes. Use numbers and periods for lists.`
          }
        ],
        temperature: 0.7,
      }),
    })

    if (!resumeResponse.ok) {
      console.error('OpenAI resume generation error:', await resumeResponse.text())
      throw new Error('Failed to generate resume')
    }

    const resumeData = await resumeResponse.json()
    console.log('Successfully generated optimized resume')
    const generatedResume = resumeData.choices[0].message.content

    // Return just the generated resume for now
    return new Response(
      JSON.stringify({ 
        generatedResume,
        interviewQA: [] // We'll handle this separately through a new endpoint
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in generate-resume function:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate resume' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})