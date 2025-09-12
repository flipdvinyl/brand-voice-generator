'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import TTSPlayer, { TTSPlayerRef } from './TTSPlayer'

interface BrandVoiceRecommendationProps {
  companyName: string
  companyInfo: string
  onComplete: (brandVoice: string[], hashtags: string[]) => void
  onImageGenerated: (imageUrl: string | null) => void
  imageGenerationEnabled: boolean
}

function BrandVoiceRecommendation({ 
  companyName, 
  companyInfo, 
  onComplete,
  onImageGenerated,
  imageGenerationEnabled
}: BrandVoiceRecommendationProps) {
  const [brandVoice, setBrandVoice] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [imageError, setImageError] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [loadingDots, setLoadingDots] = useState('')
  
  // 🚨 중복 호출 방지를 위한 ref (CompanyInfo와 동일한 패턴)
  const isFetchingRef = React.useRef(false)
  const ttsPlayerRef = React.useRef<TTSPlayerRef>(null)
  

  useEffect(() => {
    console.log('🔍 useEffect triggered - companyName:', companyName, 'companyInfo:', companyInfo?.substring(0, 50) + '...', 'isFetching:', isFetchingRef.current)
    if (!isFetchingRef.current) {
      console.log('🚀 fetchBrandVoice 호출')
      isFetchingRef.current = true
      fetchBrandVoice()
    } else {
      console.log('⚠️ 이미 fetch 중, 건너뜀')
    }
  }, [companyName, companyInfo])


  // 브랜드 보이스가 생성되면 자동으로 이미지 생성 (imageGenerationEnabled가 true일 때만)
  useEffect(() => {
    if (imageGenerationEnabled && brandVoice && !isGeneratingImage && !generatedImage) {
      generateImage()
    }
  }, [brandVoice, imageGenerationEnabled])

  // 로딩 점 애니메이션 효과
  useEffect(() => {
    if (isGeneratingImage) {
      const interval = setInterval(() => {
        setLoadingDots(prev => {
          if (prev === '...') return ''
          return prev + '.'
        })
      }, 300) // 0.3초마다 점 추가

      return () => clearInterval(interval)
    } else {
      setLoadingDots('')
    }
  }, [isGeneratingImage])

  const fetchBrandVoice = async () => {
    try {
      setIsLoading(true)
      setError('')

      // Perplexity API 호출
      const response = await axios.post('/api/perplexity', {
        companyName,
        prompt: `### ${companyName}회사의 브랜드 보이스를 추천해줘. 

**참고 자료:**
- 회사 소개: ${companyInfo}
- 회사명: ${companyName}

**브랜드 보이스 요청사항:**
브랜드 보이스는 사람 형태의 캐릭터로 추천해줘. 사람의 페르소나를 500자 이내로 제안해줘. 성격과 특징을 묘사해줘. 접두, 접미 미사여구 뺴고 정보만 간단히 존댓말로 출력.
위 ${companyInfo}와 ${companyName}회사의 대표 제품군(복수개)을 파악하고, 이를 바탕으로 브랜드 보이스 캐릭터를 제안해줘. 이 제품군은 본문에 별도 명시할 필요없어.
- [1], [2], [3] 같은 각주나 참조 번호 제거
- (괄호) 형태의 설명이나 부가 정보 제거
- '-'대시나, '**'강조 형태 제거

**해시태그 생성 요청:**
해당 캐릭터를 나타나는 10개의 해시태그를 다음 순서로 정확히 생성해줘:
1번 #성별을 명시해줘 (예: #남성, #여성, #중성)
2번 #나이대 (예: #20대, #30대후반, #40대초반)
3번 #성격 (예: #전문가, #친근함, #신뢰감)
4번 #목소리톤 (예: #차분하고안정감있는톤, #따뜻하고친근한목소리톤, #전문적이고신뢰감있는톤) - 최소 10자 이상
5-10번. 나머지 6개는 ${companyName}회사의 대표 제품군과 사업 영역을 기반으로 한 구체적인 캐릭터 특징을 나타내는 해시태그로, 각각 10자 이내로 작성해주세요. 
5-10번 해시태그 작성 가이드:
- 회사의 대표 제품군(복수개)을 파악하여 각 제품군별 특성을 반영
- 구체적인 업무 상황이나 고객과의 상호작용을 묘사
- 제품의 특징, 품질, 서비스 방식 등을 캐릭터의 능력과 연결
- 예시: #카메라정밀함반영설명, #게임즐거움전달소통

정확히 10개를 #실제해시태그내용 형태로 출력해줘. 
#해시태그1, #해시태그2 같은 번호 형태는 사용하지 말고, '해시태그' 같은 제목도 필요 없어. 단순히 해시태그만 10개 표시해줘.


`
      })

      const info = response.data.info
      
      // 해시태그 추출
      const hashtagMatches = info.match(/#[^\s#]+/g) || []
      console.log('🔍 추출된 해시태그:', hashtagMatches)
      
      // 해시태그 제거한 텍스트
      const cleanText = info.replace(/#[^\s#]+/g, '').trim()
      
      setBrandVoice(cleanText)
      setHashtags(hashtagMatches)
      // 부모 컴포넌트에 완료 알림 (하지만 자동으로 다음 단계로 넘어가지 않음)
      onComplete([cleanText], hashtagMatches)
      
      // TTS 재생 시작 (TTSPlayer가 마운트된 후)
      console.log('🎵 TTS 재생 시작...')
      console.log('🎵 ttsPlayerRef.current:', ttsPlayerRef.current)
      console.log('🎵 cleanText:', cleanText)
      
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
          console.log('🎵 TTSPlayer 준비 완료, playFullTTS 호출 시도...')
          try {
            await ttsPlayerRef.current.playFullTTS(cleanText)
            console.log('🎵 playFullTTS 호출 성공')
          } catch (error) {
            console.error('🎵 playFullTTS 호출 실패:', error)
          }
        } else {
          console.error('🎵 TTSPlayer 마운트 실패, TTS 재생 불가')
        }
      }
      
      // 비동기로 TTSPlayer 대기 및 TTS 시작
      waitForTTSPlayer()
    } catch (error) {
      console.error('Error generating brand voice:', error)
      setError('브랜드 보이스 생성 중 오류가 발생했습니다.')
      
      // 에러 시 기본 메시지만 표시
      setError('브랜드 보이스 생성 중 오류가 발생했습니다. 다시 시도해주세요.')
      setBrandVoice('')
      setHashtags([])
      // 사용자가 "다음" 버튼을 클릭해야 다음 단계로 진행
    } finally {
      setIsLoading(false)
      isFetchingRef.current = false // Reset fetching state (CompanyInfo와 동일한 패턴)
    }
  }

  const generateImage = async () => {
    try {
      setIsGeneratingImage(true)
      setImageError('')
      
      console.log('🎨 Gemini 이미지 생성 시작...')
      console.log('📝 브랜드 보이스 텍스트:', brandVoice.substring(0, 100) + '...')
      
      // 현재 창 비율 정보 가져오기
      const windowRatio = {
        width: window.innerWidth,
        height: window.innerHeight
      }
      
      console.log('📐 현재 창 비율:', windowRatio)
      
      const response = await axios.post('/api/gemini-image', {
        brandVoiceText: brandVoice,
        windowRatio: windowRatio
      })

      console.log('📡 API 응답:', response.data)

      if (response.data.success && response.data.imageData) {
        // base64 이미지 데이터를 data URL로 변환
        const imageUrl = `data:${response.data.mimeType};base64,${response.data.imageData}`
        setGeneratedImage(imageUrl)
        onImageGenerated(imageUrl) // 부모 컴포넌트에 이미지 URL 전달
        console.log('✅ Gemini 이미지 생성 성공')
      } else {
        console.error('❌ API 응답에 이미지 데이터가 없음:', response.data)
        throw new Error(response.data.error || '이미지 데이터를 받지 못했습니다.')
      }
    } catch (error: any) {
      console.error('❌ Gemini 이미지 생성 오류:', error)
      
      let errorMessage = '이미지 생성에 실패했습니다.'
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setImageError(errorMessage)
    } finally {
      setIsGeneratingImage(false)
    }
  }


  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-center loading-container">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3">브랜드 보이스를 생성하는 중...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="text-red-600 mb-4">{error}</div>
        <div className="text-sm text-gray-600">
          더미 데이터로 계속 진행합니다.
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6 relative">
        <h2 className="header-title text-center mb-12" style={{ color: 'rgba(0, 0, 0, 0.8)' }} dangerouslySetInnerHTML={{
          __html: `${companyName}에 어울리는<br>브랜드 보이스를 제안해요`
        }}></h2>
        
        <div className="mb-6">
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4 brand-voice-content">
          {brandVoice}
        </div>
        
        {hashtags.length > 0 && (
          <div className="mb-4" style={{ marginTop: '1rem' }}>
            <div className="flex flex-wrap" style={{ gap: '1rem' }}>
              {hashtags.map((hashtag, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full font-medium hashtag ${
                    index < 4 
                      ? 'bg-purple-100 text-purple-800 border border-purple-200' // 핵심 4개 (성별, 나이대, 성격, 목소리톤)
                      : 'bg-blue-100 text-blue-800 border border-blue-200' // 나머지 6개
                  }`}
                  title={
                    index === 0 ? '성별' :
                    index === 1 ? '나이대' :
                    index === 2 ? '성격' :
                    index === 3 ? '목소리톤' :
                    '브랜드 특성'
                  }
                >
                  {hashtag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 이미지 생성 상태 표시 (imageGenerationEnabled가 true일 때만) */}
        {imageGenerationEnabled && isGeneratingImage && (
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4 brand-voice-content">
            브랜드 보이스에 캐릭터를 상상하고 있어요{loadingDots}
          </div>
        )}
        
        {imageGenerationEnabled && imageError && (
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4 brand-voice-content">
            {imageError}
            <button 
              onClick={generateImage}
              className="ml-2 text-blue-600 hover:text-blue-800 underline"
            >
              다시 시도
            </button>
          </div>
        )}
        </div>
        
        <div className="flex justify-between items-center hidden">
          <TTSPlayer 
            ref={ttsPlayerRef}
            text={brandVoice}
            onPlayStart={() => setIsPlaying(true)}
            onPlayEnd={() => setIsPlaying(false)}
            className="flex-1 mr-4"
          />
        </div>
        
    </div>
  )
}

export default BrandVoiceRecommendation