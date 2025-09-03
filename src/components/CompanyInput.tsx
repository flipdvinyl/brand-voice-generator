'use client'

import { useState, useEffect, useRef } from 'react'

interface CompanyInputProps {
  onSubmit: (companyName: string) => void
}

export default function CompanyInput({ onSubmit }: CompanyInputProps) {
  const [companyName, setCompanyName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // 컴포넌트가 마운트될 때 자동으로 입력 필드에 포커스
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyName.trim()) return

    setIsLoading(true)
    
    // 음성 권한 요청 없이 바로 다음 단계로 진행
    setTimeout(() => {
      setIsLoading(false)
      onSubmit(companyName.trim())
    }, 500)
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <p className="text-gray-600 mb-4">
            브랜드 보이스가 필요한 회사 이름을 알려주세요
          </p>
          <input
            ref={inputRef}
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="예: 소니, 도요타, 유니클로..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!companyName.trim() || isLoading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              분석 중...
            </div>
          ) : (
            '다음 단계로'
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">💡 팁</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 정확한 회사명을 입력해주세요</li>
          <li>• 일본에 본사가 있는 회사여야 합니다</li>
          <li>• AI가 회사의 역사, 사업영역, 브랜드 이미지를 분석합니다</li>
        </ul>
      </div>
    </div>
  )
}
