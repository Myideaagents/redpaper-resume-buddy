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

    const prompt = `As an expert resume writer, optimize the following resume for the given job description. 
    Make the resume more relevant and impactful while maintaining truthfulness and professional tone.
    
    Original Resume:
    ${resume}
    
    Job Description:
    ${jobDescription}
    
    Please provide an optimized version of the resume that better aligns with this job description.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert resume writer who helps optimize resumes for specific job descriptions.' },
          { role: 'user', content: prompt }
        ],
      }),
    })

    const data = await response.json()
    const generatedResume = data.choices[0].message.content

    return new Response(
      JSON.stringify({ generatedResume }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate resume' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})