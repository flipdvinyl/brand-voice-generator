import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GOOGLE_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { prompt, windowRatio } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'TV CM 프롬프트가 필요합니다.' },
        { status: 400 }
      );
    }

    // 창 비율 정보 로깅
    console.log('📐 창 비율 정보:', windowRatio);

    // API 키 검증
    if (!API_KEY) {
      return NextResponse.json({ error: 'Google API key is not configured' }, { status: 500 })
    }

    // Gemini 2.5 Flash Image 모델 초기화
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // 사용 가능한 모델들 시도
    const models = [
      'gemini-2.5-flash-image-preview',
      'gemini-2.5-flash-image',
      'gemini-2.0-flash-exp',
      'gemini-2.0-flash'
    ];
    
    let model;
    let lastError;
    
    for (const modelName of models) {
      try {
        model = genAI.getGenerativeModel({ model: modelName });
        console.log(`✅ 모델 ${modelName} 사용 시도 중...`);
        break;
      } catch (error) {
        console.log(`❌ 모델 ${modelName} 사용 불가:`, error);
        lastError = error;
        continue;
      }
    }
    
    if (!model) {
      throw new Error(`사용 가능한 Gemini 모델을 찾을 수 없습니다. 마지막 오류: ${lastError}`);
    }

    // TV CM용 16:9 비율 고정
    const aspectRatio = '16:9'; // TV CM용 16:9 비율
    const imageWidth = 1920; // 16:9 비율에 맞는 너비
    const imageHeight = 1080; // 16:9 비율에 맞는 높이
    
    console.log('📐 TV CM 이미지 비율 고정:', { aspectRatio, imageWidth, imageHeight });
    
    console.log('🎨 TV CM 이미지 생성 설정:', { aspectRatio, imageWidth, imageHeight });
    
    // TV CM 이미지 생성을 위한 프롬프트 구성
    const fullPrompt = `Create a high-quality TV commercial image based on the following description.
    
    Description: ${prompt}
    
    Requirements:
    - 16:9 aspect ratio (${imageWidth}x${imageHeight} pixels)
    - High-quality, detailed image
    - Professional commercial style
    - Image dimensions: ${imageWidth}x${imageHeight} pixels
    - Image aspect ratio: ${aspectRatio} (${imageWidth}:${imageHeight})
    - Current window ratio: ${windowRatio?.width || 'unknown'}x${windowRatio?.height || 'unknown'}
    - Ensure the image maintains the exact ${aspectRatio} aspect ratio
    - Generate image with precise ${imageWidth}x${imageHeight} dimensions`;

    console.log('🎨 TV CM Gemini 이미지 생성 요청 시작');
    console.log('📝 TV CM 프롬프트:', fullPrompt.substring(0, 200) + '...');

    // 이미지 생성 요청
    console.log('⚙️ TV CM 이미지 생성 설정:', { width: imageWidth, height: imageHeight });
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;

    console.log('📊 TV CM Gemini 응답 구조:', JSON.stringify(response, null, 2));

    // 응답에서 이미지 데이터 추출 (여러 방법 시도)
    let imageData = null;
    
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            imageData = part.inlineData;
            break;
          }
        }
      }
    }

    if (!imageData) {
      console.error('❌ TV CM 이미지 데이터를 찾을 수 없습니다');
      console.error('🔍 전체 응답:', JSON.stringify(response, null, 2));
      
      // 텍스트 응답이 있는지 확인
      const textResponse = response.text();
      if (textResponse) {
        console.log('📝 텍스트 응답:', textResponse);
      }
      
      return NextResponse.json(
        { error: 'TV CM 이미지 생성에 실패했습니다. 응답에 이미지 데이터가 없습니다.' },
        { status: 500 }
      );
    }

    console.log('✅ TV CM Gemini 이미지 생성 성공:', {
      mimeType: imageData.mimeType,
      dataSize: imageData.data.length
    });

    // 이미지 데이터 반환
    return NextResponse.json({
      success: true,
      imageData: imageData.data,
      mimeType: imageData.mimeType
    });

  } catch (error) {
    console.error('❌ TV CM Gemini 이미지 생성 오류:', error);
    
    // 더 자세한 오류 정보 제공
    let errorMessage = 'TV CM 이미지 생성 중 오류가 발생했습니다.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error },
      { status: 500 }
    );
  }
}

