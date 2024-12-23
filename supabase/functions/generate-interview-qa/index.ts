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
    console.log('Generating interview Q&A')

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are an expert interviewer. Generate exactly 5 relevant interview questions and detailed answers based on the resume and job description. Each Q&A should focus on matching the candidate's experience with job requirements. Format as JSON array with 'question' and 'answer' fields.`
          },
          {
            role: 'user',
            content: `Generate 5 interview questions and detailed answers based on this resume and job description:
            
            Resume:
            ${resume}
            
            Job Description:
            ${jobDescription}
            
            Format each Q&A as a JSON object with 'question' and 'answer' fields.`
          }
        ],
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      console.error('OpenAI Q&A generation error:', await response.text())
      throw new Error('Failed to generate interview Q&A')
    }

    const data = await response.json()
    console.log('Successfully generated interview Q&A')

    // Parse the response and ensure it's properly formatted
    const content = data.choices[0].message.content
    let qaArray
    try {
      qaArray = JSON.parse(content)
    } catch {
      // If not valid JSON, try to extract Q&A pairs from text
      const pairs = content.split(/Question \d+:/).filter(Boolean).map((pair, index) => {
        const [question, answer] = pair.split(/Answer:/).map(str => str.trim())
        return { question, answer }
      })
      qaArray = pairs.slice(0, 5)
    }

    return new Response(
      JSON.stringify({ interviewQA: qaArray }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in generate-interview-qa function:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate interview Q&A' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})