const fs = require('fs');
const path = require('path');

// perplexityCharacterDB.ts 파일 읽기
const filePath = path.join(__dirname, '../src/utils/perplexityCharacterDB.ts');
let content = fs.readFileSync(filePath, 'utf8');

console.log('파일 읽기 완료. 크기:', content.length);

// 여러 패턴으로 시도
const patterns = [
  /name: "\[Choice\] /g,
  /name: "\[Meme\] /g,
  /name: "\[New\] /g,
  /name: "\[[^\]]+\] /g
];

let totalReplacements = 0;

patterns.forEach((pattern, index) => {
  const matches = content.match(pattern);
  if (matches) {
    console.log(`패턴 ${index + 1} 매치 수:`, matches.length);
    console.log('첫 3개 매치:', matches.slice(0, 3));
    content = content.replace(pattern, 'name: "');
    totalReplacements += matches.length;
  }
});

// 파일에 다시 쓰기
fs.writeFileSync(filePath, content, 'utf8');

console.log(`✅ perplexityCharacterDB.ts에서 총 ${totalReplacements}개 [###] 접두사 제거 완료!`);