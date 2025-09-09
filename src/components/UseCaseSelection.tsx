'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import TTSPlayer, { TTSPlayerRef } from './TTSPlayer'
import { resetAllTTSGlobal } from './TTSPlayer'
import { findCharacterByName } from '../utils/completeCharacterDB'

interface UseCaseSelectionProps {
  companyName: string
  companyInfo: string
  brandVoice: string
  hashtags: string[]
  selectedCharacterName: string
  onReset: () => void
}

interface GeneratedContent {
  tvcm: string
  radiocm: string
  internalBroadcast: string
  customerService: string
  storeAnnouncement: string
}

export default function UseCaseSelection({ 
  companyName, 
  companyInfo, 
  brandVoice, 
  hashtags, 
  selectedCharacterName,
  onReset 
}: UseCaseSelectionProps) {
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isGeneratingTTS, setIsGeneratingTTS] = useState(false)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  
  // 🚨 중복 호출 방지를 위한 ref (다른 섹션과 동일한 패턴)
  const isFetchingRef = React.useRef(false)
  const ttsPlayerRef = React.useRef<TTSPlayerRef>(null)
  
  // 선택된 캐릭터의 실제 Voice ID 찾기
  const selectedCharacterData = findCharacterByName(selectedCharacterName)
  const actualVoiceId = selectedCharacterData?.voice_id || selectedCharacterName
  
  console.log('🎤 선택된 캐릭터 정보:', {
    selectedCharacterName,
    selectedCharacterData,
    actualVoiceId
  })

  // 콘텐츠 생성 로직 실행
  useEffect(() => {
    console.log('🔍 useEffect triggered - companyName:', companyName, 'isFetching:', isFetchingRef.current)
    if (!isFetchingRef.current) {
      console.log('🚀 fetchContent 호출')
      isFetchingRef.current = true
      fetchContent()
    } else {
      console.log('⚠️ 이미 fetch 중, 건너뜀')
    }
  }, [companyName, companyInfo, brandVoice, hashtags])

  const fetchContent = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Perplexity API 호출
      const response = await axios.post('/api/perplexity', {
        companyName,
        prompt: `브랜드 정보: ${companyInfo}

브랜드 보이스: ${brandVoice} + 해시태그: ${hashtags.join(', ')}

위 브랜드 정보와 브랜드 보이스를 바탕으로 브랜드의 콘텐츠를 생성해줘. 각 내용은 200자 분량으로 해줘. 조금 감성적이고 따뜻한 결로 만들어줘

- TVCM: 가상의 TV 광고 멘트를 만들어줘. 시각적인 상상력을 자극하게 해줘. 간결한 슬로건을 마지막에 넣어줘
- Radio CM: 가상의 라디오 광고 멘트를 만들어줘. 목소리만으로 공감할 수 있는 스토리를 제안해줘
- 사내방송: 임직원에게 연말을 잘 마무리하기위한 종무식에 어울리는 멘트를 만들어줘.
- 고객상담: 브랜드이미지에 맞는 전화 고객상담의 첫 안내를 만들어줘
- 매장방송: 매장의 구조를 안내하는 멘트를 만들어줘

응답 형식:
TVCM: [내용]
Radio CM: [내용]
사내방송: [내용]
고객상담: [내용]
매장방송: [내용]`
      })

      const info = response.data.info
      console.log('=== Perplexity API 응답 ===')
      console.log('응답 데이터:', response.data)
      console.log('추출된 info:', info)
      console.log('=======================')

      // 콘텐츠 파싱
      const content: GeneratedContent = {
        tvcm: extractContent(info, 'TVCM'),
        radiocm: extractContent(info, 'Radio CM'),
        internalBroadcast: extractContent(info, '사내방송'),
        customerService: extractContent(info, '고객상담'),
        storeAnnouncement: extractContent(info, '매장방송')
      }

      setGeneratedContent(content)
      
      // TTS 생성 시작
      await generateAllTTS(content)
      
    } catch (error) {
      console.error('Error generating content:', error)
      setError('콘텐츠 생성 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
      isFetchingRef.current = false // Reset fetching state
    }
  }

  const extractContent = (text: string, section: string): string => {
    // 각 섹션의 시작과 끝을 정확히 찾기 위한 정규식
    const sections = ['TVCM', 'Radio CM', '사내방송', '고객상담', '매장방송']
    const currentIndex = sections.indexOf(section)
    
    if (currentIndex === -1) {
      return `${section} 콘텐츠를 생성할 수 없습니다.`
    }
    
    // 현재 섹션의 시작 패턴
    const startPattern = new RegExp(`${section}:\\s*`, 'i')
    const startMatch = text.search(startPattern)
    
    if (startMatch === -1) {
      return `${section} 콘텐츠를 생성할 수 없습니다.`
    }
    
    // 현재 섹션의 시작 위치
    const startPos = startMatch + startPattern.exec(text.substring(startMatch))![0].length
    
    // 다음 섹션의 시작 위치 찾기
    let endPos = text.length
    for (let i = currentIndex + 1; i < sections.length; i++) {
      const nextSectionPattern = new RegExp(`${sections[i]}:\\s*`, 'i')
      const nextMatch = text.search(nextSectionPattern)
      if (nextMatch !== -1) {
        endPos = nextMatch
        break
      }
    }
    
    // 해당 섹션의 내용 추출
    const content = text.substring(startPos, endPos).trim()
    return content || `${section} 콘텐츠를 생성할 수 없습니다.`
  }

  const generateAllTTS = async (content: GeneratedContent) => {
    setIsGeneratingTTS(true)
    
    try {
      // TTSPlayer가 마운트될 때까지 대기
      const waitForTTSPlayer = async () => {
        let attempts = 0
        const maxAttempts = 50 // 최대 5초 대기
        
        while (!ttsPlayerRef.current && attempts < maxAttempts) {
          console.log(`🎵 TTSPlayer 대기 중... (${attempts + 1}/${maxAttempts})`)
          await new Promise(resolve => setTimeout(resolve, 100))
          attempts++
        }
        
        if (ttsPlayerRef.current) {
          console.log('🎵 TTSPlayer 준비 완료, 모든 콘텐츠 TTS 생성 시작...')
          
          // 모든 콘텐츠를 순차적으로 TTS 생성
          const allTexts = [
            content.tvcm,
            content.radiocm,
            content.internalBroadcast,
            content.customerService,
            content.storeAnnouncement
          ]
          
          for (const text of allTexts) {
            try {
              await ttsPlayerRef.current.playFullTTS(text)
              console.log('🎵 TTS 생성 완료:', text.substring(0, 50) + '...')
            } catch (error) {
              console.error('🎵 TTS 생성 실패:', error)
            }
          }
        } else {
          console.error('🎵 TTSPlayer 마운트 실패, TTS 생성 불가')
        }
      }
      
      // 비동기로 TTSPlayer 대기 및 TTS 시작
      await waitForTTSPlayer()
      
    } finally {
      setIsGeneratingTTS(false)
    }
  }

  const handleContentClick = async (text: string) => {
    console.log('🎵 handleContentClick 시작:', text.substring(0, 50) + '...')
    
    // TTSPlayer가 준비되어 있는지 확인
    if (!ttsPlayerRef.current) {
      console.error('🎵 ttsPlayerRef가 null입니다')
      return
    }
    
    // 기존 재생 중인 모든 TTS 중지 (TTSPlayer의 resetAllTTS 사용)
    ttsPlayerRef.current.resetAllTTS()
    
    // 기존 재생 중인 오디오 중지
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
      setCurrentAudio(null)
    }
    
    // TTS 중지가 완전히 완료될 때까지 잠시 대기
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // 새로운 TTS 재생
    try {
      console.log('🎵 새로운 TTS 재생 시작...')
      await ttsPlayerRef.current.playFullTTS(text)
      console.log('🎵 새로운 TTS 재생 완료')
    } catch (error) {
      console.error('Error playing TTS:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="card max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="header-title text-center mb-12" style={{ color: 'rgba(0, 0, 0, 0.8)' }}>
            브랜드 보이스 활용 사례
          </h2>
          <p className="text-gray-600">
            {companyName}의 브랜드 보이스로 다양한 콘텐츠를 생성하는 중입니다...
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
        <div className="text-center mb-8">
          <h2 className="header-title text-center mb-12" style={{ color: 'rgba(0, 0, 0, 0.8)' }}>
            브랜드 보이스 활용 사례
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
      <div className="text-center mb-8">
        <h2 className="header-title text-center mb-12" style={{ color: 'rgba(0, 0, 0, 0.8)' }}>
          브랜드 보이스 활용 사례
        </h2>
        <p className="text-gray-600">
          {companyName}의 브랜드 보이스로 생성된 다양한 콘텐츠입니다.<br />
          텍스트를 클릭하면 음성으로 들을 수 있습니다.
        </p>
      </div>

      {generatedContent && (
        <div className="space-y-6">
          {/* TVCM */}
          <div 
            className="bg-white bg-opacity-40 rounded-lg p-6 cursor-pointer hover:bg-opacity-60 transition-all duration-200"
            onClick={() => handleContentClick(generatedContent.tvcm)}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              📺 TVCM
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {generatedContent.tvcm}
            </p>
          </div>

          {/* Radio CM */}
          <div 
            className="bg-white bg-opacity-40 rounded-lg p-6 cursor-pointer hover:bg-opacity-60 transition-all duration-200"
            onClick={() => handleContentClick(generatedContent.radiocm)}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              📻 Radio CM
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {generatedContent.radiocm}
            </p>
          </div>

          {/* 사내방송 */}
          <div 
            className="bg-white bg-opacity-40 rounded-lg p-6 cursor-pointer hover:bg-opacity-60 transition-all duration-200"
            onClick={() => handleContentClick(generatedContent.internalBroadcast)}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              🏢 사내방송
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {generatedContent.internalBroadcast}
            </p>
          </div>

          {/* 고객상담 */}
          <div 
            className="bg-white bg-opacity-40 rounded-lg p-6 cursor-pointer hover:bg-opacity-60 transition-all duration-200"
            onClick={() => handleContentClick(generatedContent.customerService)}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              🎧 고객상담
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {generatedContent.customerService}
            </p>
          </div>

          {/* 매장방송 */}
          <div 
            className="bg-white bg-opacity-40 rounded-lg p-6 cursor-pointer hover:bg-opacity-60 transition-all duration-200"
            onClick={() => handleContentClick(generatedContent.storeAnnouncement)}
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              🏪 매장방송
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {generatedContent.storeAnnouncement}
            </p>
          </div>
        </div>
      )}

      {/* TTS 생성 상태 표시 */}
      {isGeneratingTTS && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">음성 생성 중...</span>
        </div>
      )}

      {/* 숨겨진 TTSPlayer */}
      <div className="hidden">
        <TTSPlayer 
          ref={ttsPlayerRef}
          text=""
          onPlayStart={() => {}}
          onPlayEnd={() => {}}
          className="flex-1 mr-4"
          voiceId={actualVoiceId}
          speakingRate={1.2}
        />
      </div>
    </div>
  )
}
