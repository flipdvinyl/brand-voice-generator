import { NextRequest, NextResponse } from 'next/server'
import { perplexityCharacterVoiceDB } from '@/utils/perplexityCharacterDB'
import { completeCharacterVoiceDB } from '@/utils/completeCharacterDB'

interface CharacterRecommendationRequest {
  companyInfo: string
  brandVoice: string
  hashtags: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { companyInfo, brandVoice, hashtags }: CharacterRecommendationRequest = await request.json()

    // 퍼플렉시티에 전달할 캐릭터 메타데이터 (간소화된 DB 사용)
    const characterMetadata = perplexityCharacterVoiceDB

    // Perplexity API에 보낼 프롬프트 구성
    const prompt = `
회사 정보: ${companyInfo}
브랜드 보이스: ${brandVoice}
해시태그: ${hashtags.join(', ')}

수퍼톤 캐릭터 메타데이터:
${characterMetadata.map(char => 
  `${char.name} (${char.gender}, ${char.age}): ${char.description}
  사용 사례: ${char.usecases.join(', ')}
  스타일: ${char.styles.join(', ')}`
).join('\n\n')}

위 정보를 바탕으로 브랜드 보이스에 가장 적합한 수퍼톤 캐릭터 10개를 추천해주세요.
캐릭터 이름만 쉼표로 구분하여 나열해주세요. (예: Kate, Minwoo, Marie, Jin, ...)

추천 기준:
1. 브랜드 보이스와 캐릭터의 성격/톤이 일치하는지
2. 회사 정보와 캐릭터의 사용 사례가 맞는지
3. 해시태그와 관련된 용도에 적합한지
4. 성별, 나이대가 브랜드 이미지와 부합하는지

캐릭터 이름만 10개 나열해주세요:
`

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
