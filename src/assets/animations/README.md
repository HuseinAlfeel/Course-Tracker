# 🎭 Animation Files

This directory contains animation files for the Motivation Mascot system.

## 📁 Current Files

### Placeholder Animations (JSON format)
- `monkey-dancing.json` - Simple rotating circle placeholder
- `sad-circle.json` - Simple moving circle placeholder

## 🔄 Replacing with Real Animations

To use your downloaded .lottie files:

### Option 1: Use .lottie files directly
1. Place your `monkey-dancing.lottie` and `sad-circle.lottie` files here
2. Update `MotivationMascot.js` to use `@dotlottie/react-player`:

```javascript
import { DotLottieReact } from '@dotlottie/react-player';
import monkeyDancingAnimation from '../assets/animations/monkey-dancing.lottie';
import sadCircleAnimation from '../assets/animations/sad-circle.lottie';

// Then use:
<DotLottieReact
  src={monkeyDancingAnimation}
  loop
  autoplay
  style={{ width: '100%', height: '100%' }}
/>
```

### Option 2: Convert to JSON format
1. Download JSON versions from LottieFiles
2. Replace the placeholder JSON files
3. Keep the current Lottie component setup

## 🎨 Animation Requirements

### Monkey Dancing Animation
- **Purpose**: Encouraging users who are behind
- **Style**: Happy, energetic, motivational
- **Duration**: 2-4 seconds loop
- **Size**: Under 500KB recommended

### Sad Circle Animation
- **Purpose**: Missing users who haven't learned recently
- **Style**: Gentle, caring, inviting
- **Duration**: 3-6 seconds loop
- **Size**: Under 300KB recommended

## 🚀 Animation Sources

- **LottieFiles.com** - Free animations
- **After Effects** - Custom animations
- **Figma + LottieFiles Plugin** - Simple animations
- **Rive.app** - Interactive animations

## 🔧 Testing

The mascot system includes:
- ✅ Animation loading fallbacks
- ✅ Performance optimization
- ✅ Mobile responsiveness
- ✅ Accessibility considerations

Once you add real animations, the system will automatically use them!
