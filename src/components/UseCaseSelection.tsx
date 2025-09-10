'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import TTSPlayer, { TTSPlayerRef } from './TTSPlayer'
import { resetAllTTSGlobal } from './TTSPlayer'
import { findCharacterByName } from '../utils/completeCharacterDB'
import { applyPhoneEQ, removePhoneEQ, cleanupPhoneEQ } from '@/utils/phoneEQ'

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
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null)
  const [isRadioCMPlaying, setIsRadioCMPlaying] = useState(false)
  const [storeAmbience, setStoreAmbience] = useState<HTMLAudioElement | null>(null)
  const [isStoreAnnouncementPlaying, setIsStoreAnnouncementPlaying] = useState(false)
  const [isPhoneEQActive, setIsPhoneEQActive] = useState(false)
  const [phoneRingAudio, setPhoneRingAudio] = useState<HTMLAudioElement | null>(null)
  
  // 🚨 중복 호출 방지를 위한 ref (다른 섹션과 동일한 패턴)
  const isFetchingRef = React.useRef(false)
  const ttsPlayerRef = React.useRef<TTSPlayerRef>(null)

  // 컴포넌트 언마운트 시 백그라운드 뮤직, 앰비언스, 전화기 EQ 정리
  useEffect(() => {
    return () => {
      if (backgroundMusic) {
        backgroundMusic.pause()
        backgroundMusic.currentTime = 0
      }
      if (storeAmbience) {
        storeAmbience.pause()
        storeAmbience.currentTime = 0
      }
      if (phoneRingAudio) {
        phoneRingAudio.pause()
        phoneRingAudio.currentTime = 0
      }
      cleanupPhoneEQ()
    }
  }, [backgroundMusic, storeAmbience])
  
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
    
    // 로컬 스토리지에서 기존 데이터 확인
    const cacheKey = `usecase_content_${companyName}_${hashtags.join('_')}`
    const cachedData = localStorage.getItem(cacheKey)
    
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData)
        const now = Date.now()
        
        // 캐시가 1시간 이내인지 확인 (3600000ms = 1시간)
        if (now - parsedData.timestamp < 3600000) {
          console.log('📦 캐시된 활용사례 데이터 사용:', cacheKey)
          setGeneratedContent(parsedData.content)
          setIsLoading(false)
          
          // 캐시된 데이터는 TTS 자동생성 하지 않음 (사용자가 클릭할 때만 재생)
          console.log('🎵 캐시된 데이터 로드 - TTS 자동생성 건너뜀')
          return
        } else {
          console.log('⏰ 캐시 만료, 새로 요청')
          localStorage.removeItem(cacheKey)
        }
      } catch (error) {
        console.error('캐시 데이터 파싱 오류:', error)
        localStorage.removeItem(cacheKey)
      }
    }
    
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
      
      // 로컬 스토리지에 데이터 저장
      const cacheKey = `usecase_content_${companyName}_${hashtags.join('_')}`
      const cacheData = {
        content: content,
        timestamp: Date.now()
      }
      localStorage.setItem(cacheKey, JSON.stringify(cacheData))
      console.log('💾 활용사례 데이터를 로컬 스토리지에 저장:', cacheKey)
      
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
    // 이미 TTS 생성 중이면 중복 실행 방지
    if (isGeneratingTTS) {
      console.log('🎵 TTS 생성 이미 진행 중, 중복 실행 방지')
      return
    }
    
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

  // 백그라운드 뮤직 페이드 인 함수
  const fadeInBackgroundMusic = async (audio: HTMLAudioElement) => {
    audio.volume = 0
    await audio.play()
    
    const fadeInDuration = 3000 // 3초
    const steps = 30
    const stepDuration = fadeInDuration / steps
    const volumeStep = 0.5 / steps // 최종 볼륨 0.5 (50%)
    
    for (let i = 0; i <= steps; i++) {
      audio.volume = volumeStep * i
      await new Promise(resolve => setTimeout(resolve, stepDuration))
    }
  }

  // 백그라운드 뮤직 페이드 아웃 함수
  const fadeOutBackgroundMusic = async (audio: HTMLAudioElement) => {
    const fadeOutDuration = 3000 // 3초
    const steps = 30
    const stepDuration = fadeOutDuration / steps
    const currentVolume = audio.volume
    const volumeStep = currentVolume / steps
    
    for (let i = steps; i >= 0; i--) {
      audio.volume = volumeStep * i
      await new Promise(resolve => setTimeout(resolve, stepDuration))
    }
    
    audio.pause()
    audio.currentTime = 0
  }

  // 라디오 CM 재생 시 백그라운드 뮤직 시작
  const startBackgroundMusic = async () => {
    try {
      const music = new Audio('/background-music.mp3')
      music.loop = true
      music.volume = 0.5
      setBackgroundMusic(music)
      
      await fadeInBackgroundMusic(music)
      console.log('🎵 백그라운드 뮤직 페이드 인 완료')
    } catch (error) {
      console.error('백그라운드 뮤직 재생 오류:', error)
    }
  }

  // 매장방송 재생 시 앰비언스 시작
  const startStoreAmbience = async () => {
    try {
      const ambience = new Audio('/store-ambience.mp3')
      ambience.loop = true
      ambience.volume = 1.0 // 원본 볼륨 그대로 사용
      setStoreAmbience(ambience)
      
      await fadeInBackgroundMusic(ambience) // 동일한 페이드 인 함수 사용
      console.log('🏪 매장 앰비언스 페이드 인 완료')
    } catch (error) {
      console.error('매장 앰비언스 재생 오류:', error)
    }
  }

  // 백그라운드 뮤직 정지
  const stopBackgroundMusic = async () => {
    if (backgroundMusic) {
      await fadeOutBackgroundMusic(backgroundMusic)
      setBackgroundMusic(null)
      setIsRadioCMPlaying(false)
      console.log('🎵 백그라운드 뮤직 페이드 아웃 완료')
    }
  }

  // 매장 앰비언스 정지
  const stopStoreAmbience = async () => {
    if (storeAmbience) {
      await fadeOutBackgroundMusic(storeAmbience) // 동일한 페이드 아웃 함수 사용
      setStoreAmbience(null)
      setIsStoreAnnouncementPlaying(false)
      console.log('🏪 매장 앰비언스 페이드 아웃 완료')
    }
  }

  // TTS 재생 완료 시 호출되는 콜백
  const handleTTSPlayEnd = () => {
    console.log('🎵 TTS 재생 완료 감지')
    if (isRadioCMPlaying && backgroundMusic) {
      console.log('🎵 라디오 CM TTS 완료 - 백그라운드 뮤직 페이드 아웃 시작')
      stopBackgroundMusic()
    }
    if (isStoreAnnouncementPlaying && storeAmbience) {
      console.log('🏪 매장방송 TTS 완료 - 앰비언스 페이드 아웃 시작')
      stopStoreAmbience()
    }
    if (isPhoneEQActive) {
      console.log('📞 고객상담 TTS 완료 - 전화기 EQ 해제')
      removePhoneEQ()
      setIsPhoneEQActive(false)
    }
    if (phoneRingAudio) {
      phoneRingAudio.pause()
      phoneRingAudio.currentTime = 0
      setPhoneRingAudio(null)
    }
  }

  const handleContentClick = async (text: string, contentType: string) => {
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
    
    // 다른 콘텐츠 클릭 시 기존 백그라운드 사운드 및 EQ 즉시 정지
    if (contentType !== 'radiocm') {
      await stopBackgroundMusic()
    }
    if (contentType !== 'store') {
      await stopStoreAmbience()
    }
    if (contentType !== 'customer') {
      removePhoneEQ()
      setIsPhoneEQActive(false)
    }
    if (contentType !== 'customer' && phoneRingAudio) {
      phoneRingAudio.pause()
      phoneRingAudio.currentTime = 0
      setPhoneRingAudio(null)
    }
    
    // TTS 중지가 완전히 완료될 때까지 잠시 대기
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // 라디오 CM인 경우 백그라운드 뮤직 시작
    if (contentType === 'radiocm') {
      await startBackgroundMusic()
      setIsRadioCMPlaying(true)
    } else {
      setIsRadioCMPlaying(false)
    }
    
    // 매장방송인 경우 앰비언스 시작
    if (contentType === 'store') {
      await startStoreAmbience()
      setIsStoreAnnouncementPlaying(true)
    } else {
      setIsStoreAnnouncementPlaying(false)
    }
    
    // 고객상담인 경우 전화기 EQ 활성화 및 전화 벨소리 시작
    if (contentType === 'customer') {
      setIsPhoneEQActive(true)
      console.log('📞 고객상담 - 전화기 EQ 필터 활성화')
      
      // 전화 벨소리 재생 (볼륨 50%, 1회만)
      try {
        const ringAudio = new Audio('/phone-ring.mp3')
        ringAudio.volume = 0.5
        ringAudio.loop = false
        setPhoneRingAudio(ringAudio)
        
        console.log('📞 전화 벨소리 재생 시작')
        
        // 벨소리 재생 완료를 기다리는 Promise
        const ringPromise = new Promise<void>((resolve, reject) => {
          ringAudio.onended = () => {
            console.log('📞 전화 벨소리 재생 완료')
            setPhoneRingAudio(null)
            resolve()
          }
          
          ringAudio.onerror = (error) => {
            console.error('📞 전화 벨소리 재생 오류:', error)
            setPhoneRingAudio(null)
            reject(error)
          }
        })
        
        // 벨소리 재생 시작
        await ringAudio.play()
        
        // 벨소리 재생 완료까지 대기
        await ringPromise
        
      } catch (error) {
        console.error('📞 전화 벨소리 재생 실패:', error)
        setPhoneRingAudio(null)
      }
    } else {
      setIsPhoneEQActive(false)
    }
    
    // 새로운 TTS 재생
    try {
      console.log('🎵 새로운 TTS 재생 시작...')
      
      // 고객상담인 경우 전화기 EQ 적용을 위한 오디오 엘리먼트 감지
      if (contentType === 'customer') {
        console.log('📞 고객상담 - 전화기 EQ 적용을 위한 특별 처리 시작')
        
        // TTS 재생 시작 (벨소리 완료 후 실행됨)
        const playPromise = ttsPlayerRef.current.playFullTTS(text)
        
        // 전화기 EQ 적용을 지속적으로 시도하는 함수
        const applyPhoneEQWithRetry = async () => {
          let attempts = 0
          const maxAttempts = 200 // 최대 20초 대기 (100ms * 200)
          
          while (attempts < maxAttempts) {
            const audioElements = document.querySelectorAll('audio')
            
            if (audioElements.length > 0) {
              const latestAudio = audioElements[audioElements.length - 1] as HTMLAudioElement
              
              // 오디오 엘리먼트가 준비되었는지 확인
              if (latestAudio && latestAudio.src) {
                console.log(`📞 전화기 EQ 적용 시도 ${attempts + 1}/${maxAttempts}`)
                
                try {
                  // 전화기 EQ 적용 시도
                  const eqApplied = applyPhoneEQ(latestAudio)
                  
                  if (eqApplied) {
                    console.log('📞 전화기 EQ 적용 성공!')
                    return true
                  }
                } catch (error) {
                  console.log(`📞 전화기 EQ 적용 시도 ${attempts + 1} 실패:`, error)
                }
              }
            }
            
            // 100ms 대기 후 다시 시도
            await new Promise(resolve => setTimeout(resolve, 100))
            attempts++
          }
          
          console.error('📞 전화기 EQ 적용 최대 시도 횟수 초과')
          return false
        }
        
        // 비동기로 전화기 EQ 적용 시도
        applyPhoneEQWithRetry()
        
        await playPromise
      } else {
        await ttsPlayerRef.current.playFullTTS(text)
      }
      
      console.log('🎵 새로운 TTS 재생 완료')
      
      // 라디오 CM, 매장방송, 고객상담이 아닌 경우에만 여기서 백그라운드 사운드 및 EQ 정지
      // 라디오 CM, 매장방송, 고객상담은 handleTTSPlayEnd에서 처리
      if (contentType !== 'radiocm') {
        await stopBackgroundMusic()
      }
      if (contentType !== 'store') {
        await stopStoreAmbience()
      }
      if (contentType !== 'customer') {
        removePhoneEQ()
        setIsPhoneEQActive(false)
      }
    } catch (error) {
      console.error('Error playing TTS:', error)
      // 에러 발생 시 모든 백그라운드 사운드 및 EQ 정지
      await stopBackgroundMusic()
      await stopStoreAmbience()
      removePhoneEQ()
      setIsPhoneEQActive(false)
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
            onClick={() => handleContentClick(generatedContent.tvcm, 'tvcm')}
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
            onClick={() => handleContentClick(generatedContent.radiocm, 'radiocm')}
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
            onClick={() => handleContentClick(generatedContent.internalBroadcast, 'internal')}
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
            onClick={() => handleContentClick(generatedContent.customerService, 'customer')}
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
            onClick={() => handleContentClick(generatedContent.storeAnnouncement, 'store')}
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
          onPlayEnd={handleTTSPlayEnd}
          className="flex-1 mr-4"
          voiceId={actualVoiceId}
          speakingRate={1.2}
        />
      </div>
    </div>
  )
}
