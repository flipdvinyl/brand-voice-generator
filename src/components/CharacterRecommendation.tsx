'use client'

import React, { useState, useEffect, useRef } from 'react'
import type { Character } from '@/app/page'
import { 
  getCharacterRecommendations, 
  getRecommendedCharacterMetadata,
  getAgeLabel,
  getGenderLabel,
  type CharacterVoice 
} from '../utils/characterRecommendation'
import SampleVoicePlayer from './SampleVoicePlayer'

interface CharacterRecommendationProps {
  companyName: string
  brandVoice: string
  companyInfo: string
  hashtags: string[]
  onComplete: () => void
}

export default function CharacterRecommendation({ 
  companyName, 
  brandVoice, 
  companyInfo,
  hashtags,
  onComplete 
}: CharacterRecommendationProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [recommendedCharacters, setRecommendedCharacters] = useState<CharacterVoice[]>([])
  const [recommendationReasons, setRecommendationReasons] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 🚨 중복 호출 방지를 위한 ref (CompanyInfo, BrandVoiceRecommendation과 동일한 패턴)
  const isFetchingRef = React.useRef(false)

  // 캐릭터 추천 로직 실행
  useEffect(() => {
    console.log('🔍 useEffect triggered - hashtags:', hashtags, 'isFetching:', isFetchingRef.current)
    if (!isFetchingRef.current) {
      console.log('🚀 fetchRecommendations 호출')
      isFetchingRef.current = true
      fetchRecommendations()
    } else {
      console.log('⚠️ 이미 fetch 중, 건너뜀')
    }
  }, [hashtags])

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await getCharacterRecommendations(hashtags, brandVoice)
      
      console.log('퍼플렉시티 추천 결과:', response.recommendedCharacters)
      console.log('추천 이유:', response.recommendationReasons)
      
      const characterMetadata = getRecommendedCharacterMetadata(response.recommendedCharacters)
      console.log('메타데이터 조회 결과:', characterMetadata.map(c => c.name))
      
      setRecommendedCharacters(characterMetadata)
      setRecommendationReasons(response.recommendationReasons)
    } catch (err) {
      console.error('Failed to fetch character recommendations:', err)
      setError('캐릭터 추천을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
      isFetchingRef.current = false // Reset fetching state
    }
  }

  const handleCharacterSelect = (characterName: string) => {
    setSelectedCharacter(characterName)
  }

  const handleNext = () => {
    if (selectedCharacter) {
      onComplete()
    }
  }

  if (loading) {
    return (
      <div className="card max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="header-title text-center mb-12" style={{ color: 'rgba(0, 0, 0, 0.8)' }}>
            수퍼톤 캐릭터 추천
          </h2>
          <p className="text-gray-600">
            {companyName}의 브랜드 보이스에 가장 적합한 수퍼톤 캐릭터를 분석 중입니다...
          </p>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="header-title text-center mb-12" style={{ color: 'rgba(0, 0, 0, 0.8)' }}>
            수퍼톤 캐릭터 추천
          </h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    )
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
            key={character.name}
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
              selectedCharacter === character.name
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
            onClick={() => handleCharacterSelect(character.name)}
          >
            <div className="flex items-start space-x-4">
              {/* 썸네일 이미지 */}
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                {character.thumbnail ? (
                  <img 
                    src={character.thumbnail} 
                    alt={character.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 text-2xl">
                    {character.gender === 'male' ? '👨' : '👩'}
                  </span>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {character.name}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {getGenderLabel(character.gender)} • {getAgeLabel(character.age)}
                    </span>
                  </div>
                  {character.sample && (
                    <SampleVoicePlayer 
                      sampleUrl={character.sample} 
                      characterName={character.name}
                    />
                  )}
                </div>
                
                {/* 추천 이유 표시 */}
                {recommendationReasons[character.name] && (
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                    {recommendationReasons[character.name]}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {character.usecases.slice(0, 3).map((use: string, index: number) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                    >
                      {use}
                    </span>
                  ))}
                  {character.usecases.length > 3 && (
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      +{character.usecases.length - 3}
                    </span>
                  )}
                </div>

                {/* 스타일 정보 */}
                <div className="flex flex-wrap gap-1">
                  {character.styles.slice(0, 3).map((style: string, index: number) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                    >
                      {style}
                    </span>
                  ))}
                  {character.styles.length > 3 && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                      +{character.styles.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {selectedCharacter === character.name && (
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

      {selectedCharacter && (
        <div className="text-center">
          <button
            onClick={handleNext}
            className="bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            다음 단계로
          </button>
        </div>
      )}
    </div>
  )
}
