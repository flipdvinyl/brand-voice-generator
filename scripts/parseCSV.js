const fs = require('fs');
const path = require('path');

// CSV 파일 읽기
const csvPath = '/Users/d/Downloads/voices-output.csv';
const completeOutputPath = path.join(__dirname, '../src/utils/completeCharacterDB.ts');
const perplexityOutputPath = path.join(__dirname, '../src/utils/perplexityCharacterDB.ts');

try {
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n');
  
  // 헤더 제거
  const headers = lines[0].split(',');
  const dataLines = lines.slice(1).filter(line => line.trim());
  
  console.log(`총 ${dataLines.length}개의 캐릭터 데이터를 처리합니다.`);
  
  // TypeScript 파일 생성
  let tsContent = `// 완전한 캐릭터 보이스 메타데이터 타입 정의
export interface CompleteCharacterVoice {
  voice_id: string
  name: string
  description: string
  age: string
  gender: string
  usecases: string[]
  styles: string[]
  sample_ko: string
  sample_en: string
  sample_ja: string
  thumbnail: string
}

// 완전한 캐릭터 보이스 메타데이터 DB (CSV에서 파싱된 모든 데이터)
export const completeCharacterVoiceDB: CompleteCharacterVoice[] = [
`;

  // 각 라인을 파싱하여 TypeScript 객체로 변환
  dataLines.forEach((line, index) => {
    if (line.trim()) {
      const values = parseCSVLine(line);
      
      if (values.length >= 11) {
        const character = {
          voice_id: values[0] || '',
          name: values[1] || '',
          description: values[2] || '',
          age: values[3] || '',
          gender: values[4] || '',
          usecases: values[5] ? values[5].split('; ').map(uc => uc.trim()) : [],
          styles: values[6] ? values[6].split('; ').map(s => s.trim()) : [],
          sample_ko: values[7] || '',
          sample_en: values[8] || '',
          sample_ja: values[9] || '',
          thumbnail: values[10] || ''
        };
        
        tsContent += `  {
    voice_id: "${character.voice_id}",
    name: "${character.name}",
    description: "${character.description.replace(/"/g, '\\"')}",
    age: "${character.age}",
    gender: "${character.gender}",
    usecases: [${character.usecases.map(uc => `"${uc}"`).join(', ')}],
    styles: [${character.styles.map(s => `"${s}"`).join(', ')}],
    sample_ko: "${character.sample_ko}",
    sample_en: "${character.sample_en}",
    sample_ja: "${character.sample_ja}",
    thumbnail: "${character.thumbnail}"
  }`;
        
        if (index < dataLines.length - 1) {
          tsContent += ',\n';
        } else {
          tsContent += '\n';
        }
      }
    }
  });
  
  tsContent += `]

// 유틸리티 함수들
export function findCharacterByVoiceId(voiceId: string): CompleteCharacterVoice | undefined {
  return completeCharacterVoiceDB.find(character => character.voice_id === voiceId)
}

export function findCharacterByName(name: string): CompleteCharacterVoice | undefined {
  return completeCharacterVoiceDB.find(character => character.name === name)
}

export function getCharactersByAge(age: string): CompleteCharacterVoice[] {
  return completeCharacterVoiceDB.filter(character => character.age === age)
}

export function getCharactersByGender(gender: string): CompleteCharacterVoice[] {
  return completeCharacterVoiceDB.filter(character => character.gender === gender)
}

export function getCharactersByUseCase(useCase: string): CompleteCharacterVoice[] {
  return completeCharacterVoiceDB.filter(character => 
    character.usecases.some(uc => uc.toLowerCase().includes(useCase.toLowerCase()))
  )
}

export function getCharactersByStyle(style: string): CompleteCharacterVoice[] {
  return completeCharacterVoiceDB.filter(character => 
    character.styles.some(s => s.toLowerCase().includes(style.toLowerCase()))
  )
}

// 나이 라벨 변환
export function getAgeLabel(age: string): string {
  const ageLabels: Record<string, string> = {
    'child': '어린이',
    'young-adult': '청년',
    'middle-aged': '중년',
    'elder': '노년'
  }
  return ageLabels[age] || age
}

// 성별 라벨 변환
export function getGenderLabel(gender: string): string {
  return gender === 'male' ? '남성' : '여성'
}
`;

  // 완전한 DB 파일 쓰기
  fs.writeFileSync(completeOutputPath, tsContent, 'utf-8');
  
  // 퍼플렉시티용 간소화된 DB 생성
  let perplexityContent = `// 퍼플렉시티용 간소화된 캐릭터 메타데이터 타입
export interface PerplexityCharacterVoice {
  name: string
  description: string
  age: string
  gender: string
  usecases: string[]
  styles: string[]
}

// 퍼플렉시티용 간소화된 캐릭터 보이스 메타데이터 DB
export const perplexityCharacterVoiceDB: PerplexityCharacterVoice[] = [
`;

  // 퍼플렉시티용 데이터 생성
  dataLines.forEach((line, index) => {
    if (line.trim()) {
      const values = parseCSVLine(line);
      
      if (values.length >= 11) {
        const character = {
          name: values[1] || '',
          description: values[2] || '',
          age: values[3] || '',
          gender: values[4] || '',
          usecases: values[5] ? values[5].split('; ').map(uc => uc.trim()) : [],
          styles: values[6] ? values[6].split('; ').map(s => s.trim()) : []
        };
        
        perplexityContent += `  {
    name: "${character.name}",
    description: "${character.description.replace(/"/g, '\\"')}",
    age: "${character.age}",
    gender: "${character.gender}",
    usecases: [${character.usecases.map(uc => `"${uc}"`).join(', ')}],
    styles: [${character.styles.map(s => `"${s}"`).join(', ')}]
  }`;
        
        if (index < dataLines.length - 1) {
          perplexityContent += ',\n';
        } else {
          perplexityContent += '\n';
        }
      }
    }
  });
  
  perplexityContent += `]
`;

  // 퍼플렉시티용 DB 파일 쓰기
  fs.writeFileSync(perplexityOutputPath, perplexityContent, 'utf-8');
  
  console.log(`✅ 완료! ${dataLines.length}개의 캐릭터 데이터가 생성되었습니다.`);
  console.log(`📁 완전한 DB: ${completeOutputPath}`);
  console.log(`📁 퍼플렉시티용 DB: ${perplexityOutputPath}`);
  
} catch (error) {
  console.error('❌ 에러 발생:', error.message);
}

// CSV 라인 파싱 함수 (쉼표와 따옴표 처리)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}
