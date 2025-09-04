import { NextRequest, NextResponse } from 'next/server'
import { completeCharacterVoiceDB } from '@/utils/completeCharacterDB'
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
        max_tokens: 200,
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

    // 추천된 캐릭터 이름들 파싱 (강화된 로직)
    const recommendedCharacters = recommendedText
      .split('\n')
      .join(' ')
      .split(',')
      .map((name: string) => name.trim().replace(/^\d+\.\s*/, '').replace(/^-\s*/, '')) // 숫자 번호 및 대시 제거
      .filter((name: string) => {
        // 유효한 캐릭터 이름만 필터링
        const cleanName = name.trim()
        return cleanName.length > 0 && 
               cleanName.length < 50 && 
               !cleanName.includes('해시태그') &&
               !cleanName.includes('캐릭터 데이터베이스') &&
               !cleanName.includes('name') &&
               !cleanName.includes('description') &&
               !cleanName.includes('age') &&
               !cleanName.includes('gender') &&
               !cleanName.includes('usecases') &&
               !cleanName.includes('styles')
      })
      .slice(0, 10) // 최대 10개로 제한

    console.log('파싱된 캐릭터 이름들:', recommendedCharacters)

    // 유효한 캐릭터 이름들만 필터링
    const validCharacters = recommendedCharacters.filter((name: string) =>
      completeCharacterVoiceDB.some(char => char.name === name)
    )

    console.log('유효한 캐릭터들:', validCharacters)

    // 유효한 캐릭터가 4개 미만이면 기본 캐릭터들로 보완
    if (validCharacters.length < 4) {
      const defaultCharacters = ['Kate', 'Minwoo', 'Marie', 'Jin']
      const additionalCharacters = defaultCharacters.filter(
        name => !validCharacters.includes(name)
      )
      validCharacters.push(...additionalCharacters)
      console.log('기본 캐릭터로 보완:', additionalCharacters)
    }

    const finalResult = validCharacters.slice(0, 4)
    console.log('최종 반환 결과:', finalResult)

    return NextResponse.json({
      recommendedCharacters: finalResult
    })

  } catch (error) {
    console.error('Character recommendation error:', error)
    
    // 에러 발생 시 기본 캐릭터들 반환
    return NextResponse.json({
      recommendedCharacters: ['Kate', 'Minwoo', 'Marie', 'Jin']
    })
  }
}
