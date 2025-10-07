const fs = require('fs');

// Load the data
const content = fs.readFileSync('asma-ul-husna-data.js', 'utf8');
const cleanedContent = content.replace('const asmaUlHusna = ', '');
const asmaUlHusna = eval(cleanedContent);

// Find the duplicate entries
const transliterations = asmaUlHusna.map(n => n.transliteration);
const duplicateTransliterations = transliterations.filter((item, index) => transliterations.indexOf(item) !== index);

console.log('Duplicate transliterations found:', duplicateTransliterations);

// Find all entries with duplicate transliterations
duplicateTransliterations.forEach(duplicate => {
  console.log(`\nEntries with transliteration '${duplicate}':`);
  const matches = asmaUlHusna.filter(n => n.transliteration === duplicate);
  matches.forEach(match => {
    console.log(`  ID: ${match.id}, Arabic: ${match.arabic}, Meaning: ${match.meaning}`);
  });
});

// Also check for unique names that should appear
const uniqueTransliterations = [...new Set(transliterations)];
console.log(`\nTotal unique transliterations: ${uniqueTransliterations.length}`);
console.log(`Total entries: ${asmaUlHusna.length}`);

if (uniqueTransliterations.length !== asmaUlHusna.length) {
  console.log(`Missing unique names: ${asmaUlHusna.length - uniqueTransliterations.length}`);
}