import { NextRequest, NextResponse } from 'next/server'

// Supertone API 키 설정
const SUPERTONE_API_KEY = process.env.SUPERTONE_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { text, voice, speakingRate = 1.4 } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: '텍스트가 필요합니다.' },
        { status: 400 }
      )
    }

    // API 키 검증
    if (!SUPERTONE_API_KEY) {
      return NextResponse.json({ error: 'Supertone API key is not configured' }, { status: 500 })
    }

    // 기본 설정값
    const voiceId = 'weKbNjMh2V5MuXziwHwjoT' // 기본 voice ID
    const language = 'ko' // 한국어 (kr -> ko로 수정)
    const style = 'neutral' // 중립적인 톤
    const model = 'sona_speech_1' // 기본 모델
    const voiceSettings = {
      'pitch_shift': 0,
      'pitch_variance': 1,
      'speed': speakingRate  // 🚨 speakingRate 적용!
    }

    console.log('TTS API 호출:', { text: text.substring(0, 50) + '...', voiceId, language, style, speakingRate })

    // Supertone API 호출
    const response = await fetch(
      `https://supertoneapi.com/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'x-sup-api-key': SUPERTONE_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          language,
          style,
          model,
          voice_settings: voiceSettings
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Supertone API error:', response.status, errorText)
      throw new Error(`Supertone API error: ${response.status} - ${errorText}`)
    }

    // 오디오 데이터를 base64로 인코딩하여 반환
    const audioBuffer = await response.arrayBuffer()
    const base64Audio = Buffer.from(audioBuffer).toString('base64')
    const audioUrl = `data:audio/wav;base64,${base64Audio}`

    console.log('TTS 변환 성공:', audioBuffer.byteLength, 'bytes')

    return NextResponse.json({ 
      audioUrl,
      message: 'TTS 변환이 완료되었습니다.'
    })

  } catch (error) {
    console.error('TTS API error:', error)
    
    // 에러 발생 시 더미 오디오 반환
    return NextResponse.json({ 
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      message: 'TTS 변환 실패: 더미 오디오를 반환합니다.',
      error: error instanceof Error ? error.message : String(error)
    })
  }
}
