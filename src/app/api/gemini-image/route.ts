import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GOOGLE_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { brandVoiceText, windowRatio } = await request.json();

    if (!brandVoiceText) {
      return NextResponse.json(
        { error: '브랜드 보이스 텍스트가 필요합니다.' },
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

    // 이미지 비율을 9:16으로 고정
    const aspectRatio = '9:16'; // 항상 9:16 비율
    const imageWidth = 576; // 9:16 비율에 맞는 너비
    const imageHeight = 1024; // 9:16 비율에 맞는 높이
    
    console.log('📐 이미지 비율 고정:', { aspectRatio, imageWidth, imageHeight });
    
    console.log('🎨 이미지 생성 설정:', { aspectRatio, imageWidth, imageHeight });
    
    // 이미지 생성을 위한 프롬프트 구성
    const prompt = `Create a high-quality, professional portrait image of a person that represents the following brand voice description. 
    The person should embody the characteristics and personality described in the brand voice.
    
    Brand Voice Description: ${brandVoiceText}
    
    Requirements:
    - Portrait from head to knees (cut off at knee level)
    - Professional standing pose that reflects the brand's personality
    - Facial expression and upper body posture that matches the brand character
    - High-quality, detailed image with realistic style
    - 회사의 주요 사업과 연계된 코스프레 연출
    - 회사의 주요 제품 한손에 들기
    - Natural and engaging expression
    - The person should look like they could represent this brand authentically
    - Japanese
    - Nikon film camera natural style
    - Heavy film grain
    - Image dimensions: ${imageWidth}x${imageHeight} pixels
    - Image aspect ratio: ${aspectRatio} (${imageWidth}:${imageHeight})
    - Current window ratio: ${windowRatio?.width || 'unknown'}x${windowRatio?.height || 'unknown'}
    - Responsive design that adapts to current screen dimensions
    - Full viewport coverage without cropping
    - Ensure the image maintains the exact ${aspectRatio} aspect ratio
    - Portrait must be cut off at knee level (head to knees visible)
    - Generate image with precise ${imageWidth}x${imageHeight} dimensions`;

    console.log('🎨 Gemini 이미지 생성 요청 시작');
    console.log('📝 프롬프트:', prompt.substring(0, 200) + '...');

    // 이미지 생성 요청
    console.log('⚙️ 이미지 생성 설정:', { width: imageWidth, height: imageHeight });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;

    console.log('📊 Gemini 응답 구조:', JSON.stringify(response, null, 2));

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
      console.error('❌ 이미지 데이터를 찾을 수 없습니다');
      console.error('🔍 전체 응답:', JSON.stringify(response, null, 2));
      
      // 텍스트 응답이 있는지 확인
      const textResponse = response.text();
      if (textResponse) {
        console.log('📝 텍스트 응답:', textResponse);
      }
      
      return NextResponse.json(
        { error: '이미지 생성에 실패했습니다. 응답에 이미지 데이터가 없습니다.' },
        { status: 500 }
      );
    }

    console.log('✅ Gemini 이미지 생성 성공:', {
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
    console.error('❌ Gemini 이미지 생성 오류:', error);
    
    // 더 자세한 오류 정보 제공
    let errorMessage = '이미지 생성 중 오류가 발생했습니다.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error },
      { status: 500 }
    );
  }
}
