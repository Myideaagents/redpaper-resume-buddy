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
    console.log('Received request with resume and job description')

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
            content: `You are an expert resume optimizer. Format the resume in a clean, professional way with these strict rules:
            1. Never use asterisks (*), dashes (-), or any special characters for formatting
            2. Use clear section headers like "Professional Experience", "Education", "Skills"
            3. Use proper spacing between sections (one blank line)
            4. Use standard bullet points (•) for experience items
            5. Keep formatting minimal and professional
            6. Focus on matching skills and experience to the job description
            7. Use clear, action-oriented language`
          },
          {
            role: 'user',
            content: `Please optimize this resume for the following job description. Remove any stars (*) or dashes (-) and ensure clean formatting:

            Resume:
            ${resume}
            
            Job Description:
            ${jobDescription}
            
            Please optimize the resume to match the job requirements while maintaining clean, professional formatting.`
          }
        ],
      }),
    })

    const resumeData = await resumeResponse.json()
    console.log('Generated optimized resume')
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
            content: 'Generate 5 specific interview questions with detailed answers based on the resume and job description. Each question should focus on relevant experience and skills from the resume that match the job requirements.'
          },
          {
            role: 'user',
            content: `Based on this optimized resume and job description, generate 5 relevant interview questions with detailed answers. Make each question specific to the candidate's experience and the job requirements:
            
            Resume:
            ${generatedResume}
            
            Job Description:
            ${jobDescription}
            
            Format as 5 distinct question-answer pairs, focusing on relevant skills and experience.`
          }
        ],
      }),
    })

    const questionsData = await questionsResponse.json()
    console.log('Generated interview questions and answers')

    // Process the response to extract questions and answers
    const qaContent = questionsData.choices[0].message.content
    const qaArray = qaContent.split(/(?=Question \d:)/).filter(Boolean).map(qa => {
      const [questionPart, ...answerParts] = qa.split(/Answer:|Response:/)
      return {
        question: questionPart.replace(/^Question \d:/, '').trim(),
        answer: answerParts.join('').trim()
      }
    }).slice(0, 5) // Ensure we only get 5 Q&A pairs

    console.log('Processed QA pairs:', qaArray.length)

    return new Response(
      JSON.stringify({ 
        generatedResume,
        interviewQA: qaArray
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in generate-resume function:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate resume and questions' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})