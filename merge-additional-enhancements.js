// Script to merge additional enhancement data into main data file
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

// Read additional enhancement data from complete-enhancement-data.js
const additionalEnhancementContent = fs.readFileSync('complete-enhancement-data.js', 'utf8');
const additionalEnhancementMatch = additionalEnhancementContent.match(/const remainingNamesEnhancement = (\{[\s\S]*?\});/);
if (!additionalEnhancementMatch) {
  console.error('Could not find remainingNamesEnhancement data');
  process.exit(1);
}

let remainingNamesEnhancement;
eval(`remainingNamesEnhancement = ${additionalEnhancementMatch[1]}`);

// Apply additional enhancements
function mergeAdditionalEnhancements(names, enhancementData) {
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

// Merge the additional data
const enhancedNames = mergeAdditionalEnhancements(asmaUlHusna, remainingNamesEnhancement);

// Generate the new file content
const newFileContent = `const asmaUlHusna = ${JSON.stringify(enhancedNames, null, 2)};`;

// Write back to file
fs.writeFileSync('asma-ul-husna-data.js', newFileContent);

console.log('✅ Additional enhancement data merge completed successfully!');
console.log(`📊 Names enhanced from complete-enhancement-data.js: ${Object.keys(remainingNamesEnhancement).length}`);
console.log(`📊 Total names with healingProperties: ${enhancedNames.filter(n => n.healingProperties).length}`);
console.log(`📊 Total names with meditationPractice: ${enhancedNames.filter(n => n.meditationPractice).length}`);
console.log(`📊 Total names with deeperMeaning: ${enhancedNames.filter(n => n.deeperMeaning).length}`);
console.log(`📊 Total names with quranicReferences: ${enhancedNames.filter(n => n.quranicReferences).length}`);