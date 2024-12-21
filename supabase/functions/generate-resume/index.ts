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

    // First, generate the optimized resume
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
            content: 'You are an expert resume writer who helps optimize resumes for specific job descriptions.'
          },
          {
            role: 'user',
            content: `Please optimize this resume for the given job description. Make it more relevant and impactful while maintaining truthfulness and professional tone.
            
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

    // Then, generate interview questions
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
            content: 'You are an expert interviewer who creates relevant technical and behavioral questions based on resumes and job descriptions.'
          },
          {
            role: 'user',
            content: `Based on this optimized resume and job description, generate 10 relevant interview questions that the candidate should prepare for.
            
            Optimized Resume:
            ${generatedResume}
            
            Job Description:
            ${jobDescription}
            
            Please provide 10 specific interview questions that combine technical and behavioral aspects relevant to this position.`
          }
        ],
      }),
    })

    const questionsData = await questionsResponse.json()
    const interviewQuestions = questionsData.choices[0].message.content
      .split('\n')
      .filter(line => line.trim())
      .slice(0, 10)

    console.log('Successfully generated resume and interview questions')

    return new Response(
      JSON.stringify({ 
        generatedResume,
        interviewQuestions
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