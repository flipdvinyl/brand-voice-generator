'use client'

import { useState, useEffect } from 'react'
import CompanyInput from '@/components/CompanyInput'
import CompanyInfo from '@/components/CompanyInfo'
import BrandVoiceRecommendation from '@/components/BrandVoiceRecommendation'
import CharacterRecommendation from '@/components/CharacterRecommendation'
import UseCaseSelection from '@/components/UseCaseSelection'
import { resetAllTTSGlobal } from '@/components/TTSPlayer'

export type CompanyData = {
  name: string
  info: string[]
  brandVoice: string[]
  hashtags: string[]
}

export type Character = {
  id: string
  name: string
  thumbnail: string
  description: string
  gender: '남' | '녀'
  age: 'Child' | 'Young-Adult' | 'Middle-Aged' | 'Elder'
  usecase: string[]
}

export default function Home() {
  // 이미지 생성 기능 제어 상태
  const [imageGenerationEnabled, setImageGenerationEnabled] = useState(true) // true: 이미지 생성 기능 켜기, false: 이미지 생성 기능 끄기
  const [isImageFadingOut, setIsImageFadingOut] = useState(false) // 이미지 페이드 아웃 상태
  
  // 하단 플로팅 영역 높이
  const FLOATING_BOTTOM_HEIGHT = 200 // px
  
  const [currentStep, setCurrentStep] = useState(1)
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: '',
    info: [],
    brandVoice: [],
    hashtags: []
  })
  const [brandVoiceImage, setBrandVoiceImage] = useState<string | null>(null)
  const [selectedCharacter, setSelectedCharacter] = useState<string>('')
  const [currentSelectedCharacter, setCurrentSelectedCharacter] = useState<string>('')
  


  // 섹션이 변경될 때마다 TTS 자동 초기화
  useEffect(() => {
    console.log(`🔄 섹션 변경 감지: ${currentStep}단계`)
    
    // 4,5 섹션 간 이동 시 모든 오디오 정지
    if (currentStep === 4 || currentStep === 5) {
      // 모든 HTML audio 요소 즉시 중지
      const audioElements = document.querySelectorAll('audio')
      audioElements.forEach(audio => {
        audio.pause()
        audio.currentTime = 0
      })
      
      // 모든 MediaSource 정리
      if (window.MediaSource) {
        // MediaSource 정리 로직
      }
    }
    
    // 약간의 지연을 두어 컴포넌트가 마운트된 후 TTS 초기화
    const timer = setTimeout(() => {
      resetAllTTSGlobal()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [currentStep])

  // Enter 키 이벤트 처리
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        // 현재 단계에 따라 다음 단계로 이동
        switch (currentStep) {
          case 1:
            // 1단계: 회사명 입력 - Enter 키는 이미 CompanyInput에서 처리됨
            break
          case 2:
            // 2단계: 회사 정보 - 다음 단계로 이동
            if (companyData.info && companyData.info.length > 0) {
              setCurrentStep(3)
            }
            break
          case 3:
            // 3단계: 브랜드 보이스 - 다음 단계로 이동
            if (companyData.brandVoice && companyData.brandVoice.length > 0) {
              setCurrentStep(4)
            }
            break
          case 4:
            // 4단계: 캐릭터 추천 - 다음 단계로 이동
            setCurrentStep(5)
            break
          case 5:
            // 5단계: 유즈케이스 선택 - 완료 처리
            // 여기서는 특별한 처리가 필요하지 않음
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [currentStep, companyData])

  const handleCompanySubmit = (companyName: string) => {
    console.log('🔄 1단계 → 2단계 전환, TTS 초기화 필요')
    setCompanyData(prev => ({ ...prev, name: companyName }))
    setCurrentStep(2)
  }

  const handleCompanyInfoComplete = (info: string[]) => {
    console.log('🔄 2단계 완료, 데이터 저장만 함 (자동 전환 안함)')
    setCompanyData(prev => ({ ...prev, info }))
    // 자동으로 다음 단계로 넘어가지 않음 - 사용자가 Enter 키나 버튼을 눌러야 함
  }

  const handleBrandVoiceComplete = (brandVoice: string[], hashtags: string[]) => {
    console.log('🔄 3단계 완료, 데이터 저장만 함 (자동 전환 안함)')
    setCompanyData(prev => ({ ...prev, brandVoice, hashtags }))
    // 자동으로 다음 단계로 넘어가지 않음 - 사용자가 Enter 키나 버튼을 눌러야 함
  }

  const handleCharacterComplete = (characterName?: string) => {
    console.log('🔄 4단계 → 5단계 전환, TTS 초기화 필요')
    const characterToUse = characterName || currentSelectedCharacter
    if (characterToUse) {
      setSelectedCharacter(characterToUse)
    }
    setCurrentStep(5)
  }

  const handleCharacterSelect = (characterName: string) => {
    setCurrentSelectedCharacter(characterName)
  }

  const resetToStart = () => {
    setCurrentStep(1)
    setCompanyData({
      name: '',
      info: [],
      brandVoice: [],
      hashtags: []
    })
    setBrandVoiceImage(null) // 이미지도 초기화
    setSelectedCharacter('')
    setCurrentSelectedCharacter('')
  }

  // 특정 단계로 이동하는 함수
  const goToStep = (step: number) => {
    if (step === 1) {
      resetToStart()
    } else if (step === 2 && companyData.name) {
      console.log('🔄 특정 단계 이동: 2단계, TTS 초기화 필요')
      setCurrentStep(2)
    } else if (step === 3 && companyData.info.length > 0) {
      console.log('🔄 특정 단계 이동: 3단계, TTS 초기화 필요')
      setCurrentStep(3)
    } else if (step === 4 && companyData.brandVoice.length > 0) {
      console.log('🔄 특정 단계 이동: 4단계, TTS 초기화 필요')
      setCurrentStep(4)
    } else if (step === 5 && companyData.brandVoice.length > 0) {
      console.log('🔄 특정 단계 이동: 5단계, TTS 초기화 필요')
      setCurrentStep(5)
    }
  }

  // 각 단계가 이동 가능한지 확인하는 함수
  const canGoToStep = (step: number): boolean => {
    if (step === 1) return true
    if (step === 2) return !!companyData.name
    if (step === 3) return !!companyData.info
    if (step === 4) return !!companyData.brandVoice
    if (step === 5) return !!companyData.brandVoice
    return false
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 배경 프로필 이미지 (3단계에서만 표시, 알파 20%) */}
      {currentStep === 3 && (
        <div 
          className="fixed inset-0 flex items-center justify-center pointer-events-none"
          style={{ 
            zIndex: 1,
            opacity: 0.2
          }}
        >
          <img 
            src="/profile_default.png" 
            alt="배경 프로필" 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 브랜드 보이스 이미지 배경 오버레이 - container 바깥에 배치 */}
      {brandVoiceImage && (
        <div className={`brand-voice-overlay ${isImageFadingOut ? 'fade-out' : ''}`}>
          <img 
            src={brandVoiceImage} 
            alt="브랜드 보이스 캐릭터 배경" 
            className="brand-voice-background"
          />
          {/* 이미지 위에 1% 알파값의 흰색 박스 */}
          <div className="image-overlay-white"></div>
        </div>
      )}
      
      {/* 이미지 생성 토글 버튼 - 절대 위치 */}
      <button
        onClick={() => {
          if (imageGenerationEnabled && brandVoiceImage) {
            // 이미지 생성 OFF 시 페이드 아웃 시작
            setIsImageFadingOut(true)
            setTimeout(() => {
              setImageGenerationEnabled(false)
              setBrandVoiceImage(null)
              setIsImageFadingOut(false)
            }, 3000) // 3초 후 이미지 제거
          } else {
            // 이미지 생성 ON 시 즉시 토글
            setImageGenerationEnabled(true)
          }
        }}
        className="fixed text-3xl font-bold transition-all duration-200 hover:scale-110 z-50"
        style={{ 
          color: imageGenerationEnabled ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.1)',
          top: '10px',
          right: '10px'
        }}
        title={imageGenerationEnabled ? '이미지 생성 ON' : '이미지 생성 OFF'}
      >
        ☺
      </button>
      
      <div className={`container mx-auto px-4 py-8 ${currentStep === 3 ? 'brand-voice-step' : ''}`}>
        {/* Header */}
        <div className="text-center" style={{ margin: '4vh 0 2vh' }}>
          <h1 className="header-title mb-2" style={{ color: 'rgba(0, 0, 0, 0.8)' }}>
            사장님! 우리도 이제 목소리가 생겼어요!
          </h1>
          <p className="header-description" style={{ color: 'rgba(0, 0, 0, 0.8)' }}>
          수퍼톤이 브랜드에 어울리는 보이스를 제안해 드립니다
          </p>
        </div>

        {/* Progress Bar */}
                  <div className="mb-8">
            <div className="relative">
              {/* 연결선 배경 - 1번과 5번 원형 버튼 중심점 사이 */}
              <div className="absolute top-7 h-2 bg-gray-300 rounded-full z-0" 
                   style={{ 
                     left: 'calc(50% - 12rem - 12rem)', // 1번 버튼 중심에서 시작 (25% 왼쪽 이동)
                     width: '48rem' // 1번과 5번 버튼 중심점 사이 거리
                   }}></div>
              
              {/* 활성화된 연결선 - 각 단계별로 정확한 위치 계산 */}
              <div className="absolute top-7 h-2 bg-primary-600 rounded-full transition-all duration-300 z-0" 
                   style={{ 
                     left: 'calc(50% - 12rem - 12rem)', // 1번 버튼 중심에서 시작 (25% 왼쪽 이동)
                     width: currentStep === 1 ? '0rem' : 
                            currentStep === 2 ? '12rem' : 
                            currentStep === 3 ? '24rem' : 
                            currentStep === 4 ? '36rem' : '48rem'
                   }}></div>
              
              {/* 단계별 원형 숫자와 텍스트 */}
              <div className="grid grid-cols-5 gap-6 items-center justify-center relative z-20" style={{ width: 'fit-content', margin: '0 auto' }}>
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-medium transition-all duration-200 relative z-30 ${
                        step <= currentStep
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                      } ${
                        canGoToStep(step) 
                          ? 'cursor-pointer hover:scale-110 hover:shadow-lg' 
                          : 'cursor-not-allowed opacity-50'
                      } ${
                        step <= currentStep && canGoToStep(step) 
                          ? 'hover:bg-primary-700' 
                          : step > currentStep && canGoToStep(step)
                          ? 'hover:bg-gray-400'
                          : ''
                      }`}
                      onClick={() => canGoToStep(step) && goToStep(step)}
                      title={
                        canGoToStep(step) 
                          ? `${step}단계로 이동` 
                          : '이전 단계를 먼저 완료해주세요'
                      }
                    >
                      {step}
                    </div>
                    <div className="mt-2 text-center step-label">
                      {step === 1 && '회사명 입력'}
                      {step === 2 && '브랜드 조사'}
                      {step === 3 && '브랜드 보이스 제안'}
                      {step === 4 && '수퍼톤 보이스 추천'}
                      {step === 5 && '활용 사례'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto" style={{ 
          height: `calc(100vh - ${FLOATING_BOTTOM_HEIGHT}px)`, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          paddingBottom: `${FLOATING_BOTTOM_HEIGHT * 2}px`
        }}>
          {currentStep === 1 && (
            <CompanyInput onSubmit={handleCompanySubmit} />
          )}
          
          {currentStep === 2 && (
            <CompanyInfo
              companyName={companyData.name}
              onComplete={handleCompanyInfoComplete}
            />
          )}
          
                      {currentStep === 3 && (
              <BrandVoiceRecommendation
                companyName={companyData.name}
                companyInfo={companyData.info.join('\n')}
                onComplete={handleBrandVoiceComplete}
                onImageGenerated={setBrandVoiceImage}
                imageGenerationEnabled={imageGenerationEnabled}
              />
            )}
          
          {currentStep === 4 && (
            <CharacterRecommendation
              companyName={companyData.name}
              brandVoice={companyData.brandVoice.join('\n')}
              companyInfo={companyData.info.join('\n')}
              hashtags={companyData.hashtags}
              onComplete={handleCharacterComplete}
              onCharacterSelect={handleCharacterSelect}
            />
          )}
          
          {currentStep === 5 && (
            <UseCaseSelection
              companyName={companyData.name}
              companyInfo={companyData.info.join(' ')}
              brandVoice={companyData.brandVoice.join(' ')}
              hashtags={companyData.hashtags}
              selectedCharacterName={selectedCharacter}
              onReset={resetToStart}
            />
          )}
        </div>

        {/* 하단 플로팅 버튼 영역 */}
        <div className="fixed bottom-0 left-0 right-0 z-[9999]" style={{ 
          height: `${FLOATING_BOTTOM_HEIGHT}px`, 
          backgroundColor: 'rgb(220, 220, 220)', 
          boxShadow: '0 0 200px rgba(0, 0, 0, 0.1)' 
        }}>
          <div className="max-w-4xl mx-auto px-4 h-full flex items-center justify-center relative">
            {/* 홈버튼 - 좌측에 고정 */}
            <button
              onClick={resetToStart}
              className="absolute w-14 h-14 rounded-full border bg-transparent flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
              style={{ 
                left: 'calc(50% - 50vw + 60px)',
                borderWidth: '1px',
                borderColor: 'rgba(0, 0, 0, 0.5)'
              }}
              title="처음으로 돌아가기"
            >
              <span className="text-2xl emoji-mono" style={{ fontSize: '1.8em', transform: 'translateY(-3px)' }}>⌂</span>
            </button>
            {currentStep === 1 && (
              <div className="text-center">
                <button
                  onClick={() => {
                    const input = document.querySelector('input[type="text"]') as HTMLInputElement
                    if (input && input.value.trim()) {
                      handleCompanySubmit(input.value.trim())
                    }
                  }}
                  className="btn-primary text-gray-700"
                  style={{ '--tw-bg-opacity': 0 } as React.CSSProperties}
                >
                  다음 단계로 →
                </button>
                <div className="mt-2 text-gray-600 step-label">
                  이제 브랜드를 조사해 볼게요
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="text-center">
                <button
                  onClick={() => {
                    // 다음 단계로 직접 이동
                    setCurrentStep(3)
                  }}
                  className="btn-primary"
                  style={{ 
                    '--tw-bg-opacity': 0,
                    fontSize: '3.5vw',
                    color: 'rgba(0, 0, 0, 0.8) !important',
                    fontWeight: 'inherit'
                  } as React.CSSProperties}
                >
                  다음 단계로 →
                </button>
                <div className="mt-2 text-gray-600 step-label">
                  이제 브랜드 보이스를 제안해 드립니다
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="text-center">
                <button
                  onClick={() => {
                    // 다음 단계로 직접 이동
                    setCurrentStep(4)
                  }}
                  className="btn-primary"
                  style={{ 
                    '--tw-bg-opacity': 0,
                    fontSize: '3.5vw',
                    color: 'rgba(0, 0, 0, 0.8) !important',
                    fontWeight: 'inherit'
                  } as React.CSSProperties}
                >
                  다음 단계로 →
                </button>
                <div className="mt-2 text-gray-600 step-label">
                  이제 브랜드 보이스에 어울리는 수퍼톤의 캐릭터 보이스를 추천해 드립니다
                </div>
              </div>
            )}
            
            {currentStep === 4 && (
              <div className="text-center">
                <button
                  onClick={() => handleCharacterComplete()}
                  className="btn-primary"
                  style={{ 
                    '--tw-bg-opacity': 0,
                    fontSize: '3.5vw',
                    color: 'rgba(0, 0, 0, 0.8) !important',
                    fontWeight: 'inherit'
                  } as React.CSSProperties}
                >
                  다음 단계로 →
                </button>
                <div className="mt-2 text-gray-600 step-label">
                  이제 다양한 보이스 활용 사례를 제안해 드려요
                </div>
              </div>
            )}
            
            {/* 4단계 재생성 버튼 - 우측에 고정 */}
            {currentStep === 4 && (
              <button
                onClick={() => goToStep(4)}
                className="absolute w-14 h-14 rounded-full border bg-transparent flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
                style={{ 
                  right: 'calc(50% - 50vw + 60px)',
                  borderWidth: '1px',
                  borderColor: 'rgba(0, 0, 0, 0.5)'
                }}
                title="캐릭터 추천 다시 생성"
              >
                <span className="text-2xl emoji-mono" style={{ fontSize: '1.8em', transform: 'translateY(-3px)' }}>↺</span>
              </button>
            )}
            
            {currentStep === 5 && (
              <div className="text-center">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="btn-secondary text-gray-700"
                  style={{ '--tw-bg-opacity': 0 } as React.CSSProperties}
                >
                  ← 다른 목소리로 들어보기
                </button>
                <div className="mt-2 text-gray-600 step-label">
                  다른 캐릭터의 목소리도 들어보세요
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
