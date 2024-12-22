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

    // Generate the optimized resume with clear formatting instructions
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
            content: `You are an expert resume writer. Format the resume in a clean, professional way with these strict rules:
            1. Do not use any asterisks (*), stars, or dashes (-)
            2. Use clear section headers in title case (e.g., "Work Experience", "Education")
            3. Use proper spacing between sections
            4. Use standard bullet points (•) for lists if needed
            5. Keep the formatting minimal and professional`
          },
          {
            role: 'user',
            content: `Please optimize this resume for the given job description, following the formatting rules strictly:
            
            Resume:
            ${resume}
            
            Job Description:
            ${jobDescription}`
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
            content: 'Generate 5 specific interview questions with detailed answers based on the resume and job description. Each question should be relevant to the candidate\'s experience and the job requirements.'
          },
          {
            role: 'user',
            content: `Based on this resume and job description, generate 5 relevant interview questions with detailed answers:
            
            Resume:
            ${generatedResume}
            
            Job Description:
            ${jobDescription}
            
            Format each QA pair as a complete, detailed response.`
          }
        ],
      }),
    })

    const questionsData = await questionsResponse.json()
    const interviewQA = questionsData.choices[0].message.content
      .split(/\d+\.\s+/)
      .filter(qa => qa.trim())
      .map(qa => {
        const [question, ...answerParts] = qa.split(/\nAnswer:|\nA:/);
        return {
          question: question.trim(),
          answer: answerParts.join('').trim()
        };
      });

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