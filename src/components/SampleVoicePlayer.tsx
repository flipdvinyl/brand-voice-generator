'use client'

import { useState } from 'react'

interface SampleVoicePlayerProps {
  sampleUrl: string
  characterName: string
}

export default function SampleVoicePlayer({ sampleUrl, characterName }: SampleVoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handlePlay = async () => {
    if (isPlaying) return

    try {
      setIsLoading(true)
      setIsPlaying(true)

      const audio = new Audio(sampleUrl)
      audio.onended = () => {
        setIsPlaying(false)
        setIsLoading(false)
      }
      audio.onerror = () => {
        setIsPlaying(false)
        setIsLoading(false)
        console.error('Failed to play sample voice')
      }

      await audio.play()
    } catch (error) {
      console.error('Error playing sample voice:', error)
      setIsPlaying(false)
      setIsLoading(false)
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
