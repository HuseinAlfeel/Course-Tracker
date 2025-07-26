# Sound Files for Celebration System

This directory should contain the following sound files:

1. **LessonVictory.mp3** - Plays when a lesson/module is completed
   - Duration: 2-3 seconds
   - Style: Light, encouraging victory sound
   - Volume: Set to 50% in code

2. **BigVictory.mp3** - Plays when a badge is achieved
   - Duration: 3-4 seconds  
   - Style: Bigger, more celebratory sound
   - Volume: Set to 50% in code

## Adding Sound Files

To add these sound files:

1. Find appropriate royalty-free sound effects
2. Name them exactly as listed above
3. Place them in this `/public/sounds/` directory
4. The celebration system will automatically play them

## Error Handling

The celebration system includes error handling:
- If sound files are missing, celebrations will still work with confetti
- Errors are logged to console but don't break the app
- Audio volume is set to 50% for good user experience

## Sound Sources

You can find appropriate sounds from:
- Freesound.org
- Zapsplat.com  
- YouTube Audio Library
- Any royalty-free sound library

Make sure the sounds are:
- Short (2-4 seconds)
- Positive/celebratory
- MP3 format
- Good quality but not too large (under 1MB each)
