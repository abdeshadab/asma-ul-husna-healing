const fs = require('fs');
const content = fs.readFileSync('asma-ul-husna-data.js', 'utf8');
const match = content.match(/const asmaUlHusna = (\[[\s\S]*\]);/);
let data;
eval(`data = ${match[1]}`);

console.log('📊 FINAL DATA VERIFICATION');
console.log('========================');
console.log(`Total names: ${data.length}`);
console.log(`Names with healingProperties: ${data.filter(n => n.healingProperties).length}`);
console.log(`Names with meditationPractice: ${data.filter(n => n.meditationPractice).length}`);
console.log(`Names with deeperMeaning: ${data.filter(n => n.deeperMeaning).length}`);
console.log(`Names with quranicReferences: ${data.filter(n => n.quranicReferences).length}`);
console.log(`Names with dailyApplication: ${data.filter(n => n.dailyApplication).length}`);
console.log();

console.log('🔍 MISSING ENHANCEMENT DATA:');
const missing = data.filter(n => !n.healingProperties || !n.meditationPractice);
if (missing.length > 0) {
  console.log(`Names still missing complete data (${missing.length}):`);
  missing.forEach(n => console.log(`  - ID ${n.id}: ${n.transliteration} (${n.meaning})`));
} else {
  console.log('✅ ALL NAMES HAVE COMPLETE ENHANCEMENT DATA!');
}