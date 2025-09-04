import { CompleteCharacterVoice } from './completeCharacterDB'

// 3차 필터링: 해시태그 기반 유사도 랭킹 (퍼플렉시티에게 위임)
export function prepareSimilarityRankingPrompt(
  priority1: CompleteCharacterVoice[],
  priority2: CompleteCharacterVoice[],
  otherHashtags: string[],
  brandVoiceText?: string
): string {
  // 웹 URL 참조 방식 - 외부에서 접근 가능한 API 엔드포인트 사용
  return `
캐릭터 보이스 데이터베이스:https://brand-voice-generator.vercel.app/api/character-metadata 와 아래 브랜드 보이스 설명, 해시태그를  비교해
가장 비슷한 10개 캐릭터를 제안해줘

- 브랜드 보이스 설명 ${brandVoiceText}
- 해시태그 ${otherHashtags.join(', ')}

중요 규칙:
1. 반드시 데이터베이스의 name 필드에 있는 캐릭터 이름만 추천해 주세요.
2. 새로 만든 이름이나 일반적인 설명은 절대 사용하지 마세요
3. 유사도가 높은 캐릭터부터 순서대로 나열하세요.

사전 필터링:
1차 필터링: 성별과 나이로 캐릭터 1차 필터링
2차 필터링: 1차 필터링 리스트들로 분석 시작

응답 형식: 캐릭터 이름만 쉼표로 구분하여 나열하세요.

캐릭터 이름 10개:
`
}

// 전체 필터링 파이프라인 (사전 필터링 제거, Perplexity가 전체 데이터베이스에서 직접 선택)
export function createCharacterFilteringPipeline(
  hashtags: string[],
  brandVoiceText?: string
): {
  similarityPrompt: string
} {
  // 사전 필터링 없이 Perplexity가 전체 데이터베이스에서 직접 선택하도록 프롬프트만 생성
  const similarityPrompt = prepareSimilarityRankingPrompt(
    [], // priority1 제거
    [], // priority2 제거
    hashtags, // 전체 해시태그 사용
    brandVoiceText
  )

  return {
    similarityPrompt
  }
}
