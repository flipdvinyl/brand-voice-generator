'use client'

import React, { useState, useImperativeHandle, forwardRef, useRef } from 'react'
import axios from 'axios'

// TTS 설정 상수
export const TTS_SPEAKING_RATE = 1.4 // 발화속도 (1.0 = 기본속도, 1.4 = 1.4배 빠름)

// 텍스트를 언어별로 적절한 길이로 분할하는 함수
export const splitTextForTTS = (text: string): string[] => {
  // 언어 감지 (간단한 유니코드 기반)
  const hasKorean = /[\uAC00-\uD7AF]/.test(text)
  const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text)
  const hasEnglish = /[a-zA-Z]/.test(text)
  
  // 언어별 최대 길이 설정
  let maxLength = 200 // 기본값 (한글, 일본어)
  if (hasEnglish && !hasKorean && !hasJapanese) {
    maxLength = 300 // 영어만 있는 경우
  }
  
  console.log(`언어 감지: 한글=${hasKorean}, 일본어=${hasJapanese}, 영어=${hasEnglish}, 최대길이=${maxLength}자`)
  
  if (text.length <= maxLength) {
    return [text]
  }
  
  // 문장 단위로 분할 시도
  const sentences = text.split(/[.!?。！？]/)
  const chunks: string[] = []
  let currentChunk = ''
  
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim()
    if (!trimmedSentence) continue
    
    if (currentChunk.length + trimmedSentence.length <= maxLength) {
      currentChunk += (currentChunk ? '. ' : '') + trimmedSentence
    } else {
      if (currentChunk) {
        chunks.push(currentChunk + '.')
      }
      currentChunk = trimmedSentence
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk + '.')
  }
  
  // 여전히 너무 긴 청크가 있다면 강제로 자르기
  const finalChunks: string[] = []
  for (const chunk of chunks) {
    if (chunk.length <= maxLength) {
      finalChunks.push(chunk)
    } else {
      // 강제로 자르기
      for (let i = 0; i < chunk.length; i += maxLength) {
        finalChunks.push(chunk.slice(i, i + maxLength))
      }
    }
  }
  
  console.log(`텍스트 분할 완료: ${text.length}자 → ${finalChunks.length}개 청크`)
  return finalChunks
}

// 전역적으로 현재 재생 중인 오디오를 추적
let globalCurrentAudio: HTMLAudioElement | null = null

// 전역 TTS 무시 플래그 (다음 섹션으로 넘어간 후 반환되는 TTS 오디오 무시)
let globalTTSIgnoreFlag = false

// TTS 무시 플래그 리셋 함수 (새로운 섹션에서 TTS를 사용할 때 호출)
export const resetTTSIgnoreFlag = () => {
  globalTTSIgnoreFlag = false
  console.log('✅ 전역 TTS 무시 플래그 리셋 - TTS 재생 허용')
}

// TTS 완전 초기화 함수 (외부에서 사용 가능)
export const resetAllTTSGlobal = () => {
  console.log('🔄 TTSPlayer의 resetAllTTSGlobal 함수 호출')
  
  try {
    // 0. 전역 TTS 무시 플래그 설정 (가장 먼저!)
    globalTTSIgnoreFlag = true
    console.log('🚫 전역 TTS 무시 플래그 설정 - 이후 반환되는 TTS 오디오 무시')
    
    // 1. 전역 currentAudio 즉시 중지
    if (globalCurrentAudio) {
      console.log('🚫 전역 currentAudio 즉시 중지 중...')
      globalCurrentAudio.pause()
      globalCurrentAudio.currentTime = 0
      globalCurrentAudio.volume = 0
      globalCurrentAudio.muted = true
      globalCurrentAudio.src = ''
      globalCurrentAudio = null
      console.log('✅ 전역 currentAudio 중지 완료')
    }
    
    // 2. 모든 오디오 요소 찾아서 중지
    const allAudios = document.querySelectorAll('audio')
    allAudios.forEach((audio, index) => {
      console.log(`🚫 오디오 요소 ${index + 1} 중지 중...`)
      audio.pause()
      audio.currentTime = 0
      audio.volume = 0
      audio.muted = true
      audio.src = ''
    })
    console.log(`✅ 총 ${allAudios.length}개 오디오 요소 중지 완료`)
    
    // 3. 모든 TTSPlayer의 resetAllTTS 함수 호출
    const ttsPlayers = document.querySelectorAll('[data-tts-button]')
    ttsPlayers.forEach((button, index) => {
      console.log(`🔄 TTSPlayer ${index + 1} 초기화 중...`)
      if (button instanceof HTMLButtonElement) {
        // 재생 중인 경우에만 클릭 (중지 효과)
        if (button.textContent?.includes('재생 중')) {
          button.click()
        }
      }
    })
    
    console.log('✅ TTSPlayer의 resetAllTTSGlobal 완료')
  } catch (error) {
    console.error('❌ TTSPlayer의 resetAllTTSGlobal 오류:', error)
  }
}

// 오디오 엘리먼트를 DOM에 추가하는 헬퍼 함수
const addAudioToDOM = (audio: HTMLAudioElement): void => {
  try {
    // 오디오 엘리먼트를 body에 추가 (숨김 처리)
    audio.style.display = 'none'
    audio.style.visibility = 'hidden'
    audio.style.position = 'absolute'
    audio.style.left = '-9999px'
    document.body.appendChild(audio)
    console.log('✅ 오디오 엘리먼트를 DOM에 추가 완료')
  } catch (error) {
    console.error('❌ 오디오 엘리먼트 DOM 추가 실패:', error)
  }
}

// 오디오 엘리먼트를 DOM에서 안전하게 제거하는 헬퍼 함수
const removeAudioFromDOM = (audio: HTMLAudioElement): void => {
  try {
    if (audio && audio.parentNode) {
      audio.parentNode.removeChild(audio)
      console.log('✅ 오디오 엘리먼트를 DOM에서 제거 완료')
    }
  } catch (error) {
    console.error('❌ 오디오 엘리먼트 DOM 제거 실패:', error)
  }
}

// 첫 번째 청크를 미리 생성하여 버퍼링하는 함수
export const prepareFirstChunk = async (text: string, voiceId?: string, speakingRate?: number): Promise<HTMLAudioElement | null> => {
  try {
    const textChunks = splitTextForTTS(text)
    if (textChunks.length > 0) {
      const firstChunk = textChunks[0]
      console.log('첫 번째 청크 TTS 생성:', firstChunk.substring(0, 50) + '...')
      
      // 첫 번째 청크만 TTS 생성
      const response = await axios.post('/api/tts', {
        text: firstChunk,
        speakingRate: speakingRate || TTS_SPEAKING_RATE,
        voiceId: voiceId
      })

      if (response.data.audioUrl) {
        const audio = new Audio(response.data.audioUrl)
        // 오디오 엘리먼트를 DOM에 추가
        addAudioToDOM(audio)
        console.log('첫 번째 TTS 청크 생성 완료')
        return audio
      }
    }
  } catch (error) {
    console.error('첫 번째 TTS 청크 생성 실패:', error)
  }
  return null
}

// 첫 번째 청크를 즉시 재생하는 함수
export const playFirstChunk = async (audio: HTMLAudioElement, onPlayStart?: () => void, onPlayEnd?: () => void) => {
  try {
    onPlayStart?.()
    console.log('첫 번째 청크 재생 시작')
    
    // 첫 번째 청크 재생
    const playPromise = new Promise<void>((resolve, reject) => {
      audio.oncanplaythrough = () => {
        console.log('첫 번째 청크 오디오 로딩 완료, 재생 시작')
        audio.play().catch(reject)
      }
      
      audio.onended = () => {
        console.log('첫 번째 청크 재생 완료')
        resolve()
      }
      
      audio.onerror = () => {
        console.error('첫 번째 청크 재생 오류')
        reject(new Error('첫 번째 청크 재생 오류'))
      }
      
      audio.load()
    })
    
    await playPromise
    console.log('첫 번째 청크 재생 완료')
    
  } catch (error) {
    console.error('첫 번째 청크 재생 오류:', error)
  } finally {
    onPlayEnd?.()
  }
}

// 나머지 청크들을 백그라운드에서 생성하고 순차 재생하는 함수
export const prepareRemainingChunks = async (text: string, stopRequestedRef?: React.MutableRefObject<boolean>, voiceId?: string, speakingRate?: number): Promise<HTMLAudioElement[]> => {
  try {
    const textChunks = splitTextForTTS(text)
    if (textChunks.length <= 1) {
      console.log('청크가 1개 이하이므로 추가 생성 불필요')
      return []
    }
    
    console.log('나머지 청크 TTS 생성 시작...')
    const remainingChunks = textChunks.slice(1) // 첫 번째 청크 제외
    
    // 나머지 청크들을 병렬로 생성
    const audioPromises = remainingChunks.map(async (chunk, index) => {
      const chunkIndex = index + 1 // 실제 청크 인덱스 (첫 번째 제외)
      console.log(`청크 ${chunkIndex + 1}/${textChunks.length} TTS 생성 시작: ${chunk.substring(0, 50)}...`)
      
        try {
          const response = await axios.post('/api/tts', {
            text: chunk,
            speakingRate: speakingRate || TTS_SPEAKING_RATE,
            voiceId: voiceId
          })

        if (response.data.audioUrl) {
          const audio = new Audio(response.data.audioUrl)
          // 오디오 엘리먼트를 DOM에 추가
          addAudioToDOM(audio)
          console.log(`청크 ${chunkIndex + 1} TTS 생성 완료`)
          return { index: chunkIndex, audio }
        }
      } catch (error) {
        console.error(`청크 ${chunkIndex + 1} TTS 생성 실패:`, error)
      }
      return null
    })
    
    // 모든 나머지 청크 생성 완료 대기
    const results = await Promise.all(audioPromises)
    const validResults = results.filter(result => result !== null)
    
    console.log(`나머지 청크 TTS 생성 완료: ${validResults.length}개`)
    
    // 생성된 오디오들을 순차적으로 재생
    const audios = validResults.map(result => result!.audio)
    if (stopRequestedRef) {
      await playRemainingChunksSequentially(audios, stopRequestedRef)
    }
    
    return audios
    
  } catch (error) {
    console.error('나머지 청크 TTS 생성 오류:', error)
    return []
  }
}

// 나머지 청크들을 순차적으로 재생하는 함수
const playRemainingChunksSequentially = async (audios: HTMLAudioElement[], stopRequestedRef: React.MutableRefObject<boolean>): Promise<void> => {
  for (let i = 0; i < audios.length; i++) {
    // 재생 중지 요청이 있었는지 확인
    if (stopRequestedRef.current) {
      console.log('🚫 나머지 청크 재생 중 중지 요청으로 인한 중단')
      break
    }
    
    const audio = audios[i]
    console.log(`나머지 청크 ${i + 1}/${audios.length} 순차 재생 시작`)
    
    try {
      // 현재 청크 재생 완료를 기다리는 Promise
      const playChunk = new Promise<void>((resolve, reject) => {
        // 오디오 로딩 완료 후 재생
        audio.oncanplaythrough = () => {
          // 재생 중지 요청이 있었는지 확인
          if (stopRequestedRef.current) {
            console.log(`🚫 나머지 청크 ${i + 1} 재생 중지됨`)
            resolve()
            return
          }
          console.log(`나머지 청크 ${i + 1} 오디오 로딩 완료, 재생 시작`)
          audio.play().catch(reject)
        }
        
        // 오디오 재생 완료 시 resolve
        audio.onended = () => {
          console.log(`나머지 청크 ${i + 1} 재생 완료`)
          resolve()
        }
        
        // 오디오 재생 중 오류 발생 시 reject
        audio.onerror = () => {
          console.error(`나머지 청크 ${i + 1} 재생 오류`)
          reject(new Error(`나머지 청크 ${i + 1} 재생 오류`))
        }
        
        // 오디오 로딩
        audio.load()
      })
      
      await playChunk
      
      // 마지막 청크가 아니면 잠시 대기 (청크 간 간격)
      if (i < audios.length - 1) {
        console.log(`나머지 청크 ${i + 1} 완료, 다음 청크 대기 중...`)
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
    } catch (error) {
      console.error(`나머지 청크 ${i + 1} 재생 중 오류:`, error)
    }
  }
  
  if (stopRequestedRef.current) {
    console.log('🚫 나머지 청크 순차 재생이 중지됨')
  } else {
    console.log('✅ 모든 나머지 청크 순차 재생 완료')
  }
}

interface TTSPlayerProps {
  text: string
  onPlayStart?: () => void
  onPlayEnd?: () => void
  autoPlay?: boolean
  className?: string
  voiceId?: string
  speakingRate?: number
}

export interface TTSPlayerRef {
  stopAndResetTTS: () => void
  playTTS: () => void
  playFullTTS: (text: string) => Promise<void>
  resetAllTTS: () => void
}

const TTSPlayer = forwardRef<TTSPlayerRef, TTSPlayerProps>(({ 
  text, 
  onPlayStart, 
  onPlayEnd, 
  autoPlay = false,
  className = '',
  voiceId,
  speakingRate = TTS_SPEAKING_RATE
}, ref) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [audioBuffers, setAudioBuffers] = useState<HTMLAudioElement[]>([])
  
  // 재생 중지 플래그를 위한 ref
  const stopRequestedRef = useRef(false)
  const currentPlayPromiseRef = useRef<Promise<void> | null>(null)

  // ref를 통해 외부에서 사용할 수 있는 함수들을 노출
  useImperativeHandle(ref, () => ({
    stopAndResetTTS: () => {
      console.log('🚫 TTS 재생 중지 및 초기화 시작')
      
      // 재생 중지 플래그 설정
      stopRequestedRef.current = true
      
      // 현재 재생 중인 오디오 강제 중지 및 정리
      if (currentAudio) {
        try {
          console.log('현재 재생 중인 오디오 중지 중...')
          currentAudio.pause()
          currentAudio.currentTime = 0
          currentAudio.volume = 0  // 볼륨을 0으로 설정
          currentAudio.muted = true  // 음소거 설정
          currentAudio.src = ''
          removeAudioFromDOM(currentAudio)  // 오디오 요소를 DOM에서 제거
          console.log('✅ 현재 재생 중인 오디오 정리 완료')
        } catch (error) {
          console.error('❌ 현재 오디오 정리 중 오류:', error)
        }
        setCurrentAudio(null)
      }
      
      // 모든 오디오 버퍼 강제 정리
      if (audioBuffers.length > 0) {
        console.log(`${audioBuffers.length}개 오디오 버퍼 정리 중...`)
        audioBuffers.forEach((audio, index) => {
          try {
            audio.pause()
            audio.currentTime = 0
            audio.volume = 0  // 볼륨을 0으로 설정
            audio.muted = true  // 음소거 설정
            audio.src = ''
            removeAudioFromDOM(audio)  // 오디오 요소를 DOM에서 제거
            console.log(`✅ 버퍼 ${index + 1} 오디오 정리 완료`)
          } catch (error) {
            console.error(`❌ 버퍼 ${index + 1} 정리 중 오류:`, error)
          }
        })
        setAudioBuffers([])
        console.log('✅ 모든 오디오 버퍼 정리 완료')
      }
      
      // 재생 상태 강제 초기화
      setIsPlaying(false)
      onPlayEnd?.()
      
      console.log('✅ TTS 재생 중지 및 초기화 완료')
    },
    resetAllTTS: () => {
      console.log('🔄 TTS 완전 초기화 시작')
      
      // 1. 재생 중지 플래그 설정 (모든 진행 중인 작업 중단)
      stopRequestedRef.current = true
      
      // 2. 🚨 현재 재생 중인 오디오 강제 중지 및 완전 제거 (가장 중요!)
      if (currentAudio) {
        try {
          console.log('🚨 현재 재생 중인 오디오 발견! 강제 중지 시작...')
          console.log('🚨 오디오 상태 확인:', {
            paused: currentAudio.paused,
            currentTime: currentAudio.currentTime,
            duration: currentAudio.duration,
            volume: currentAudio.volume,
            muted: currentAudio.muted,
            src: currentAudio.src ? '있음' : '없음'
          })
          
          // 🚨 즉시 소리 차단 (가장 중요!)
          console.log('🚨 1단계: 즉시 소리 차단...')
          currentAudio.volume = 0
          currentAudio.muted = true
          console.log('✅ 즉시 소리 차단 완료')
          
          // 🚨 강제 중지
          console.log('🚨 2단계: 강제 중지...')
          currentAudio.pause()
          
          // Safari/Chrome 전용 stop 메서드
          if ('stop' in currentAudio && typeof (currentAudio as any).stop === 'function') {
            console.log('🚨 Safari/Chrome stop() 메서드 사용...')
            try {
              (currentAudio as any).stop()
            } catch (error) {
              console.log('stop() 메서드 호출 실패, 무시하고 계속 진행')
            }
          }
          
          console.log('✅ 강제 중지 완료')
          
          // 🚨 모든 속성 초기화
          console.log('🚨 3단계: 모든 속성 초기화...')
          currentAudio.currentTime = 0
          currentAudio.playbackRate = 0
          currentAudio.src = ''
          console.log('✅ 모든 속성 초기화 완료')
          
          // 🚨 이벤트 리스너 제거
          console.log('🚨 4단계: 이벤트 리스너 제거...')
          currentAudio.oncanplaythrough = null
          currentAudio.onended = null
          currentAudio.onerror = null
          currentAudio.onloadstart = null
          currentAudio.onplay = null
          currentAudio.onpause = null
          currentAudio.onloadeddata = null
          console.log('✅ 이벤트 리스너 제거 완료')
          
          // 🚨 오디오 요소 완전 제거
          console.log('🚨 5단계: 오디오 요소 완전 제거...')
          removeAudioFromDOM(currentAudio)
          console.log('✅ 오디오 요소 완전 제거 완료')
          
          console.log('✅ 현재 재생 중인 오디오 완전 제거 완료')
        } catch (error) {
          console.error('❌ 현재 오디오 제거 중 오류:', error)
          
          // 🚨 최후의 수단: 강제로 null 설정
          console.log('🚨 최후의 수단: currentAudio를 null로 강제 설정...')
          setCurrentAudio(null)
        }
        setCurrentAudio(null)
      } else {
        console.log('⚠️ currentAudio가 null입니다. 다른 방법으로 오디오 검색...')
      }
      
      // 3. 모든 오디오 버퍼 완전 제거
      if (audioBuffers.length > 0) {
        console.log(`🔄 ${audioBuffers.length}개 오디오 버퍼 완전 제거 중...`)
        audioBuffers.forEach((audio, index) => {
          try {
            // 🚨 즉시 소리 차단 (가장 중요!)
            audio.volume = 0
            audio.muted = true
            
            // 여러 방법으로 오디오 중지 시도
            audio.pause()
            audio.currentTime = 0
            audio.src = ''
            
            // 오디오 요소를 DOM에서 제거
            removeAudioFromDOM(audio)
            
            console.log(`✅ 버퍼 ${index + 1} 오디오 완전 제거 완료`)
          } catch (error) {
            console.error(`❌ 버퍼 ${index + 1} 제거 중 오류:`, error)
          }
        })
        setAudioBuffers([])
        console.log('✅ 모든 오디오 버퍼 완전 제거 완료')
      }
      
      // 4. 진행 중인 Promise 정리
      if (currentPlayPromiseRef.current) {
        console.log('🔄 진행 중인 재생 Promise 정리 중...')
        currentPlayPromiseRef.current = Promise.resolve()
        currentPlayPromiseRef.current = null
        console.log('✅ 진행 중인 재생 Promise 정리 완료')
      }
      
      // 5. 모든 상태 완전 초기화
      setIsPlaying(false)
      setCurrentAudio(null)
      setAudioBuffers([])
      
      // 6. 콜백 호출
      onPlayEnd?.()
      
      // 7. 추가 안전장치: DOM에서 모든 audio 요소 찾아서 제거
      try {
        // 모든 audio 요소 검색 (더 포괄적으로)
        const allAudioElements = document.querySelectorAll('audio')
        const allAudioByTagName = document.getElementsByTagName('audio')
        
        // 타입 안전하게 배열로 변환
        const allAudio = Array.from(allAudioElements).concat(Array.from(allAudioByTagName))
        const uniqueAudio = Array.from(new Set(allAudio))
        
        if (uniqueAudio.length > 0) {
          console.log(`🔄 DOM에서 발견된 ${uniqueAudio.length}개 audio 요소 제거 중...`)
          
          uniqueAudio.forEach((audio, index) => {
            try {
              const audioElement = audio as HTMLAudioElement
              
              // 오디오 상태 확인
              console.log(`🔄 audio 요소 ${index + 1} 상태:`, {
                paused: audioElement.paused,
                currentTime: audioElement.currentTime,
                volume: audioElement.volume,
                muted: audioElement.muted,
                src: audioElement.src
              })
              
              // 🚨 즉시 소리 차단 (가장 중요!)
              audioElement.volume = 0
              audioElement.muted = true
              
              // 강력한 중지 시도
              audioElement.pause()
              if ('stop' in audioElement && typeof (audioElement as any).stop === 'function') {
                (audioElement as any).stop()
              }
              audioElement.currentTime = 0
              audioElement.playbackRate = 0
              audioElement.src = ''
              
              // 이벤트 리스너 제거
              audioElement.oncanplaythrough = null
              audioElement.onended = null
              audioElement.onerror = null
              audioElement.onloadstart = null
              audioElement.onplay = null
              audioElement.onpause = null
              audioElement.onloadeddata = null
              
              // DOM에서 제거
              removeAudioFromDOM(audioElement)
              
              console.log(`✅ DOM audio 요소 ${index + 1} 제거 완료`)
            } catch (error) {
              console.error(`❌ DOM audio 요소 ${index + 1} 제거 중 오류:`, error)
            }
          })
        } else {
          console.log('🔄 DOM에서 audio 요소를 찾을 수 없음')
        }
      } catch (error) {
        console.error('❌ DOM audio 요소 검색/제거 중 오류:', error)
      }
      
      // 8. 🚨 핵심 해결책: window 객체의 모든 오디오 관련 속성 초기화
      try {
        console.log('🚨 window 객체 오디오 관련 속성 초기화 시작...')
        
        // Web Audio API 컨텍스트 중지
        if (window.AudioContext || (window as any).webkitAudioContext) {
          try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
            const contexts = (window as any)._audioContexts || []
            contexts.forEach((context: any) => {
              if (context && typeof context.close === 'function') {
                context.close()
              }
            })
            console.log('✅ Web Audio API 컨텍스트 중지 완료')
          } catch (error) {
            console.error('❌ Web Audio API 컨텍스트 중지 실패:', error)
          }
        }
        
        // MediaSession API 중지
        if ('mediaSession' in navigator) {
          try {
            navigator.mediaSession.setActionHandler('play', null)
            navigator.mediaSession.setActionHandler('pause', null)
            navigator.mediaSession.setActionHandler('stop', null)
            navigator.mediaSession.playbackState = 'none'
            console.log('✅ MediaSession API 중지 완료')
          } catch (error) {
            console.error('❌ MediaSession API 중지 실패:', error)
          }
        }
        
        console.log('✅ window 객체 오디오 관련 속성 초기화 완료')
      } catch (error) {
        console.error('❌ window 객체 오디오 관련 속성 초기화 중 오류:', error)
      }
      
      // 8. 최종 확인: 실제로 오디오가 중지되었는지 확인
      setTimeout(() => {
        try {
          const remainingAudio = document.querySelectorAll('audio')
          if (remainingAudio.length > 0) {
            console.log(`⚠️ 경고: 여전히 ${remainingAudio.length}개 audio 요소가 남아있음`)
            remainingAudio.forEach((audio, index) => {
              const audioElement = audio as HTMLAudioElement
              console.log(`⚠️ 남은 audio ${index + 1}:`, {
                paused: audioElement.paused,
                currentTime: audioElement.currentTime,
                volume: audioElement.volume,
                muted: audioElement.muted
              })
            })
          } else {
            console.log('✅ 모든 audio 요소가 성공적으로 제거됨')
          }
        } catch (error) {
          console.error('❌ 최종 확인 중 오류:', error)
        }
      }, 100)
      
      console.log('✅ TTS 완전 초기화 완료 - 모든 오디오, 버퍼, 상태가 완전히 제거됨')
    },
    playTTS: () => {
      if (!isPlaying && text) {
        playTTS(text)
      }
    },
    playFullTTS: async (textToPlay: string) => {
      console.log('🎯 playFullTTS 함수 호출됨, textToPlay:', textToPlay?.substring(0, 50) + '...')
      console.log('🎯 현재 isPlaying 상태:', isPlaying)
      
      if (isPlaying) {
        console.log('❌ TTS가 이미 재생 중입니다.')
        return
      }
      
      if (!textToPlay || textToPlay.trim() === '') {
        console.log('❌ 텍스트가 비어있습니다.')
        return
      }
      
      try {
        // 재생 중지 플래그 초기화
        stopRequestedRef.current = false
        setIsPlaying(true)
        onPlayStart?.()
        
        console.log('=== 전체 TTS 재생 시작 ===')
        console.log('TTS에 전달된 텍스트:', textToPlay)
        console.log('=======================')
        
        // 텍스트를 적절한 길이로 분할
        const textChunks = splitTextForTTS(textToPlay)
        console.log(`TTS 재생 시작: ${textChunks.length}개 청크`)
        
        // 첫 번째 청크와 나머지 청크를 동시에 생성하여 버퍼링
        if (textChunks.length > 0) {
          const firstChunk = textChunks[0]
          const remainingChunks = textChunks.slice(1)
          
          console.log('🎵 첫 번째 청크 TTS 생성 시작...')
          
          // 재생 중지 요청이 있었는지 먼저 확인
          if (stopRequestedRef.current) {
            console.log('🚫 TTS 생성 시작 전 중지 요청으로 인한 중단')
            return
          }
          
          // 첫 번째 청크와 나머지 청크를 병렬로 생성
          const [firstResponse, ...remainingResponses] = await Promise.all([
            // 첫 번째 청크
            axios.post('/api/tts', {
              text: firstChunk,
              speakingRate: speakingRate,
              voiceId: voiceId
            }),
            // 나머지 청크들
            ...remainingChunks.map(chunk => 
              axios.post('/api/tts', {
                text: chunk,
                speakingRate: speakingRate,
                voiceId: voiceId
              })
            )
          ])
          
          // 재생 중지 요청이 있었는지 다시 확인
          if (stopRequestedRef.current) {
            console.log('🚫 TTS 생성 완료 후 중지 요청으로 인한 중단')
            return
          }
          
          // 첫 번째 청크 처리
          if (firstResponse.data.audioUrl) {
            const firstAudio = new Audio(firstResponse.data.audioUrl)
            // 오디오 엘리먼트를 DOM에 추가
            addAudioToDOM(firstAudio)
            console.log('🎵 첫 번째 TTS 청크 생성 완료, 즉시 재생 시작')
            
            // 🚨 중요: currentAudio 상태와 전역 변수에 저장 (중지 시 찾기 위해)
            setCurrentAudio(firstAudio)
            globalCurrentAudio = firstAudio
            console.log('🎵 firstAudio를 currentAudio 상태와 전역 변수에 저장 완료')
            
            // 첫 번째 청크 즉시 재생
            await new Promise<void>((resolve, reject) => {
              firstAudio.oncanplaythrough = () => {
                console.log('🎵 첫 번째 청크 오디오 로딩 완료, 재생 시작')
                firstAudio.play().catch(reject)
              }
              
              firstAudio.onended = () => {
                console.log('🎵 첫 번째 청크 재생 완료')
                setCurrentAudio(null)  // 재생 완료 시 null로 설정
                globalCurrentAudio = null  // 전역 변수도 null로 설정
                resolve()
              }
              
              firstAudio.onerror = () => {
                console.error('🎵 첫 번째 청크 재생 오류')
                setCurrentAudio(null)  // 오류 시 null로 설정
                globalCurrentAudio = null  // 전역 변수도 null로 설정
                reject(new Error('첫 번째 청크 재생 오류'))
              }
              
              firstAudio.load()
            })
            
            console.log('🎵 첫 번째 청크 재생 완료, 버퍼링된 나머지 청크 자동 시작')
          }
          
          // 재생 중지 요청이 있었는지 확인
          if (stopRequestedRef.current) {
            console.log('🚫 첫 번째 청크 재생 완료 후 중지 요청으로 인한 중단')
            return
          }
          
          // 나머지 청크들을 버퍼에 저장
          if (remainingChunks.length > 0) {
            const newAudioBuffers: HTMLAudioElement[] = []
            
            console.log('🎵 버퍼링된 나머지 청크 처리 시작...')
            for (let i = 0; i < remainingResponses.length; i++) {
              const response = remainingResponses[i]
              if (response?.data?.audioUrl) {
                const audio = new Audio(response.data.audioUrl)
                // 오디오 엘리먼트를 DOM에 추가
                addAudioToDOM(audio)
                newAudioBuffers[i] = audio
                console.log(`🎵 나머지 청크 ${i + 1} 버퍼에 저장 완료`)
              }
            }
            
            // 오디오 버퍼 상태 업데이트
            setAudioBuffers(newAudioBuffers)
            
            console.log('🎵 모든 청크 버퍼링 완료, 순차 재생 시작...')
            
            // 버퍼에 저장된 오디오를 순차적으로 재생
            for (let i = 0; i < newAudioBuffers.length; i++) {
              // 재생 중지 요청이 있었는지 확인
              if (stopRequestedRef.current) {
                console.log('🚫 TTS 재생 중 중지 요청으로 인한 중단')
                break
              }
              
              const audio = newAudioBuffers[i]
              if (!audio) {
                console.log(`🎵 나머지 청크 ${i + 1} 오디오가 없어 건너뜀`)
                continue
              }
              
              console.log(`🎵 나머지 청크 ${i + 1}/${newAudioBuffers.length} 재생 시작`)
              
              // 현재 재생 중인 오디오 설정
              setCurrentAudio(audio)
              globalCurrentAudio = audio
              
              // 현재 청크 재생 완료를 기다리는 Promise
              const playChunk = new Promise<void>((resolve, reject) => {
                // 오디오 로딩 완료 후 재생
                audio.oncanplaythrough = () => {
                  // 재생 중지 요청이 있었는지 확인
                  if (stopRequestedRef.current) {
                    console.log(`🎵 나머지 청크 ${i + 1} 재생 중지됨`)
                    resolve()
                    return
                  }
                  console.log(`🎵 나머지 청크 ${i + 1} 오디오 로딩 완료, 재생 시작`)
                  audio.play().catch(reject)
                }
                
                // 오디오 재생 완료 시 resolve
                audio.onended = () => {
                  console.log(`🎵 나머지 청크 ${i + 1} 재생 완료`)
                  setCurrentAudio(null)
                  globalCurrentAudio = null
                  resolve()
                }
                
                // 오디오 재생 중 오류 발생 시 reject
                audio.onerror = () => {
                  console.error(`🎵 나머지 청크 ${i + 1} 재생 오류`)
                  setCurrentAudio(null)
                  globalCurrentAudio = null
                  reject(new Error(`나머지 청크 ${i + 1} 재생 오류`))
                }
                
                // 오디오 로딩 시작
                audio.onloadstart = () => {
                  console.log(`🎵 나머지 청크 ${i + 1} 오디오 로딩 시작...`)
                }
                
                // 오디오 로딩
                audio.load()
              })
              
              // 현재 청크 재생이 완료될 때까지 대기
              // 재생 중지 요청이 있으면 즉시 중단
              if (stopRequestedRef.current) {
                console.log('🎵 TTS 재생이 중지되어 다음 청크 건너뜀')
                break
              }
              
              currentPlayPromiseRef.current = playChunk
              await playChunk
              
              // 마지막 청크가 아니면 잠시 대기 (청크 간 간격)
              if (i < newAudioBuffers.length - 1) {
                console.log(`🎵 나머지 청크 ${i + 1} 완료, 다음 청크 대기 중...`)
                await new Promise(resolve => setTimeout(resolve, 100))
              }
            }
            
            console.log('🎵 모든 나머지 TTS 청크 재생 완료')
          }
        }
        
        console.log('전체 TTS 재생 완료')
        
      } catch (error) {
        console.error('TTS 재생 오류:', error)
      } finally {
        setIsPlaying(false)
        onPlayEnd?.()
        currentPlayPromiseRef.current = null
      }
    }
  }), [currentAudio, audioBuffers, onPlayEnd, isPlaying, text, onPlayStart])

  // TTS 재생 함수 (첫 번째 청크 제외하고 나머지만 재생)
  const playTTS = async (textToPlay: string) => {
    // 전역 TTS 무시 플래그 확인
    if (globalTTSIgnoreFlag) {
      console.log('🚫 전역 TTS 무시 플래그가 설정되어 있어 TTS 재생을 무시합니다.')
      return
    }
    
    if (isPlaying) {
      console.log('TTS가 이미 재생 중입니다.')
      return
    }

    try {
      // 재생 중지 플래그 초기화
      stopRequestedRef.current = false
      setIsPlaying(true)
      onPlayStart?.()
      
      console.log('=== 나머지 TTS 청크 재생 시작 ===')
      console.log('TTS에 전달된 텍스트:', textToPlay)
      console.log('=======================')
      
      // 텍스트를 적절한 길이로 분할
      const textChunks = splitTextForTTS(textToPlay)
      if (textChunks.length <= 1) {
        console.log('청크가 1개 이하이므로 재생 불필요')
        return
      }
      
      console.log(`나머지 TTS 재생 시작: ${textChunks.length - 1}개 청크 (첫 번째 제외)`)
      
      // 첫 번째 청크를 제외한 나머지 청크들만 생성
      const remainingChunks = textChunks.slice(1)
      const newAudioBuffers: HTMLAudioElement[] = []
      
      console.log('나머지 청크 TTS 생성 시작...')
      for (let i = 0; i < remainingChunks.length; i++) {
        // 재생 중지 요청이 있었는지 확인
        if (stopRequestedRef.current) {
          console.log('🚫 TTS 생성 중 중지 요청으로 인한 중단')
          break
        }
        
        const chunk = remainingChunks[i]
        console.log(`나머지 청크 ${i + 1}/${remainingChunks.length} TTS 생성 시작: ${chunk.substring(0, 50)}...`)
        
        try {
          // Supertone TTS API 호출
          const response = await axios.post('/api/tts', {
            text: chunk,
            speakingRate: speakingRate,
            voiceId: voiceId
          })

          if (response.data.audioUrl) {
            const audio = new Audio(response.data.audioUrl)
            // 오디오 엘리먼트를 DOM에 추가
            addAudioToDOM(audio)
            newAudioBuffers[i] = audio
            console.log(`나머지 청크 ${i + 1} TTS 생성 완료`)
          }
        } catch (error) {
          console.error(`나머지 청크 ${i + 1} TTS 생성 실패:`, error)
        }
      }
      
      // 전역 TTS 무시 플래그 확인
      if (globalTTSIgnoreFlag) {
        console.log('🚫 전역 TTS 무시 플래그가 설정되어 TTS 재생을 건너뜁니다.')
        return
      }
      
      // 재생 중지 요청이 있었는지 다시 확인
      if (stopRequestedRef.current) {
        console.log('🚫 TTS 생성 완료 후 재생 중지 요청으로 인한 재생 건너뜀')
        return
      }
      
      // 오디오 버퍼 상태 업데이트
      setAudioBuffers(newAudioBuffers)
      
      console.log('나머지 청크 TTS 생성 완료, 순차 재생 시작...')
      
      // 버퍼에 저장된 오디오를 순차적으로 재생
      for (let i = 0; i < newAudioBuffers.length; i++) {
        // 전역 TTS 무시 플래그 확인
        if (globalTTSIgnoreFlag) {
          console.log('🚫 전역 TTS 무시 플래그가 설정되어 TTS 재생을 중단합니다.')
          break
        }
        
        // 재생 중지 요청이 있었는지 확인
        if (stopRequestedRef.current) {
          console.log('🚫 TTS 재생 중 중지 요청으로 인한 중단')
          break
        }
        
        const audio = newAudioBuffers[i]
        if (!audio) {
          console.log(`나머지 청크 ${i + 1} 오디오가 없어 건너뜀`)
          continue
        }
        
        console.log(`나머지 청크 ${i + 1}/${newAudioBuffers.length} 재생 시작`)
        
        // 현재 재생 중인 오디오 설정
        setCurrentAudio(audio)
        
        // 현재 청크 재생 완료를 기다리는 Promise
        const playChunk = new Promise<void>((resolve, reject) => {
          // 오디오 로딩 완료 후 재생
          audio.oncanplaythrough = () => {
            // 재생 중지 요청이 있었는지 확인
            if (stopRequestedRef.current) {
              console.log(`나머지 청크 ${i + 1} 재생 중지됨`)
              resolve()
              return
            }
            console.log(`나머지 청크 ${i + 1} 오디오 로딩 완료, 재생 시작`)
            audio.play().catch(reject)
          }
          
          // 오디오 재생 완료 시 resolve
          audio.onended = () => {
            console.log(`나머지 청크 ${i + 1} 재생 완료`)
            setCurrentAudio(null)
            resolve()
          }
          
          // 오디오 재생 중 오류 발생 시 reject
          audio.onerror = () => {
            console.error(`나머지 청크 ${i + 1} 재생 오류`)
            setCurrentAudio(null)
            reject(new Error(`나머지 청크 ${i + 1} 재생 오류`))
          }
          
          // 오디오 로딩 시작
          audio.onloadstart = () => {
            console.log(`나머지 청크 ${i + 1} 오디오 로딩 시작...`)
          }
          
          // 오디오 로딩
          audio.load()
        })
        
        // 현재 청크 재생이 완료될 때까지 대기
        // 재생 중지 요청이 있으면 즉시 중단
        if (stopRequestedRef.current) {
          console.log('TTS 재생이 중지되어 다음 청크 건너뜀')
          break
        }
        
        currentPlayPromiseRef.current = playChunk
        await playChunk
        
        // 마지막 청크가 아니면 잠시 대기 (청크 간 간격)
        if (i < newAudioBuffers.length - 1) {
          console.log(`나머지 청크 ${i + 1} 완료, 다음 청크 대기 중...`)
          await new Promise(resolve => setTimeout(resolve, 100)) // 간격 단축
        }
      }
      
      console.log('모든 나머지 TTS 청크 재생 완료')
      
    } catch (error) {
      console.error('TTS 재생 오류:', error)
    } finally {
      setIsPlaying(false)
      onPlayEnd?.()
      currentPlayPromiseRef.current = null
    }
  }

  // 자동 재생이 설정된 경우 컴포넌트 마운트 시 실행
  React.useEffect(() => {
    if (autoPlay && text && !isPlaying) {
      playTTS(text)
    }
  }, [autoPlay, text])

  return (
    <div className={className}>
      <button
        data-tts-button
        onClick={() => playTTS(text)}
        disabled={isPlaying}
        className={`btn-primary ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isPlaying ? '🔊 재생 중...' : '🔊 TTS 재생'}
      </button>
    </div>
  )
})

TTSPlayer.displayName = 'TTSPlayer'

export default TTSPlayer
