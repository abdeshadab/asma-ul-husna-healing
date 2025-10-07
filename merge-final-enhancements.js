// Script to merge final enhancement data for names 71-98
const fs = require('fs');

// Read the main data file and extract the array
const mainDataContent = fs.readFileSync('asma-ul-husna-data.js', 'utf8');
const asmaUlHusnaMatch = mainDataContent.match(/const asmaUlHusna = (\[[\s\S]*\]);/);
if (!asmaUlHusnaMatch) {
  console.error('Could not find asmaUlHusna array in the file');
  process.exit(1);
}

let asmaUlHusna;
eval(`asmaUlHusna = ${asmaUlHusnaMatch[1]}`);

// Read final enhancement data from final-enhancements-71-98.js
const finalEnhancementContent = fs.readFileSync('final-enhancements-71-98.js', 'utf8');
const finalEnhancementMatch = finalEnhancementContent.match(/const finalEnhancementData = (\{[\s\S]*?\});/);
if (!finalEnhancementMatch) {
  console.error('Could not find finalEnhancementData');
  process.exit(1);
}

let finalEnhancementData;
eval(`finalEnhancementData = ${finalEnhancementMatch[1]}`);

// Apply final enhancements
function mergeFinalEnhancements(names, enhancementData) {
  return names.map(name => {
    if (enhancementData[name.id]) {
      return {
        ...name,
        audioPath: `audio/names/${String(name.id).padStart(3, '0')}-${name.transliteration.toLowerCase().replace(/[^a-z]/g, '-')}.mp3`,
        ...enhancementData[name.id]
      };
    }
    return name;
  });
}

// Merge the final data
const fullyEnhancedNames = mergeFinalEnhancements(asmaUlHusna, finalEnhancementData);

// Generate the new file content
const newFileContent = `const asmaUlHusna = ${JSON.stringify(fullyEnhancedNames, null, 2)};`;

// Write back to file
fs.writeFileSync('asma-ul-husna-data.js', newFileContent);

console.log('✅ FINAL ENHANCEMENT COMPLETION!');
console.log('================================');
console.log(`📊 Names enhanced in this batch: ${Object.keys(finalEnhancementData).length}`);
console.log(`📊 Total names with healingProperties: ${fullyEnhancedNames.filter(n => n.healingProperties).length}`);
console.log(`📊 Total names with meditationPractice: ${fullyEnhancedNames.filter(n => n.meditationPractice).length}`);
console.log(`📊 Total names with deeperMeaning: ${fullyEnhancedNames.filter(n => n.deeperMeaning).length}`);
console.log(`📊 Total names with quranicReferences: ${fullyEnhancedNames.filter(n => n.quranicReferences).length}`);
console.log(`📊 Total names with dailyApplication: ${fullyEnhancedNames.filter(n => n.dailyApplication).length}`);

// Check for any remaining incomplete names
const incompleteNames = fullyEnhancedNames.filter(n => !n.healingProperties || !n.meditationPractice);
if (incompleteNames.length === 0) {
  console.log('🎉 ALL 99 BEAUTIFUL NAMES NOW HAVE COMPLETE ENHANCEMENT DATA!');
} else {
  console.log(`⚠️  Still missing complete data: ${incompleteNames.length} names`);
  incompleteNames.forEach(n => console.log(`   - ID ${n.id}: ${n.transliteration}`));
}