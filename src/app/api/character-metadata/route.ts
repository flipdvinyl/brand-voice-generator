import { NextResponse } from 'next/server'
import { perplexityCharacterVoiceDB } from '@/utils/perplexityCharacterDB'

export async function GET() {
  try {
    // CORS 헤더 추가하여 외부에서 접근 가능하도록 설정
    const response = NextResponse.json(perplexityCharacterVoiceDB)
    
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Cache-Control', 'public, max-age=3600') // 1시간 캐시
    
    return response
  } catch (error) {
    console.error('Character metadata API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch character metadata' },
      { status: 500 }
    )
  }
}

// OPTIONS 요청 처리 (CORS preflight)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
