# Audio Files Setup Guide

## Directory Structure

Create this folder structure in your project:

```
your-project/
├── index.html
├── styles.css
├── app.js
├── asma-ul-husna-data.js
└── audio/
    └── names/
        ├── 001-ar-rahman.mp3
        ├── 002-ar-raheem.mp3
        ├── 003-al-malik.mp3
        ├── 004-al-quddus.mp3
        ├── 005-as-salaam.mp3
        ├── 006-al-mumin.mp3
        ├── 007-al-muhaymin.mp3
        ├── 008-al-aziz.mp3
        ├── 009-al-jabbar.mp3
        ├── 010-al-mutakabbir.mp3
        ├── ... (continue for all 99 names)
        └── 099-as-sabur.mp3
```

## Audio File Naming Convention

Each audio file should be named using this pattern:
`{3-digit-number}-{transliteration-in-lowercase}.mp3`

Examples:
- `001-ar-rahman.mp3` for "Ar-Rahman"
- `002-ar-raheem.mp3` for "Ar-Raheem"
- `003-al-malik.mp3` for "Al-Malik"

## Complete List of Required Audio Files

Here are all 99 audio files you need to create:

001-ar-rahman.mp3        - الرَّحْمَـنُ
002-ar-raheem.mp3        - الرَّحِيمُ
003-al-malik.mp3         - الْمَلِكُ
004-al-quddus.mp3        - الْقُدُّوسُ
005-as-salaam.mp3        - السَّلاَمُ
006-al-mumin.mp3         - الْمُؤْمِنُ
007-al-muhaymin.mp3      - الْمُهَيْمِنُ
008-al-aziz.mp3          - الْعَزِيزُ
009-al-jabbar.mp3        - الْجَبَّارُ
010-al-mutakabbir.mp3    - الْمُتَكَبِّرُ
... (continue for all 99 names)

## Audio Requirements

- **Format**: MP3 (recommended for web compatibility)
- **Quality**: 128kbps or higher
- **Duration**: 2-5 seconds per name
- **Volume**: Normalized to consistent levels
- **Pronunciation**: Clear, authentic Arabic pronunciation

## How to Record/Obtain Audio

1. **Record yourself** reciting each name
2. **Use text-to-speech** with Arabic pronunciation
3. **Download from Islamic resources** (with proper permissions)
4. **Hire a reciter** for professional quality

## Testing Your Audio Files

1. Place your audio files in the `audio/names/` folder
2. Open the meditation app
3. Start a meditation session for any name
4. Use the "Play Name" button in the Name Recitation section
5. Test the volume control and repeat functionality

## Fallback Handling

The app includes error handling for missing audio files:
- Shows "❌ Audio not available" if file is missing
- Gracefully handles loading errors
- Provides visual feedback for all audio states

## Alternative Audio Sources

If you don't have audio files yet, you can:
1. Use the background meditation sounds (Nature, Rain, Ocean, Wind)
2. Add placeholder audio files for testing
3. Implement text-to-speech as a fallback option

## Notes

- Audio files are loaded on-demand to improve app performance
- The app supports both individual name recitation and background ambient sounds
- Volume controls are separate for name recitation and background audio
- Repeat functionality works automatically for continuous meditation