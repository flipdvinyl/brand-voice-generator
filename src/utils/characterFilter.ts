import { CompleteCharacterVoice, completeCharacterVoiceDB } from './completeCharacterDB'
import { PerplexityCharacterVoice, perplexityCharacterVoiceDB } from './perplexityCharacterDB'
import { HashtagAnalysis } from './hashtagMapper'

// 1차 필터링: 성별과 나이로 필터링
export function filterByGenderAndAge(
  gender: string | null, 
  age: string | null
): CompleteCharacterVoice[] {
  let filtered = completeCharacterVoiceDB

  // 성별 필터링
  if (gender) {
    filtered = filtered.filter(char => char.gender === gender)
  }

  // 나이 필터링
  if (age) {
    filtered = filtered.filter(char => char.age === age)
  }

  return filtered
}

// 2차 필터링: usecase 기반 우선순위 분류
export function categorizeByUseCase(
  characters: CompleteCharacterVoice[],
  companyInfo: string,
  brandVoice: string,
  otherHashtags: string[]
): {
  priority1: CompleteCharacterVoice[]  // usecase가 회사에 맞는 캐릭터들
  priority2: CompleteCharacterVoice[]  // 나머지 캐릭터들
} {
  const context = `${companyInfo} ${brandVoice} ${otherHashtags.join(' ')}`.toLowerCase()
  
  const priority1: CompleteCharacterVoice[] = []
  const priority2: CompleteCharacterVoice[] = []

  characters.forEach(char => {
    const hasMatchingUseCase = char.usecases.some(useCase => {
      const useCaseLower = useCase.toLowerCase()
      
      // 비즈니스 관련 키워드
      if (context.includes('비즈니스') || context.includes('business') || context.includes('기업')) {
        return useCaseLower.includes('business') || useCaseLower.includes('announcement') || 
               useCaseLower.includes('presentation') || useCaseLower.includes('corporate')
      }
      
      // 엔터테인먼트 관련 키워드
      if (context.includes('엔터테인먼트') || context.includes('entertainment') || context.includes('재미')) {
        return useCaseLower.includes('entertainment') || useCaseLower.includes('game') || 
               useCaseLower.includes('acting') || useCaseLower.includes('humor')
      }
      
      // 교육 관련 키워드
      if (context.includes('교육') || context.includes('education') || context.includes('학습')) {
        return useCaseLower.includes('narration') || useCaseLower.includes('audiobook') || 
               useCaseLower.includes('documentary') || useCaseLower.includes('educational')
      }
      
      // 광고 관련 키워드
      if (context.includes('광고') || context.includes('advertisement') || context.includes('마케팅')) {
        return useCaseLower.includes('advertisement') || useCaseLower.includes('marketing') || 
               useCaseLower.includes('promotion')
      }
      
      // 게임 관련 키워드
      if (context.includes('게임') || context.includes('game') || context.includes('gaming')) {
        return useCaseLower.includes('game') || useCaseLower.includes('gaming') || 
               useCaseLower.includes('character')
      }
      
      // 뉴스/보도 관련 키워드
      if (context.includes('뉴스') || context.includes('news') || context.includes('보도')) {
        return useCaseLower.includes('news') || useCaseLower.includes('announcement') || 
               useCaseLower.includes('reporting')
      }
      
      // 고객 서비스 관련 키워드
      if (context.includes('고객서비스') || context.includes('customer') || context.includes('서비스')) {
        return useCaseLower.includes('customer-service') || useCaseLower.includes('conversational') || 
               useCaseLower.includes('support')
      }
      
      // 스토리텔링 관련 키워드
      if (context.includes('스토리') || context.includes('story') || context.includes('이야기')) {
        return useCaseLower.includes('storytelling') || useCaseLower.includes('narrative') || 
               useCaseLower.includes('audiobook')
      }
      
      return false
    })

    if (hasMatchingUseCase) {
      priority1.push(char)
    } else {
      priority2.push(char)
    }
  })

  return { priority1, priority2 }
}

// 3차 필터링: 유사도 기반 랭킹 (퍼플렉시티에게 위임)
export function prepareSimilarityRankingPrompt(
  priority1: CompleteCharacterVoice[],
  priority2: CompleteCharacterVoice[],
  companyInfo: string,
  brandVoice: string,
  otherHashtags: string[]
): string {
  const allCandidates = [...priority1, ...priority2]
  
  // 퍼플렉시티용 간소화된 데이터로 변환
  const candidateData = allCandidates.map(char => ({
    name: char.name,
    description: char.description,
    age: char.age,
    gender: char.gender,
    usecases: char.usecases,
    styles: char.styles,
    priority: priority1.includes(char) ? 1 : 2
  }))

  // 프롬프트 길이 제한을 위해 우선순위 1 캐릭터들만 포함
  const priority1Data = candidateData.filter(char => char.priority === 1)
  const priority2Data = candidateData.filter(char => char.priority === 2).slice(0, 20) // 2순위는 최대 20개만
  
  return `
회사 정보: ${companyInfo}
브랜드 보이스: ${brandVoice}
추가 해시태그: ${otherHashtags.join(', ')}

우선순위 1 캐릭터들 (${priority1Data.length}개):
${priority1Data.map(char => 
  `${char.name} (${char.gender}, ${char.age}): ${char.description}
  사용사례: ${char.usecases.join(', ')}
  스타일: ${char.styles.join(', ')}`
).join('\n\n')}

우선순위 2 캐릭터들 (${priority2Data.length}개):
${priority2Data.map(char => 
  `${char.name} (${char.gender}, ${char.age}): ${char.description}
  사용사례: ${char.usecases.join(', ')}
  스타일: ${char.styles.join(', ')}`
).join('\n\n')}

위 정보를 바탕으로 브랜드 보이스에 가장 적합한 캐릭터 10개를 추천해주세요.
우선순위 1 캐릭터들을 우선적으로 고려하되, 더 적합한 우선순위 2 캐릭터도 포함할 수 있습니다.

캐릭터 이름만 10개 나열해주세요:
`
}

// 전체 필터링 파이프라인
export function createCharacterFilteringPipeline(
  companyInfo: string,
  brandVoice: string,
  hashtags: string[]
): {
  step1Filtered: CompleteCharacterVoice[]
  step2Categorized: { priority1: CompleteCharacterVoice[], priority2: CompleteCharacterVoice[] }
  similarityPrompt: string
  hashtagAnalysis: HashtagAnalysis
} {
  // 해시태그 분석
  const hashtagAnalysis = {
    gender: extractGenderFromHashtags(hashtags),
    age: extractAgeFromHashtags(hashtags),
    otherHashtags: extractOtherHashtags(hashtags)
  }

  // 1차 필터링: 성별과 나이
  const step1Filtered = filterByGenderAndAge(hashtagAnalysis.gender, hashtagAnalysis.age)

  // 2차 필터링: usecase 기반 우선순위 분류
  const step2Categorized = categorizeByUseCase(
    step1Filtered,
    companyInfo,
    brandVoice,
    hashtagAnalysis.otherHashtags
  )

  // 3차 필터링: 유사도 랭킹 프롬프트 생성
  const similarityPrompt = prepareSimilarityRankingPrompt(
    step2Categorized.priority1,
    step2Categorized.priority2,
    companyInfo,
    brandVoice,
    hashtagAnalysis.otherHashtags
  )

  return {
    step1Filtered,
    step2Categorized,
    similarityPrompt,
    hashtagAnalysis
  }
}

// 해시태그 매핑 함수들 import
import { 
  extractGenderFromHashtags, 
  extractAgeFromHashtags, 
  extractOtherHashtags 
} from './hashtagMapper'
