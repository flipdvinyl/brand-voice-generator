'use client'

import { useState } from 'react'
import type { Character } from '@/app/page'

interface CharacterRecommendationProps {
  companyName: string
  brandVoice: string
  onComplete: () => void
}

export default function CharacterRecommendation({ 
  companyName, 
  brandVoice, 
  onComplete 
}: CharacterRecommendationProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)

  // 더미 캐릭터 데이터
  const recommendedCharacters: Character[] = [
    {
      id: '1',
      name: '사토루',
      thumbnail: '/images/character1.jpg',
      description: '신뢰감 있고 전문적인 30대 남성 캐릭터. 비즈니스 환경에서 완벽하게 어울리며, 고객과의 소통에 특화되어 있습니다.',
      gender: '남',
      age: 'Young-Adult',
      usecase: ['Business', 'Narration', 'Storytelling']
    },
    {
      id: '2',
      name: '유키',
      thumbnail: '/images/character2.jpg',
      description: '친근하고 따뜻한 20대 후반 여성 캐릭터. 고객 상담과 서비스 분야에서 뛰어난 성과를 보여줍니다.',
      gender: '녀',
      age: 'Young-Adult',
      usecase: ['Business', 'Entertainment', 'Customer Service']
    },
    {
      id: '3',
      name: '케이스케',
      thumbnail: '/images/character3.jpg',
      description: '경험과 지혜가 풍부한 50대 남성 캐릭터. 전통과 신뢰성을 바탕으로 한 브랜드 메시지 전달에 최적화되어 있습니다.',
      gender: '남',
      age: 'Middle-Aged',
      usecase: ['Business', 'Narration', 'Audiobook']
    },
    {
      id: '4',
      name: '아야카',
      thumbnail: '/images/character4.jpg',
      description: '혁신적이고 창의적인 30대 여성 캐릭터. 새로운 기술과 트렌드를 선도하는 브랜드에 적합합니다.',
      gender: '녀',
      age: 'Young-Adult',
      usecase: ['Entertainment', 'Storytelling', 'Business']
    }
  ]

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacter(characterId)
  }

  const handleNext = () => {
    if (selectedCharacter) {
      onComplete()
    }
  }

  const getAgeLabel = (age: string) => {
    const ageLabels = {
      'Child': '어린이',
      'Young-Adult': '청년',
      'Middle-Aged': '중년',
      'Elder': '노년'
    }
    return ageLabels[age as keyof typeof ageLabels] || age
  }

  const getGenderLabel = (gender: string) => {
    return gender === '남' ? '남성' : '여성'
  }

  return (
    <div className="card max-w-6xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="header-title text-center mb-12" style={{ color: 'rgba(0, 0, 0, 0.8)' }}>
          수퍼톤 캐릭터 추천
        </h2>
        <p className="text-gray-600">
          {companyName}의 브랜드 보이스에 가장 적합한 수퍼톤 캐릭터를 선택해주세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {recommendedCharacters.map((character) => (
          <div
            key={character.id}
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
              selectedCharacter === character.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
            onClick={() => handleCharacterSelect(character.id)}
          >
            <div className="flex items-start space-x-4">
              {/* 썸네일 이미지 */}
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-2xl">
                {character.gender === '남' ? '👨' : '👩'}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {character.name}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {getGenderLabel(character.gender)} • {getAgeLabel(character.age)}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  {character.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {character.usecase.map((use, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                    >
                      {use}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {selectedCharacter === character.id && (
              <div className="mt-4 p-3 bg-primary-100 rounded-lg">
                <div className="flex items-center text-primary-700">
                  <span className="text-lg mr-2">✅</span>
                  <span className="font-medium">선택됨</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>


    </div>
  )
}
