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

// 2차 필터링: 해시태그 기반 usecase 우선순위 분류
export function categorizeByUseCaseFromHashtags(
  characters: CompleteCharacterVoice[],
  otherHashtags: string[]
): {
  priority1: CompleteCharacterVoice[]  // usecase가 해시태그에 맞는 캐릭터들
  priority2: CompleteCharacterVoice[]  // 나머지 캐릭터들
} {
  const hashtagContext = otherHashtags.join(' ').toLowerCase()
  
  const priority1: CompleteCharacterVoice[] = []
  const priority2: CompleteCharacterVoice[] = []

  characters.forEach(char => {
    const hasMatchingUseCase = char.usecases.some(useCase => {
      const useCaseLower = useCase.toLowerCase()
      
      // 비즈니스 관련 키워드
      if (hashtagContext.includes('비즈니스') || hashtagContext.includes('business') || 
          hashtagContext.includes('기업') || hashtagContext.includes('corporate') ||
          hashtagContext.includes('전문') || hashtagContext.includes('professional')) {
        return useCaseLower.includes('business') || useCaseLower.includes('announcement') || 
               useCaseLower.includes('presentation') || useCaseLower.includes('corporate')
      }
      
      // 엔터테인먼트 관련 키워드
      if (hashtagContext.includes('엔터테인먼트') || hashtagContext.includes('entertainment') || 
          hashtagContext.includes('재미') || hashtagContext.includes('fun') ||
          hashtagContext.includes('유머') || hashtagContext.includes('humor')) {
        return useCaseLower.includes('entertainment') || useCaseLower.includes('game') || 
               useCaseLower.includes('acting') || useCaseLower.includes('humor')
      }
      
      // 교육 관련 키워드
      if (hashtagContext.includes('교육') || hashtagContext.includes('education') || 
          hashtagContext.includes('학습') || hashtagContext.includes('learning') ||
          hashtagContext.includes('설명') || hashtagContext.includes('explanation')) {
        return useCaseLower.includes('narration') || useCaseLower.includes('audiobook') || 
               useCaseLower.includes('documentary') || useCaseLower.includes('educational')
      }
      
      // 광고 관련 키워드
      if (hashtagContext.includes('광고') || hashtagContext.includes('advertisement') || 
          hashtagContext.includes('마케팅') || hashtagContext.includes('marketing') ||
          hashtagContext.includes('홍보') || hashtagContext.includes('promotion')) {
        return useCaseLower.includes('advertisement') || useCaseLower.includes('marketing') || 
               useCaseLower.includes('promotion')
      }
      
      // 게임 관련 키워드
      if (hashtagContext.includes('게임') || hashtagContext.includes('game') || 
          hashtagContext.includes('gaming') || hashtagContext.includes('플레이')) {
        return useCaseLower.includes('game') || useCaseLower.includes('gaming') || 
               useCaseLower.includes('character')
      }
      
      // 뉴스/보도 관련 키워드
      if (hashtagContext.includes('뉴스') || hashtagContext.includes('news') || 
          hashtagContext.includes('보도') || hashtagContext.includes('reporting') ||
          hashtagContext.includes('알림') || hashtagContext.includes('announcement')) {
        return useCaseLower.includes('news') || useCaseLower.includes('announcement') || 
               useCaseLower.includes('reporting')
      }
      
      // 고객 서비스 관련 키워드
      if (hashtagContext.includes('고객서비스') || hashtagContext.includes('customer') || 
          hashtagContext.includes('서비스') || hashtagContext.includes('service') ||
          hashtagContext.includes('상담') || hashtagContext.includes('consultation')) {
        return useCaseLower.includes('customer-service') || useCaseLower.includes('conversational') || 
               useCaseLower.includes('support')
      }
      
      // 스토리텔링 관련 키워드
      if (hashtagContext.includes('스토리') || hashtagContext.includes('story') || 
          hashtagContext.includes('이야기') || hashtagContext.includes('narrative') ||
          hashtagContext.includes('내레이션') || hashtagContext.includes('narration')) {
        return useCaseLower.includes('storytelling') || useCaseLower.includes('narrative') || 
               useCaseLower.includes('audiobook')
      }
      
      // 신뢰감/안정감 관련 키워드
      if (hashtagContext.includes('신뢰') || hashtagContext.includes('trust') || 
          hashtagContext.includes('안정') || hashtagContext.includes('stable') ||
          hashtagContext.includes('차분') || hashtagContext.includes('calm')) {
        return useCaseLower.includes('business') || useCaseLower.includes('announcement') || 
               useCaseLower.includes('professional') || useCaseLower.includes('neutral')
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

// 3차 필터링: 해시태그 기반 유사도 랭킹 (퍼플렉시티에게 위임)
export function prepareSimilarityRankingPrompt(
  priority1: CompleteCharacterVoice[],
  priority2: CompleteCharacterVoice[],
  otherHashtags: string[]
): string {
  // 실제 캐릭터 이름들을 프롬프트에 직접 포함
  const allCandidates = [...priority1, ...priority2]
  const candidateNames = allCandidates.map(char => char.name).join(', ')
  
  return `
해시태그: ${otherHashtags.join(', ')}

사용 가능한 캐릭터 이름들: ${candidateNames}

위 해시태그를 바탕으로 사용 가능한 캐릭터 이름들 중에서 가장 적합한 캐릭터 10개를 추천해주세요.
반드시 위에 나열된 캐릭터 이름들 중에서만 선택하세요. 새로 만든 이름은 절대 사용하지 마세요.

응답 형식: 캐릭터 이름만 쉼표로 구분하여 나열하세요.
예시: Kate, Minwoo, Marie, Jin, Andrew, Peter, Sam, Brody, Taeho, Ken

캐릭터 이름 10개:
`
}

// 전체 필터링 파이프라인 (해시태그만 사용)
export function createCharacterFilteringPipeline(
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

  // 2차 필터링: 해시태그 기반 usecase 우선순위 분류
  const step2Categorized = categorizeByUseCaseFromHashtags(
    step1Filtered,
    hashtagAnalysis.otherHashtags
  )

  // 3차 필터링: 해시태그 기반 유사도 랭킹 프롬프트 생성
  const similarityPrompt = prepareSimilarityRankingPrompt(
    step2Categorized.priority1,
    step2Categorized.priority2,
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
