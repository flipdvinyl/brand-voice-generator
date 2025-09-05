import { CompleteCharacterVoice } from './completeCharacterDB'
import { perplexityCharacterVoiceDB } from './perplexityCharacterDB'

// 3차 필터링: 해시태그 기반 유사도 랭킹 (퍼플렉시티에게 위임)
export function prepareSimilarityRankingPrompt(
  priority1: CompleteCharacterVoice[],
  priority2: CompleteCharacterVoice[],
  otherHashtags: string[],
  brandVoiceText?: string
): string {
  // 캐릭터 데이터베이스를 텍스트 형태로 변환
  const characterDataText = perplexityCharacterVoiceDB
    .map(char => `${char.name} (${char.gender}, ${char.age}): ${char.description || 'No description'} - Usecases: ${char.usecases.join(', ')} - Styles: ${char.styles.join(', ')}`)
    .join('\n')

  return `
다음 캐릭터 보이스 데이터베이스에서 브랜드 보이스와 가장 유사한 캐릭터 6개를 추천해주세요.

캐릭터 데이터베이스:
${characterDataText}

브랜드 보이스 정보:
- 설명: ${brandVoiceText}
- 해시태그: ${otherHashtags.join(', ')}

중요 규칙:
1. 반드시 위 데이터베이스의 "name" 필드에 있는 정확한 캐릭터 이름만 사용하세요
2. 데이터베이스에 없는 이름을 새로 만들거나 추측하지 마세요
3. 우선 1,2번 해시태그와 데이터베이스의 "gender", "age" 필드를 비교해 성별과 나이로 캐릭터들을 1차 필터링 하세요. "age" 필드값은 "child", "young-adult", "middle-aged", "elder" 뿐이므로 반드시 이중 하나로 매핑하세요.
4. 1차 필터링된 캐릭터를 기반으로 각 캐릭터의 description, usecases, styles를 분석하여 브랜드 보이스와의 유사도를 판단하세요
5. 6개의 캐릭터를 최종 선정해 유사도가 높은 순서대로 정렬하세요

응답 형식: 
정확한 캐릭터 이름 6개를 쉼표로 구분하여 나열하세요. 캐릭터 이름만 나열하고 다른 정보는 절대 출력하지 마세요.
예시: Kate, Minwoo, Marie, Jin, David, Sarah (반드시 데이터베이스에 있는 이름들이어야 함)

`
}

// 캐릭터별 추천 이유 생성 프롬프트
export function prepareRecommendationReasonPrompt(
  characterNames: string[],
  brandVoiceText?: string
): string {
  return `
다음 추천된 캐릭터들에 대해 각각의 추천 이유를 광고 시장 입장에서 100자로 응답해주세요.

추천된 캐릭터들: ${characterNames.join(', ')}

브랜드 보이스 정보: ${brandVoiceText}

요구사항:
1. 각 캐릭터별로 광고 시장에서의 활용 가능성과 효과를 중심으로 설명
2. 데이터베이스의 캐릭터 특성(성별, 나이, 용도, 스타일)을 최우선으로 활용
3. 각 캐릭터당 정확히 100자 이내로 작성
4. 마케팅 효과와 타겟 고객층을 고려한 설명

응답 형식:
캐릭터명: 추천 이유 (200자 이내, 존댓말)

예시:
Kate: 20대 여성의 신뢰감 있는 목소리로 (브랜드 제품군들, 브랜드 슬로건, 브랜드 산업군)에 최적화. 전문적이면서도 친근한 톤으로 고객 신뢰도 향상에 효과적.
`
}

// 전체 필터링 파이프라인 (사전 필터링 제거, Perplexity가 전체 데이터베이스에서 직접 선택)
export function createCharacterFilteringPipeline(
  hashtags: string[],
  brandVoiceText?: string
): {
  similarityPrompt: string
  recommendationReasonPrompt: (characterNames: string[]) => string
} {
  // 사전 필터링 없이 Perplexity가 전체 데이터베이스에서 직접 선택하도록 프롬프트만 생성
  const similarityPrompt = prepareSimilarityRankingPrompt(
    [], // priority1 제거
    [], // priority2 제거
    hashtags, // 전체 해시태그 사용
    brandVoiceText
  )

  return {
    similarityPrompt,
    recommendationReasonPrompt: (characterNames: string[]) => prepareRecommendationReasonPrompt(characterNames, brandVoiceText)
  }
}