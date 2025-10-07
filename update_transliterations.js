const fs = require('fs');

// Load the current data
const content = fs.readFileSync('asma-ul-husna-data.js', 'utf8');

// Define transliteration mappings with macrons
const transliterationMappings = {
  1: "Ar-Raḥmān",
  2: "Ar-Raḥīm", 
  3: "Al-Malik",
  4: "Al-Quddūs",
  5: "As-Salām",
  6: "Al-Mu'min",
  7: "Al-Muhaymin",
  8: "Al-ʿAzīz",
  9: "Al-Jabbār",
  10: "Al-Mutakabbir",
  11: "Al-Khāliq",
  12: "Al-Bāri'",
  13: "Al-Muṣawwir",
  14: "Al-Ghaffār",
  15: "Al-Qahhār",
  16: "Al-Wahhāb",
  17: "Ar-Razzāq",
  18: "Al-Fattāḥ",
  19: "Al-ʿAlīm",
  20: "Al-Qābiḍ",
  21: "Al-Bāsiṭ",
  22: "Al-Khāfiḍ",
  23: "Ar-Rāfiʿ",
  24: "Al-Muʿizz",
  25: "Al-Mudhill",
  26: "As-Samīʿ",
  27: "Al-Baṣīr",
  28: "Al-Ḥakam",
  29: "Al-ʿAdl",
  30: "Al-Laṭīf",
  31: "Al-Khabīr",
  32: "Al-Ḥalīm",
  33: "Al-ʿAẓīm",
  34: "Al-Ghafūr",
  35: "Ash-Shakūr",
  36: "Al-ʿAliyy",
  37: "Al-Kabīr",
  38: "Al-Ḥafīẓ",
  39: "Al-Muqīt",
  40: "Al-Ḥasīb",
  41: "Al-Jalīl",
  42: "Al-Karīm",
  43: "Ar-Raqīb",
  44: "Al-Mujīb",
  45: "Al-Wāsiʿ",
  46: "Al-Ḥakīm",
  47: "Al-Wadūd",
  48: "Al-Majīd",
  49: "Al-Bāʿith",
  50: "Ash-Shahīd",
  51: "Al-Ḥaqq",
  52: "Al-Wakīl",
  53: "Al-Qawiyy",
  54: "Al-Matīn",
  55: "Al-Waliyy",
  56: "Al-Ḥamīd",
  57: "Al-Muḥṣī",
  58: "Al-Mubdi'",
  59: "Al-Muʿīd",
  60: "Al-Muḥyī",
  61: "Al-Mumīt",
  62: "Al-Ḥayy",
  63: "Al-Qayyūm",
  64: "Al-Wājid",
  65: "Al-Mājid",
  66: "Al-Wāḥid",
  67: "Al-Aḥad",
  68: "Aṣ-Ṣamad",
  69: "Al-Qādir",
  70: "Al-Muqtadir",
  71: "Al-Muqaddim",
  72: "Al-Mu'akhkhir",
  73: "Al-Awwal",
  74: "Al-Ākhir",
  75: "Aẓ-Ẓāhir",
  76: "Al-Bāṭin",
  77: "Al-Wālī",
  78: "Al-Mutaʿālī",
  79: "Al-Barr",
  80: "At-Tawwāb",
  81: "Al-Muntaqim",
  82: "Al-ʿAfuww",
  83: "Ar-Ra'ūf",
  84: "Mālik al-Mulk",
  85: "Dhū al-Jalāl wa al-Ikrām",
  86: "Al-Muqsiṭ",
  87: "Al-Jāmiʿ",
  88: "Al-Ghaniyy",
  89: "Al-Mughnī",
  90: "Al-Māniʿ",
  91: "Aḍ-Ḍārr",
  92: "An-Nāfiʿ",
  93: "An-Nūr",
  94: "Al-Hādī",
  95: "Al-Badīʿ",
  96: "Al-Bāqī",
  97: "Al-Wārith",
  98: "Ar-Rashīd",
  99: "Aṣ-Ṣabūr"
};

// Apply replacements
let updatedContent = content;

Object.entries(transliterationMappings).forEach(([id, newTransliteration]) => {
  // Create regex to match the specific ID and transliteration field
  const regex = new RegExp(
    `("id":\\s*${id},[\\s\\S]*?"transliteration":\\s*")(.*?)(",)`, 
    'g'
  );
  
  updatedContent = updatedContent.replace(regex, (match, prefix, oldTransliteration, suffix) => {
    console.log(`ID ${id}: "${oldTransliteration}" → "${newTransliteration}"`);
    return prefix + newTransliteration + suffix;
  });
});

// Write updated content
fs.writeFileSync('asma-ul-husna-data.js', updatedContent, 'utf8');
console.log('\nTransliterations updated with macrons successfully!');