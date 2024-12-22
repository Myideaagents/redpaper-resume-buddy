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
    console.log('Received request with resume length:', resume.length)
    console.log('Received request with job description length:', jobDescription.length)

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
            content: `You are an expert resume optimizer. Your task is to rewrite the resume in a clean, professional format following these strict rules:
            1. NEVER use asterisks (*), dashes (-), or any special characters for formatting
            2. Use clear section headers in title case like "Professional Experience", "Education", "Skills"
            3. Use one blank line between sections
            4. Use standard bullet points (•) for experience items
            5. Keep formatting minimal and professional
            6. Focus on matching skills and experience to the job description
            7. Use clear, action-oriented language
            8. Return ONLY the formatted resume text, no explanations or additional text`
          },
          {
            role: 'user',
            content: `Please optimize this resume for the following job description, following the formatting rules strictly:

            Resume:
            ${resume}
            
            Job Description:
            ${jobDescription}`
          }
        ],
        temperature: 0.7,
      }),
    })

    if (!resumeResponse.ok) {
      const error = await resumeResponse.text()
      console.error('OpenAI resume generation error:', error)
      throw new Error('Failed to generate resume')
    }

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
            content: 'Generate exactly 5 specific interview questions with detailed answers based on the resume and job description. Each question should focus on relevant experience and skills from the resume that match the job requirements. Format each Q&A pair clearly.'
          },
          {
            role: 'user',
            content: `Based on this resume and job description, generate 5 relevant interview questions with detailed answers:
            
            Resume:
            ${generatedResume}
            
            Job Description:
            ${jobDescription}
            
            Generate exactly 5 questions with answers, focusing on relevant skills and experience. Format each as "Question: [question text]" followed by "Answer: [detailed answer]"`
          }
        ],
        temperature: 0.7,
      }),
    })

    if (!questionsResponse.ok) {
      const error = await questionsResponse.text()
      console.error('OpenAI questions generation error:', error)
      throw new Error('Failed to generate interview questions')
    }

    const questionsData = await questionsResponse.json()
    console.log('Generated interview questions and answers')

    // Process the response to extract questions and answers
    const qaContent = questionsData.choices[0].message.content
    const qaArray = qaContent.split(/Question:/)
      .filter(Boolean)
      .map(qa => {
        const [question, ...answerParts] = qa.split(/Answer:/)
        return {
          question: question.trim(),
          answer: answerParts.join('Answer:').trim()
        }
      })
      .slice(0, 5)

    console.log('Number of QA pairs generated:', qaArray.length)

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
      JSON.stringify({ error: error.message || 'Failed to generate resume and questions' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})