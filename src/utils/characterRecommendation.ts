// 완전한 캐릭터 DB에서 필요한 타입만 추출
import { CompleteCharacterVoice, completeCharacterVoiceDB } from './completeCharacterDB'

export interface CharacterVoice {
  name: string
  description: string
  age: string
  gender: string
  usecases: string[]
  styles: string[]
  sample: string
  thumbnail: string
}

// 캐릭터 추천 요청 타입
export interface CharacterRecommendationRequest {
  hashtags: string[]
}

// 캐릭터 추천 응답 타입
export interface CharacterRecommendationResponse {
  recommendedCharacters: string[]
}

// 완전한 캐릭터 보이스 메타데이터 DB (216개 캐릭터)
export const characterVoiceDB: CharacterVoice[] = completeCharacterVoiceDB.map(char => ({
  name: char.name,
  description: char.description,
  age: char.age,
  gender: char.gender,
  usecases: char.usecases,
  styles: char.styles,
  sample: char.sample_ko, // 한국어 샘플 사용
  thumbnail: char.thumbnail
}))

// 캐릭터 추천 API 호출 (해시태그만 사용)
export async function getCharacterRecommendations(
  hashtags: string[]
): Promise<CharacterRecommendationResponse> {
  try {
    const response = await fetch('/api/character-recommendation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hashtags,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get character recommendations')
    }

    return await response.json()
  } catch (error) {
    console.error('Error getting character recommendations:', error)
    // 에러 발생 시 기본 캐릭터들 반환
    return {
      recommendedCharacters: ['Kate', 'Minwoo', 'Marie', 'Jin']
    }
  }
}

// 추천된 캐릭터들의 메타데이터 가져오기
export function getRecommendedCharacterMetadata(recommendedNames: string[]): CharacterVoice[] {
  return recommendedNames
    .map(name => characterVoiceDB.find(char => char.name === name))
    .filter((char): char is CharacterVoice => char !== undefined)
}

// 나이 라벨 변환
export function getAgeLabel(age: string): string {
  const ageLabels: Record<string, string> = {
    'child': '어린이',
    'young-adult': '청년',
    'middle-aged': '중년',
    'elder': '노년'
  }
  return ageLabels[age] || age
}

// 성별 라벨 변환
export function getGenderLabel(gender: string): string {
  return gender === 'male' ? '남성' : '여성'
}
