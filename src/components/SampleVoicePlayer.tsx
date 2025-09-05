'use client'

import { useState, useEffect } from 'react'

interface SampleVoicePlayerProps {
  sampleUrl: string
  characterName: string
}

// 전역 오디오 관리
let currentAudio: HTMLAudioElement | null = null
let currentPlayerId: string | null = null
let playerInstances: Set<() => void> = new Set()

export default function SampleVoicePlayer({ sampleUrl, characterName }: SampleVoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // 각 플레이어마다 고유 ID 생성
  const playerId = `${characterName}-${sampleUrl}`

  // 다른 플레이어가 재생될 때 현재 플레이어 상태 리셋
  const resetPlayer = () => {
    setIsPlaying(false)
    setIsLoading(false)
  }

  // 컴포넌트 마운트/언마운트 시 전역 상태 관리
  useEffect(() => {
    playerInstances.add(resetPlayer)
    
    return () => {
      playerInstances.delete(resetPlayer)
      if (currentPlayerId === playerId && currentAudio) {
        currentAudio.pause()
        currentAudio = null
        currentPlayerId = null
      }
    }
  }, [playerId])

  const handlePlay = async () => {
    if (isPlaying) return

    try {
      // 이전 오디오가 있다면 멈춤
      if (currentAudio && currentPlayerId !== playerId) {
        currentAudio.pause()
        currentAudio = null
        currentPlayerId = null
      }

      // 다른 모든 플레이어들의 상태 리셋
      playerInstances.forEach(resetFn => {
        if (resetFn !== resetPlayer) {
          resetFn()
        }
      })

      setIsLoading(true)
      setIsPlaying(true)

      const audio = new Audio(sampleUrl)
      
      // 전역 상태 업데이트
      currentAudio = audio
      currentPlayerId = playerId

      audio.onended = () => {
        setIsPlaying(false)
        setIsLoading(false)
        if (currentPlayerId === playerId) {
          currentAudio = null
          currentPlayerId = null
        }
      }
      
      audio.onerror = () => {
        setIsPlaying(false)
        setIsLoading(false)
        if (currentPlayerId === playerId) {
          currentAudio = null
          currentPlayerId = null
        }
        console.error('Failed to play sample voice')
      }

      await audio.play()
    } catch (error) {
      console.error('Error playing sample voice:', error)
      setIsPlaying(false)
      setIsLoading(false)
      if (currentPlayerId === playerId) {
        currentAudio = null
        currentPlayerId = null
      }
    }
  }

  return (
    <button
      onClick={handlePlay}
      disabled={isLoading || isPlaying}
      className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-700"></div>
          <span className="text-xs">로딩중...</span>
        </>
      ) : isPlaying ? (
        <>
          <div className="w-4 h-4 bg-green-700 rounded-full animate-pulse"></div>
          <span className="text-xs">재생중...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          <span className="text-xs">샘플 듣기</span>
        </>
      )}
    </button>
  )
}
