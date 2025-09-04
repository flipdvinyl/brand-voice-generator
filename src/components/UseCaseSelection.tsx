'use client'

import { useState } from 'react'

interface UseCaseSelectionProps {
  companyName: string
  onReset: () => void
}

export default function UseCaseSelection({ companyName, onReset }: UseCaseSelectionProps) {
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([])

  const useCases = [
    {
      id: 'brand-signal',
      title: '브랜드 시그널',
      description: '브랜드의 핵심 가치와 메시지를 전달하는 음성',
      icon: '🎯',
      color: 'bg-blue-100 border-blue-300 text-blue-800'
    },
    {
      id: 'tvcm',
      title: 'TVCM',
      description: '텔레비전 광고에 최적화된 음성',
      icon: '📺',
      color: 'bg-purple-100 border-purple-300 text-purple-800'
    },
    {
      id: 'radiocm',
      title: 'RadioCM',
      description: '라디오 광고에 특화된 음성',
      icon: '📻',
      color: 'bg-green-100 border-green-300 text-green-800'
    },
    {
      id: 'internal-broadcast',
      title: '사내 방송',
      description: '직원들에게 전달하는 내부 커뮤니케이션 음성',
      icon: '🏢',
      color: 'bg-orange-100 border-orange-300 text-orange-800'
    },
    {
      id: 'customer-service',
      title: '고객상담',
      description: '고객 응대와 상담 서비스에 활용되는 음성',
      icon: '🎧',
      color: 'bg-red-100 border-red-300 text-red-800'
    }
  ]

  const handleUseCaseToggle = (useCaseId: string) => {
    setSelectedUseCases(prev => 
      prev.includes(useCaseId)
        ? prev.filter(id => id !== useCaseId)
        : [...prev, useCaseId]
    )
  }

  const handleComplete = () => {
    // 여기서 선택된 유즈케이스들을 처리할 수 있습니다
    alert(`${companyName}의 브랜드 보이스 생성이 완료되었습니다!\n\n선택된 유즈케이스: ${selectedUseCases.length}개`)
  }

  return (
    <div className="card max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="header-title text-center mb-12" style={{ color: 'rgba(0, 0, 0, 0.8)' }}>
          브랜드 보이스 활용 유즈케이스 선택
        </h2>
        <p className="text-gray-600">
          {companyName}의 브랜드 보이스를 어떤 용도로 활용하고 싶으신가요?<br />
          여러 개를 선택할 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {useCases.map((useCase) => (
          <div
            key={useCase.id}
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
              selectedUseCases.includes(useCase.id)
                ? 'border-primary-500 bg-primary-50 shadow-lg'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
            onClick={() => handleUseCaseToggle(useCase.id)}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{useCase.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {useCase.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {useCase.description}
              </p>
              
              {selectedUseCases.includes(useCase.id) && (
                <div className="mt-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    ✅ 선택됨
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedUseCases.length > 0 && (
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            선택된 유즈케이스 ({selectedUseCases.length}개)
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {selectedUseCases.map((useCaseId) => {
              const useCase = useCases.find(uc => uc.id === useCaseId)
              return (
                <span
                  key={useCaseId}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                >
                  {useCase?.icon} {useCase?.title}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
