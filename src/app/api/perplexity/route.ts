import { NextRequest, NextResponse } from 'next/server'

const PERPLEXITY_API_KEY = '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'
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions'

export async function POST(request: NextRequest) {
  try {
    const { companyName, prompt } = await request.json()

    if (!companyName || !prompt) {
      return NextResponse.json(
        { error: '회사명과 프롬프트가 필요합니다.' },
        { status: 400 }
      )
    }

    // Perplexity API 호출
    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar', // 올바른 모델명으로 수정
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Perplexity API response:', response.status, errorData)
      throw new Error(`Perplexity API error: ${response.status} - ${errorData}`)
    }

    const data = await response.json()
    const info = data.choices[0]?.message?.content || '정보를 가져올 수 없습니다.'

    return NextResponse.json({ info })

  } catch (error) {
    console.error('Perplexity API error:', error)
    return NextResponse.json(
      { error: 'Perplexity API 호출 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
