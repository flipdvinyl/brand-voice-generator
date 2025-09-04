import { NextRequest, NextResponse } from 'next/server'
import { completeCharacterVoiceDB } from '@/utils/completeCharacterDB'
import { createCharacterFilteringPipeline } from '@/utils/characterFilter'

interface CharacterRecommendationRequest {
  companyInfo: string
  brandVoice: string
  hashtags: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { companyInfo, brandVoice, hashtags }: CharacterRecommendationRequest = await request.json()

    // 단계별 필터링 파이프라인 실행
    const filteringResult = createCharacterFilteringPipeline(
      companyInfo,
      brandVoice,
      hashtags
    )

    console.log('필터링 결과:', {
      해시태그분석: filteringResult.hashtagAnalysis,
      '1차필터링후보수': filteringResult.step1Filtered.length,
      '우선순위1후보수': filteringResult.step2Categorized.priority1.length,
      '우선순위2후보수': filteringResult.step2Categorized.priority2.length
    })

    // Perplexity API에 보낼 프롬프트 (새로운 단계별 필터링 로직)
    const prompt = filteringResult.similarityPrompt

    // Perplexity API 호출
    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    })

    if (!perplexityResponse.ok) {
      throw new Error('Perplexity API request failed')
    }

    const perplexityData = await perplexityResponse.json()
    const recommendedText = perplexityData.choices[0]?.message?.content || ''

    // 추천된 캐릭터 이름들 파싱
    const recommendedCharacters = recommendedText
      .split(',')
      .map((name: string) => name.trim())
      .filter((name: string) => name.length > 0)
      .slice(0, 10) // 최대 10개로 제한

    // 유효한 캐릭터 이름들만 필터링
    const validCharacters = recommendedCharacters.filter((name: string) =>
      completeCharacterVoiceDB.some(char => char.name === name)
    )

    // 유효한 캐릭터가 4개 미만이면 기본 캐릭터들로 보완
    if (validCharacters.length < 4) {
      const defaultCharacters = ['Kate', 'Minwoo', 'Marie', 'Jin']
      const additionalCharacters = defaultCharacters.filter(
        name => !validCharacters.includes(name)
      )
      validCharacters.push(...additionalCharacters)
    }

    return NextResponse.json({
      recommendedCharacters: validCharacters.slice(0, 4) // 최종적으로 4개만 반환
    })

  } catch (error) {
    console.error('Character recommendation error:', error)
    
    // 에러 발생 시 기본 캐릭터들 반환
    return NextResponse.json({
      recommendedCharacters: ['Kate', 'Minwoo', 'Marie', 'Jin']
    })
  }
}
