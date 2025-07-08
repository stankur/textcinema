import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
})

export async function POST(request: NextRequest) {
  try {
    const { prompt, content } = await request.json()
    
    if (!prompt || !content) {
      return NextResponse.json(
        { error: 'Missing prompt or content' },
        { status: 400 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4.1-mini',
      messages: [
        {
          role: 'user',
          content: `${prompt}\n\nContent to evaluate: ${content}`
        }
      ],
      max_tokens: 10,
      temperature: 0
    })

    const result = completion.choices[0]?.message?.content?.trim() || 'NO'
    
    return NextResponse.json({ result })
  } catch (error) {
    console.error('OpenRouter API error:', error)
    return NextResponse.json(
      { error: 'Failed to process filter request' },
      { status: 500 }
    )
  }
}