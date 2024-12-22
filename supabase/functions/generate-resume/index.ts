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

    // Generate the optimized resume
    const resumeResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume writer. Format the resume in a clean, professional way without any stars or dashes. Use proper spacing and sections.'
          },
          {
            role: 'user',
            content: `Please optimize this resume for the given job description. Make it more relevant and impactful while maintaining a clean, professional format.
            
            Resume:
            ${resume}
            
            Job Description:
            ${jobDescription}
            
            Please provide an optimized version of the resume that better aligns with this job description.`
          }
        ],
      }),
    })

    const resumeData = await resumeResponse.json()
    const generatedResume = resumeData.choices[0].message.content

    // Generate interview questions with answers
    const questionsResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Generate 10 interview questions with detailed answers based on the resume and job description. Format each as a JSON object with "question" and "answer" fields.'
          },
          {
            role: 'user',
            content: `Based on this optimized resume and job description, generate 10 relevant interview questions with detailed answers.
            
            Optimized Resume:
            ${generatedResume}
            
            Job Description:
            ${jobDescription}
            
            Please provide 10 specific interview questions with answers in JSON format.`
          }
        ],
      }),
    })

    const questionsData = await questionsResponse.json()
    const interviewQA = JSON.parse(questionsData.choices[0].message.content)

    return new Response(
      JSON.stringify({ 
        generatedResume,
        interviewQA
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate resume and questions' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})