'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import TTSPlayer, { TTSPlayerRef } from './TTSPlayer'

interface CompanyInfoProps {
  companyName: string
  onComplete: (info: string[]) => void
}

export default function CompanyInfo({ companyName, onComplete }: CompanyInfoProps) {
  const [companyInfo, setCompanyInfo] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState('')
  const isFetchingRef = React.useRef(false)
  const ttsPlayerRef = React.useRef<TTSPlayerRef>(null)

  useEffect(() => {
    console.log('🔍 useEffect triggered - companyName:', companyName, 'isFetching:', isFetchingRef.current)
    if (!isFetchingRef.current) {
      console.log('🚀 fetchCompanyInfo 호출')
      isFetchingRef.current = true
      fetchCompanyInfo()
    } else {
      console.log('⚠️ 이미 fetch 중, 건너뜀')
    }
  }, [companyName])

  const fetchCompanyInfo = async () => {
    console.log('🚀 fetchCompanyInfo 호출 시작 - timestamp:', Date.now())
    try {
      setIsLoading(true)
      setError('')

                        // Perplexity API 호출
                  const response = await axios.post('/api/perplexity', {
                    companyName,
                    prompt: `### ${companyName} 회사에 대해서 검색하고 알려줘. 일본에 있는 회사야. 회사의 역사, 사업영역과 대표 제품, 이미지(브랜드, 슬로건 등), 최근 마케팅, 캠페인, 유명한 출시제품. 550자 넘지 않도록. 

중요: 
- 접두, 접미 미사여구 제거
- [1], [2], [3] 같은 각주나 참조 번호 제거
- (괄호) 형태의 설명이나 부가 정보 제거
- 순수한 회사 정보만 존댓말로 출력
- 마크다운 형식이나 특수 기호 사용 금지
- 영어 단어나 외래어는 한글로 번역하여 사용
- 최근 마케팅, 캠페인, 유명한 출시제품이 없다면 본문에 언급할 필요 없음
`
                  })

      const info = response.data.info
      console.log('=== Perplexity API 응답 ===')
      console.log('응답 데이터:', response.data)
      console.log('추출된 info:', info)
      console.log('=======================')
      
                        setCompanyInfo(info)
                  
                  // 부모 컴포넌트에 완료 알림 (하지만 자동으로 다음 단계로 넘어가지 않음)
                  onComplete([info])
                  
                  // TTS 재생 시작 (TTSPlayer가 마운트된 후)
                  console.log('🎵 TTS 재생 시작...')
                  console.log('🎵 ttsPlayerRef.current:', ttsPlayerRef.current)
                  console.log('🎵 info:', info)
                  
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
                        await ttsPlayerRef.current.playFullTTS(info)
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
      console.error('Error fetching company info:', error)
      setError('회사 정보를 가져오는 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
      isFetchingRef.current = false // Reset fetching state
    }
  }

  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-center loading-container">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3">회사에 대해 공부하는 중이에요</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="text-red-600 mb-4">{error}</div>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <h2 className="header-title text-center mb-12" style={{ color: 'rgba(0, 0, 0, 0.8)' }}>{companyName}에 대해 찾아 봤어요</h2>
      
      <div className="mb-6">
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap company-info-content">
          {companyInfo}
        </div>
      </div>
      
      <div className="flex justify-between items-center hidden">
        <TTSPlayer 
          ref={ttsPlayerRef}
          text={companyInfo}
          onPlayStart={() => setIsPlaying(true)}
          onPlayEnd={() => setIsPlaying(false)}
          className="flex-1 mr-4"
        />
      </div>
    </div>
  )
}
