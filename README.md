# Brand Voice Generator

AI 기반 브랜드 보이스 생성기로, Perplexity API와 Supertone TTS를 활용하여 회사에 최적화된 브랜드 보이스 캐릭터를 추천합니다.

## 🚀 주요 기능

### 1. 회사 정보 분석
- Perplexity AI를 통한 회사 정보 검색 및 요약
- 회사의 역사, 사업영역, 브랜드 이미지 분석
- 일본 기업 특화 정보 제공

### 2. 브랜드 보이스 추천
- AI가 분석한 회사 정보를 바탕으로 브랜드 보이스 캐릭터 추천
- 페르소나 기반의 상세한 캐릭터 묘사
- 특징 해시태그 자동 생성

### 3. 수퍼톤 캐릭터 매칭
- 수퍼톤 Play가 보유한 캐릭터 중 최적의 매칭 추천
- 성별, 나이, 유즈케이스별 필터링
- 시각적 썸네일과 상세 설명 제공

### 4. 유즈케이스 선택
- 브랜드 시그널, TVCM, RadioCM 등 다양한 활용 방안 제시
- 다중 선택 지원
- 프로젝트별 맞춤형 솔루션

### 5. 음성 출력
- Supertone TTS를 통한 자연스러운 한국어 음성 생성
- 모든 단계에서 음성 설명 제공
- 재생/일시정지 기능

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **AI API**: Perplexity AI
- **TTS**: Supertone TTS API
- **Build Tool**: Next.js App Router

## 📋 프로젝트 구조

```
brand-voice-generator/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── perplexity/
│   │   │   │   └── route.ts
│   │   │   └── tts/
│   │   │       └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── components/
│       ├── CompanyInput.tsx
│       ├── CompanyInfo.tsx
│       ├── BrandVoiceRecommendation.tsx
│       ├── CharacterRecommendation.tsx
│       └── UseCaseSelection.tsx
├── public/
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🚀 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Perplexity API Key
PERPLEXITY_API_KEY=your-perplexity-api-key-here

# Supertone API Key
SUPERTONE_API_KEY=your-supertone-api-key-here

# Google Gemini API Key
GOOGLE_API_KEY=your-google-api-key-here
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 브라우저에서 확인
http://localhost:3000 으로 접속하여 애플리케이션을 확인하세요.

## 📱 사용 방법

### Step 1: 회사명 입력
- 일본에 본사가 있는 회사명을 입력
- 정확한 회사명 사용 권장

### Step 2: 회사 정보 분석
- Perplexity AI가 자동으로 회사 정보 검색
- TTS 음성으로 정보 설명 제공
- 약 500자 분량의 요약 정보 생성

### Step 3: 브랜드 보이스 추천
- AI가 추천하는 브랜드 보이스 캐릭터 확인
- 10개의 특징 해시태그 자동 생성
- 음성으로 캐릭터 설명 제공

### Step 4: 수퍼톤 캐릭터 선택
- 4개의 추천 캐릭터 중 최적의 매칭 선택
- 성별, 나이, 유즈케이스 고려하여 선택

### Step 5: 유즈케이스 선택
- 브랜드 시그널, TVCM, RadioCM 등 선택
- 다중 선택 가능
- 프로젝트 완료

## 🔧 API 설정

### Perplexity API
- **API Key**: 환경변수에서 설정
- **Model**: `llama-3.1-sonar-small-128k-online`
- **Search**: 최신 정보 검색 지원

### Supertone TTS
- **Voice ID**: `weKbNjMh2V5MuXziwHwjoT`
- **Language**: 한국어 (kr)
- **Style**: 중립적 (neutral)
- **Model**: `sona_speech_1`

## 🎨 UI/UX 특징

- **반응형 디자인**: 모바일과 데스크톱 모두 지원
- **진행률 표시**: 5단계 진행 상황 시각화
- **인터랙티브 요소**: 호버 효과, 선택 상태 표시
- **접근성**: 키보드 네비게이션 지원
- **로딩 상태**: 각 단계별 로딩 애니메이션

## 🔮 향후 개발 계획

- [ ] 실제 수퍼톤 캐릭터 데이터 연동
- [ ] 음성 품질 향상 및 다양한 음성 옵션
- [ ] 프로젝트 저장 및 불러오기 기능
- [ ] 팀 협업 기능
- [ ] 분석 결과 PDF 다운로드
- [ ] 다국어 지원 (영어, 일본어)

## 🤝 기여하기

1. 이 저장소를 포크하세요
2. 새로운 기능 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성하세요

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이나 버그 리포트가 있으시면 이슈를 생성해 주세요.

---

**Brand Voice Generator** - AI로 만드는 브랜드 보이스 캐릭터 🎭✨
