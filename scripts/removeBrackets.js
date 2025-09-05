const fs = require('fs');
const path = require('path');

// completeCharacterDB.ts 파일 읽기
const filePath = path.join(__dirname, '../src/utils/completeCharacterDB.ts');
let content = fs.readFileSync(filePath, 'utf8');

// [###] 형태의 접두사를 제거하는 정규식
// name: "[Choice] Lang" -> name: "Lang"
// name: "[Meme] Santa" -> name: "Santa"
// name: "[New] Goro" -> name: "Goro"
const regex = /name: "\[[^\]]+\] /g;
content = content.replace(regex, 'name: "');

// 파일에 다시 쓰기
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ [###] 접두사 제거 완료!');
console.log('변경된 내용:');
console.log('- [Choice] Lang -> Lang');
console.log('- [Meme] Santa -> Santa');
console.log('- [New] Goro -> Goro');
console.log('- 기타 모든 [###] 접두사 제거');
