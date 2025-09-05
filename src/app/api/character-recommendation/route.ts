import { NextRequest, NextResponse } from 'next/server'
import { createCharacterFilteringPipeline } from '@/utils/characterFilter'

interface CharacterRecommendationRequest {
  hashtags: string[]
  brandVoiceText?: string
}

export async function POST(request: NextRequest) {
  try {
    const { hashtags, brandVoiceText }: CharacterRecommendationRequest = await request.json()

    // 단계별 필터링 파이프라인 실행 (해시태그 + 브랜드 보이스 사용)
    const filteringResult = createCharacterFilteringPipeline(hashtags, brandVoiceText)


    // Perplexity API에 보낼 프롬프트 (새로운 단계별 필터링 로직)
    const prompt = filteringResult.similarityPrompt

    // Perplexity API 호출
    console.log('퍼플렉시티 API 키 존재 여부:', !!process.env.PERPLEXITY_API_KEY)
    console.log('퍼플렉시티 프롬프트 길이:', prompt.length)
    console.log('전달받은 해시태그:', hashtags)
    console.log('전달받은 브랜드 보이스:', brandVoiceText)
    console.log('생성된 프롬프트:', prompt)
    
    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 10000,
        temperature: 0.7,
        top_p: 0.9
      }),
    })

    console.log('퍼플렉시티 응답 상태:', perplexityResponse.status, perplexityResponse.statusText)

    if (!perplexityResponse.ok) {
      const errorText = await perplexityResponse.text()
      console.error('퍼플렉시티 API 에러 응답:', errorText)
      throw new Error(`Perplexity API request failed: ${perplexityResponse.status} ${perplexityResponse.statusText}`)
    }

    const perplexityData = await perplexityResponse.json()
    const recommendedText = perplexityData.choices[0]?.message?.content || ''

    console.log('퍼플렉시티 원본 응답:', recommendedText)

    // 퍼플렉시티가 반환한 캐릭터 이름들 파싱
    const recommendedCharacters = recommendedText
      .split(',')
      .map((name: string) => name.trim())
      .filter((name: string) => {
        const cleanName = name.trim()
        return cleanName.length > 0 && 
               cleanName.length < 50 && 
               !cleanName.includes('추천') &&
               !cleanName.includes('캐릭터') &&
               !cleanName.includes('데이터베이스')
      })

    console.log('파싱된 캐릭터 이름들:', recommendedCharacters)

    // 추천 이유 생성 프롬프트 생성
    const recommendationReasonPrompt = filteringResult.recommendationReasonPrompt(recommendedCharacters)
    
    // 추천 이유 요청을 위한 Perplexity API 호출
    console.log('추천 이유 프롬프트:', recommendationReasonPrompt)
    
    const reasonResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'user',
            content: recommendationReasonPrompt
          }
        ],
        max_tokens: 10000,
        temperature: 0.7,
        top_p: 0.9
      }),
    })

    let recommendationReasons: { [key: string]: string } = {}
    
    if (reasonResponse.ok) {
      const reasonData = await reasonResponse.json()
      const reasonText = reasonData.choices[0]?.message?.content || ''
      console.log('추천 이유 응답:', reasonText)
      
      // 추천 이유 파싱
      const reasonLines = reasonText.split('\n').filter((line: string) => line.trim())
      reasonLines.forEach((line: string) => {
        const colonIndex = line.indexOf(':')
        if (colonIndex > 0) {
          const characterName = line.substring(0, colonIndex).trim()
          const reason = line.substring(colonIndex + 1).trim()
          if (characterName && reason) {
            recommendationReasons[characterName] = reason
          }
        }
      })
    } else {
      console.error('추천 이유 API 에러:', reasonResponse.status, reasonResponse.statusText)
    }

    console.log('파싱된 추천 이유들:', recommendationReasons)

    return NextResponse.json({
      recommendedCharacters: recommendedCharacters,
      recommendationReasons: recommendationReasons
    })

  } catch (error) {
    console.error('Character recommendation error:', error)
    throw error
  }
}