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
    // 여러 방법으로 포커스 시도
    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus()
        // 포커스가 제대로 되었는지 확인
        if (document.activeElement !== inputRef.current) {
          // 포커스가 안 되었다면 다시 시도
          setTimeout(() => {
            inputRef.current?.focus()
          }, 50)
        }
      }
    }

    // 즉시 포커스 시도
    focusInput()
    
    // DOM이 완전히 렌더링된 후 다시 한번 포커스 시도
    setTimeout(focusInput, 100)
    
    // 추가로 한번 더 시도 (브라우저별 차이 대응)
    setTimeout(focusInput, 300)
  }, [])

  // 페이지 클릭 시 항상 입력 필드에 포커스
  useEffect(() => {
    const handlePageClick = () => {
      if (inputRef.current) {
        // 약간의 지연을 두어 다른 클릭 이벤트가 처리된 후 포커스
        setTimeout(() => {
          inputRef.current?.focus()
        }, 100)
      }
    }

    const handleWindowFocus = () => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        setTimeout(() => {
          inputRef.current?.focus()
        }, 50)
      }
    }

    // 페이지 전체에 클릭 이벤트 리스너 추가
    document.addEventListener('click', handlePageClick)
    
    // 윈도우 포커스 시에도 입력 필드에 포커스
    window.addEventListener('focus', handleWindowFocus)
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener('click', handlePageClick)
      window.removeEventListener('focus', handleWindowFocus)
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
    <div className="card max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6 text-center">
        <div>
          <p className="text-gray-700 mb-4 text-center company-input-text" style={{ paddingBottom: '5rem' }} dangerouslySetInnerHTML={{
            __html: "우리 회사의<br>브랜드 보이스가<br>궁금하다면?<span style=\"display:block; height:0.5em;\"></span>회사 이름을<br>알려주세요-"
          }}>
          </p>
          <input
            ref={inputRef}
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="키링을 태그해 주세요"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:outline-none text-center company-input-field"
            required
            autoFocus
            onBlur={(e) => {
              // blur 이벤트 발생 시 즉시 다시 포커스
              setTimeout(() => {
                e.target.focus()
              }, 0)
            }}
            onFocus={(e) => {
              // 포커스 시 커서를 텍스트 끝으로 이동
              e.target.setSelectionRange(e.target.value.length, e.target.value.length)
            }}
          />
        </div>


      </form>


    </div>
  )
}
