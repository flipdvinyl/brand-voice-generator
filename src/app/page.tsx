'use client'

import { useState } from 'react'
import CompanyInput from '@/components/CompanyInput'
import CompanyInfo from '@/components/CompanyInfo'
import BrandVoiceRecommendation from '@/components/BrandVoiceRecommendation'
import CharacterRecommendation from '@/components/CharacterRecommendation'
import UseCaseSelection from '@/components/UseCaseSelection'

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
  const [currentStep, setCurrentStep] = useState(1)
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: '',
    info: [],
    brandVoice: [],
    hashtags: []
  })
  const [brandVoiceImage, setBrandVoiceImage] = useState<string | null>(null)
  
  // TTS 초기화 함수
  const resetAllTTS = () => {
    console.log('🔄 메인 페이지에서 TTS 완전 초기화 호출')
    // 모든 TTS 관련 상태를 초기화
    // 각 컴포넌트에서 TTSPlayer ref를 통해 resetAllTTS 호출
  }

  const handleCompanySubmit = (companyName: string) => {
    console.log('🔄 1단계 → 2단계 전환, TTS 초기화 필요')
    setCompanyData(prev => ({ ...prev, name: companyName }))
    setCurrentStep(2)
  }

  const handleCompanyInfoComplete = (info: string[]) => {
    console.log('🔄 2단계 → 3단계 전환, TTS 초기화 필요')
    setCompanyData(prev => ({ ...prev, info }))
    setCurrentStep(3)
  }

  const handleBrandVoiceComplete = (brandVoice: string[], hashtags: string[]) => {
    console.log('🔄 3단계 → 4단계 전환, TTS 초기화 필요')
    setCompanyData(prev => ({ ...prev, brandVoice, hashtags }))
    setCurrentStep(4)
  }

  const handleCharacterComplete = () => {
    console.log('🔄 4단계 → 5단계 전환, TTS 초기화 필요')
    setCurrentStep(5)
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
      {/* 브랜드 보이스 이미지 배경 오버레이 - container 바깥에 배치 */}
      {brandVoiceImage && (
        <div className="brand-voice-overlay">
          <img 
            src={brandVoiceImage} 
            alt="브랜드 보이스 캐릭터 배경" 
            className="brand-voice-background"
          />
          {/* 이미지 위에 1% 알파값의 흰색 박스 */}
          <div className="image-overlay-white"></div>
        </div>
      )}
      
      <div className={`container mx-auto px-4 py-8 ${currentStep === 3 ? 'brand-voice-step' : ''}`}>
        {/* Header */}
        <div className="text-center" style={{ margin: '4vh 0 2vh' }}>
          <h1 className="header-title font-bold mb-2" style={{ color: 'rgba(0, 0, 0, 0.8)' }}>
            사장님! 우리도 이제 목소리가 생겼어요!
          </h1>
          <p className="header-description" style={{ color: 'rgba(0, 0, 0, 0.8)' }}>
          수퍼톤이 브랜드에 어울리는 보이스를 제안해 드립니다
          </p>
        </div>

        {/* Progress Bar */}
                  <div className="mb-8">
            <div className="relative">
              {/* 연결선 배경 */}
              <div className="absolute top-7 left-0 right-0 h-2 bg-gray-300 rounded-full z-0" style={{ width: 'calc(100% - 10rem)', margin: '0 5rem' }}></div>
              
              {/* 활성화된 연결선 */}
              <div className="absolute top-7 left-0 h-2 bg-primary-600 rounded-full transition-all duration-300 z-0" 
                   style={{ 
                     width: currentStep === 1 ? '0%' : 
                            currentStep === 2 ? '25%' : 
                            currentStep === 3 ? '50%' : 
                            currentStep === 4 ? '75%' : '100%',
                     margin: '0 5rem'
                   }}></div>
              
              {/* 단계별 원형 숫자와 텍스트 */}
              <div className="grid grid-cols-5 gap-8 items-center justify-center relative z-20" style={{ width: 'fit-content', margin: '0 auto' }}>
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
        <div className="max-w-4xl mx-auto">
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
            />
          )}
          
          {currentStep === 4 && (
            <CharacterRecommendation
              companyName={companyData.name}
              brandVoice={companyData.brandVoice.join('\n')}
              onComplete={handleCharacterComplete}
            />
          )}
          
          {currentStep === 5 && (
            <UseCaseSelection
              companyName={companyData.name}
              onReset={resetToStart}
            />
          )}
        </div>

        {/* Reset Button */}
        {currentStep > 1 && (
          <div className="text-center mt-8">
            <button
              onClick={resetToStart}
              className="btn-secondary"
            >
              처음부터 다시 시작
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
