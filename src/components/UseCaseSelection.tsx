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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
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

      <div className="text-center space-y-4">
        {selectedUseCases.length > 0 && (
          <div className="mb-6">
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

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleComplete}
            disabled={selectedUseCases.length === 0}
            className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            브랜드 보이스 생성 완료
          </button>
          
          <button
            onClick={onReset}
            className="btn-secondary px-6 py-3 text-lg"
          >
            처음부터 다시 시작
          </button>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-3 text-center">
          🎉 브랜드 보이스 생성 완료!
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h4 className="font-medium mb-2">✅ 완료된 작업</h4>
            <ul className="space-y-1">
              <li>• 회사 정보 분석 및 요약</li>
              <li>• 브랜드 보이스 캐릭터 추천</li>
              <li>• 수퍼톤 캐릭터 매칭</li>
              <li>• 유즈케이스 선택</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">🚀 다음 단계</h4>
            <ul className="space-y-1">
              <li>• 선택된 유즈케이스별 음성 생성</li>
              <li>• 실제 프로젝트에 적용</li>
              <li>• 지속적인 브랜드 보이스 관리</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
