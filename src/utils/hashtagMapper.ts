// 해시태그를 성별과 나이로 매핑하는 유틸리티 함수들

// 성별 매핑 해시태그
const GENDER_MAPPING = {
  male: [
    '남성', '남자', '아저씨', '형', '오빠', '아빠', '할아버지', '남성보이스', '남자목소리',
    'masculine', 'male', 'man', 'gentleman', 'boy', 'dad', 'father', 'grandfather',
    'businessman', 'professional-male', 'corporate-male'
  ],
  female: [
    '여성', '여자', '아줌마', '언니', '누나', '엄마', '할머니', '여성보이스', '여자목소리',
    'feminine', 'female', 'woman', 'lady', 'girl', 'mom', 'mother', 'grandmother',
    'businesswoman', 'professional-female', 'corporate-female'
  ]
}

// 나이 매핑 해시태그
const AGE_MAPPING = {
  child: [
    '어린이', '아이', '유아', '초등학생', '키즈', 'child', 'kid', 'children', 'young',
    'cute', 'playful', 'innocent', 'sweet', 'adorable'
  ],
  'young-adult': [
    '청년', '20대', '30대', '젊은', '청춘', 'young-adult', 'young', 'youth', 'teenager',
    'college', 'university', 'student', 'fresh', 'energetic', 'modern', 'trendy'
  ],
  'middle-aged': [
    '중년', '40대', '50대', '성인', '어른', 'middle-aged', 'adult', 'mature', 'experienced',
    'professional', 'business', 'corporate', 'reliable', 'trustworthy', 'stable'
  ],
  elder: [
    '노년', '60대', '70대', '시니어', '어르신', 'elder', 'senior', 'aged', 'vintage',
    'wise', 'experienced', 'authoritative', 'traditional', 'classic'
  ]
}

// 해시태그에서 성별 추출
export function extractGenderFromHashtags(hashtags: string[]): string | null {
  const hashtagText = hashtags.join(' ').toLowerCase()
  
  // 남성 키워드 확인
  for (const keyword of GENDER_MAPPING.male) {
    if (hashtagText.includes(keyword.toLowerCase())) {
      return 'male'
    }
  }
  
  // 여성 키워드 확인
  for (const keyword of GENDER_MAPPING.female) {
    if (hashtagText.includes(keyword.toLowerCase())) {
      return 'female'
    }
  }
  
  return null // 성별을 찾을 수 없는 경우
}

// 해시태그에서 나이 추출
export function extractAgeFromHashtags(hashtags: string[]): string | null {
  const hashtagText = hashtags.join(' ').toLowerCase()
  
  // 각 나이대별로 확인 (우선순위: child > young-adult > middle-aged > elder)
  for (const [age, keywords] of Object.entries(AGE_MAPPING)) {
    for (const keyword of keywords) {
      if (hashtagText.includes(keyword.toLowerCase())) {
        return age
      }
    }
  }
  
  return null // 나이를 찾을 수 없는 경우
}

// 해시태그에서 성별과 나이를 제외한 나머지 해시태그 추출
export function extractOtherHashtags(hashtags: string[]): string[] {
  const genderKeywords = [...GENDER_MAPPING.male, ...GENDER_MAPPING.female]
  const ageKeywords = [...AGE_MAPPING.child, ...AGE_MAPPING['young-adult'], ...AGE_MAPPING['middle-aged'], ...AGE_MAPPING.elder]
  const allFilterKeywords = [...genderKeywords, ...ageKeywords]
  
  return hashtags.filter(hashtag => 
    !allFilterKeywords.some(keyword => 
      hashtag.toLowerCase().includes(keyword.toLowerCase())
    )
  )
}

// 해시태그 분석 결과 타입
export interface HashtagAnalysis {
  gender: string | null
  age: string | null
  otherHashtags: string[]
}

// 해시태그 전체 분석
export function analyzeHashtags(hashtags: string[]): HashtagAnalysis {
  return {
    gender: extractGenderFromHashtags(hashtags),
    age: extractAgeFromHashtags(hashtags),
    otherHashtags: extractOtherHashtags(hashtags)
  }
}
