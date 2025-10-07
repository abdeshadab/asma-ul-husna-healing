const fs = require('fs');

// Load the data
const content = fs.readFileSync('asma-ul-husna-data.js', 'utf8');
// Remove the const declaration and eval the array directly
const cleanedContent = content.replace('const asmaUlHusna = ', '');
const asmaUlHusna = eval(cleanedContent);

console.log('Total names in file:', asmaUlHusna.length);

// Extract just the names and transliterations for analysis
const names = asmaUlHusna.map(item => ({
  id: item.id,
  arabic: item.arabic,
  transliteration: item.transliteration,
  meaning: item.meaning
}));

console.log('\nFirst 10 names:');
names.slice(0, 10).forEach(name => {
  console.log(`${name.id}. ${name.arabic} (${name.transliteration}) - ${name.meaning}`);
});

console.log('\nLast 10 names:');
names.slice(-10).forEach(name => {
  console.log(`${name.id}. ${name.arabic} (${name.transliteration}) - ${name.meaning}`);
});

// Check for duplicates
const transliterations = names.map(n => n.transliteration);
const duplicates = transliterations.filter((item, index) => transliterations.indexOf(item) !== index);
console.log('\nDuplicate transliterations found:', duplicates.length > 0 ? duplicates : 'None');

// Check for missing IDs
const ids = names.map(n => n.id).sort((a, b) => a - b);
const missing = [];
for (let i = 1; i <= 99; i++) {
  if (!ids.includes(i)) {
    missing.push(i);
  }
}
console.log('Missing ID numbers:', missing.length > 0 ? missing : 'None');

// Check for ID duplicates
const idDuplicates = ids.filter((item, index) => ids.indexOf(item) !== index);
console.log('Duplicate ID numbers:', idDuplicates.length > 0 ? idDuplicates : 'None');

// Show IDs that appear multiple times
const idCounts = {};
names.forEach(name => {
  idCounts[name.id] = (idCounts[name.id] || 0) + 1;
});
const multipleIds = Object.entries(idCounts).filter(([id, count]) => count > 1);
if (multipleIds.length > 0) {
  console.log('\nIDs appearing multiple times:');
  multipleIds.forEach(([id, count]) => {
    console.log(`ID ${id}: appears ${count} times`);
    const entries = names.filter(n => n.id == id);
    entries.forEach(entry => {
      console.log(`  ${entry.arabic} (${entry.transliteration})`);
    });
  });
}