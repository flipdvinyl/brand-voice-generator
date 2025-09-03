'use client'

import { useState } from 'react'
import CompanyInput from '@/components/CompanyInput'
import CompanyInfo from '@/components/CompanyInfo'
import BrandVoiceRecommendation from '@/components/BrandVoiceRecommendation'
import CharacterRecommendation from '@/components/CharacterRecommendation'
import UseCaseSelection from '@/components/UseCaseSelection'

export type CompanyData = {
  name: string
  info: string
  brandVoice: string
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
    info: '',
    brandVoice: '',
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

  const handleCompanyInfoComplete = (info: string) => {
    console.log('🔄 2단계 → 3단계 전환, TTS 초기화 필요')
    setCompanyData(prev => ({ ...prev, info }))
    setCurrentStep(3)
  }

  const handleBrandVoiceComplete = (brandVoice: string, hashtags: string[]) => {
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
      info: '',
      brandVoice: '',
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
    } else if (step === 3 && companyData.info) {
      console.log('🔄 특정 단계 이동: 3단계, TTS 초기화 필요')
      setCurrentStep(3)
    } else if (step === 4 && companyData.brandVoice) {
      console.log('🔄 특정 단계 이동: 4단계, TTS 초기화 필요')
      setCurrentStep(4)
    } else if (step === 5 && companyData.brandVoice) {
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Brand Voice Generator
          </h1>
          <p className="text-lg text-gray-600">
            AI로 만드는 브랜드 보이스 캐릭터
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
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
                {step < 5 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 space-x-8 text-sm text-gray-600">
            <span>회사 입력</span>
            <span>회사 정보</span>
            <span>브랜드 보이스</span>
            <span>캐릭터 추천</span>
            <span>유즈케이스</span>
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
              companyInfo={companyData.info}
              onComplete={handleBrandVoiceComplete}
              onImageGenerated={setBrandVoiceImage}
            />
          )}
          
          {currentStep === 4 && (
            <CharacterRecommendation
              companyName={companyData.name}
              brandVoice={companyData.brandVoice}
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
