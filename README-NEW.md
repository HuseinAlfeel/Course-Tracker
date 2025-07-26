# Devolve – Bootcamp Progress Tracker

A comprehensive learning progress tracker for web development bootcamps and courses. Track your journey from beginner to professional with visual progress indicators, streak tracking, and gamified achievements.

Built while working through Angela Yu's acclaimed MERN-Stack Bootcamp on Udemy. The goal? Make it effortless—and fun—for classmates to see how far they've come, spot what's next, and cheer each other on.

## 🌐 Live Demo
**Try it here: https://huseinalfeel.github.io/Course-Tracker/**

Perfect for: https://www.udemy.com/course/the-complete-web-development-bootcamp/?couponCode=LETSLEARNNOW

## ✨ Features

🎯 **Progress Tracking**: Monitor your overall and category-specific progress  
🏆 **Achievement System**: Unlock 18 unique badges as you reach learning milestones  
🎉 **Celebration System**: Interactive confetti and sound effects for completions  
🐵 **Motivation Mascot**: Personal AI companion that adapts to your activity level  
🔥 **Study Streak Tracking**: Build consistent learning habits with streak counters  
📊 **Visual Analytics**: See your learning patterns with interactive charts  
📝 **Module Management**: Track individual modules with not started/in progress/completed status  
🏅 **Leaderboard**: Compare your progress with other learners  
🔐 **User Authentication**: Secure login/signup system with Firebase  
📱 **Responsive Design**: Works perfectly on desktop and mobile devices  

## 🎉 Celebration & Motivation System

### 🎊 Celebrations
- **Lesson Celebrations**: Confetti animations and victory sounds when completing modules
- **Badge Achievements**: Special celebrations with modal notifications for unlocking badges
- **Audio Feedback**: Victory sounds that enhance the learning experience (`BigVictory.mp3`, `LessonVictory.mp3`)

### 🐵 Motivation Mascot
- **Smart Activity Detection**: Tracks your 48-hour activity patterns
- **Adaptive Animations**: Happy dancing monkey for active learners, gentle reminders for inactive periods
- **Synchronized Messages**: Encouraging messages perfectly matched with appropriate animations
- **Non-Intrusive**: Motivates without interrupting your workflow

### 🏆 18 Achievement Badges
From "First Steps" to "Coding Champion" - track major milestones including:
- **First Steps**: Complete your first module
- **Week Warrior**: Study 7 days straight  
- **Progress Pioneer**: Reach 25% completion
- **Coding Champion**: Master all categories
- **And 14 more unique achievements!**

## 🚀 Quick Start

### Prerequisites
- Node.js (v14.x or higher recommended)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/HuseinAlfeel/Course-Tracker.git
cd Course-Tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Firebase** (optional - for data persistence)
```bash
# Copy the example environment file
cp .env.example .env.local

# Add your Firebase configuration
# Edit .env.local with your Firebase project details
```

4. **Start the development server**
```bash
npm start
```

5. **Build for production**
```bash
npm run build
```

6. **Deploy to GitHub Pages**
```bash
npm run deploy
```

## 🔧 Technology Stack

- **Frontend**: React 18, React Router, Context API
- **Animations**: @dotlottie/react-player, Canvas Confetti
- **Charts**: Chart.js, React Charts 2, Recharts
- **Styling**: CSS3, Styled Components
- **Backend**: Firebase (Authentication, Firestore Database)
- **Deployment**: GitHub Pages
- **Build**: React Scripts with legacy OpenSSL provider support

## 📁 Project Structure

```
src/
├── components/
│   ├── Auth/                    # Login/Register components
│   ├── Dashboard/               # Main dashboard and analytics
│   ├── Common/                  # Reusable UI components
│   ├── CourseTracking/         # Module tracking functionality
│   └── MotivationMascot.js     # AI companion system
├── context/
│   ├── ProgressContext.js      # Global progress state
│   └── CelebrationContext.js   # Celebration system
├── constants/
│   ├── courseData.js           # Course structure
│   ├── achievementData.js      # Badge definitions
│   └── badgeData.js           # Badge configurations
├── services/
│   └── firebase.js            # Firebase configuration
└── assets/
    └── animations/            # Lottie animation files
```

## 🎵 Audio Features

The app includes immersive audio feedback:
- **BigVictory.mp3**: Plays when unlocking major achievements
- **LessonVictory.mp3**: Plays when completing individual modules
- **Browser-compatible**: Works across all modern browsers
- **User-controlled**: Audio respects browser autoplay policies

## 🐛 Troubleshooting

### Audio Not Playing
- Ensure browser allows autoplay (some browsers block it)
- Check browser console for audio loading errors
- Verify sound files are properly deployed

### Build Issues
- If you encounter OpenSSL errors, the project includes legacy provider flags
- For Node.js 17+, the build script automatically handles compatibility

### Firebase Connection
- Ensure your Firebase configuration is correct in `.env.local`
- Check Firebase console for proper security rules

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Husein Alfeel** - [GitHub](https://github.com/HuseinAlfeel)

## 🙏 Acknowledgments

- Angela Yu for the amazing Udemy bootcamp that inspired this project
- The React community for excellent documentation and resources
- Lottie animations for bringing the mascot to life
- Firebase for providing robust backend services

---

**Happy Learning! 🚀**
