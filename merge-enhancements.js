// Script to merge enhancement data into main data file
const fs = require('fs');

// Read the main data file and extract the array
const mainDataContent = fs.readFileSync('asma-ul-husna-data.js', 'utf8');
// Use a safer way to extract the data
const asmaUlHusnaMatch = mainDataContent.match(/const asmaUlHusna = (\[[\s\S]*\]);/);
if (!asmaUlHusnaMatch) {
  console.error('Could not find asmaUlHusna array in the file');
  process.exit(1);
}

let asmaUlHusna;
eval(`asmaUlHusna = ${asmaUlHusnaMatch[1]}`);

// Read enhancement data
const enhancementContent = fs.readFileSync('complete-all-enhancements.js', 'utf8');
const enhancementMatch = enhancementContent.match(/const completeEnhancementData = (\{[\s\S]*\});/);
if (!enhancementMatch) {
  console.error('Could not find enhancement data');
  process.exit(1);
}

let completeEnhancementData;
eval(`completeEnhancementData = ${enhancementMatch[1]}`);

// Apply enhancements
function mergeEnhancements(names, enhancementData) {
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

// Merge the data
const enhancedNames = mergeEnhancements(asmaUlHusna, completeEnhancementData);

// Generate the new file content
const newFileContent = `const asmaUlHusna = ${JSON.stringify(enhancedNames, null, 2)};`;

// Write back to file
fs.writeFileSync('asma-ul-husna-data.js', newFileContent);

console.log('✅ Data merge completed successfully!');
console.log(`📊 Original names with healingProperties: ${asmaUlHusna.filter(n => n.healingProperties).length}`);
console.log(`📊 Enhanced names with healingProperties: ${enhancedNames.filter(n => n.healingProperties).length}`);
console.log(`🔧 Names enhanced from complete-all-enhancements.js: ${Object.keys(completeEnhancementData).length}`);