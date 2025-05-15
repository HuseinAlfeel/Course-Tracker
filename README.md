Devolve
Images to be added later ***
A comprehensive learning progress tracker for web development bootcamps and courses. Track your journey from beginner to professional with visual progress indicators, streak tracking, and gamified achievements.
Live Demo
Demo to be added later***
✨ Features

Progress Tracking: Monitor your overall and category-specific progress
Achievement System: Unlock badges as you reach learning milestones
Study Streak Tracking: Build consistent learning habits
Visual Analytics: See your learning patterns with interactive charts
Module Management: Track individual modules with not started/in progress/completed status
Leaderboard: Compare your progress with other learners
User Authentication: Secure login/signup system
Responsive Design: Works on desktop and mobile devices

🚀 Quick Start
Prerequisites

Node.js (v14.x or higher recommended)
npm or yarn
Git

Installation

Clone the repository
bashgit clone https://github.com/HuseinAlfeel/Course-Tracker.git
cd Course-Tracker

Install dependencies
bashnpm install

Create a Firebase project

Go to Firebase Console
Create a new project
Set up Authentication (Email/Password)
Create a Firestore database
Get your Firebase configuration


Create a .env file in the root directory with your Firebase config
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id

Start the development server
bashnpm start

Open http://localhost:3000 to view the app

For Legacy Node Versions
This project uses some dependencies that may require the OpenSSL legacy provider. If you encounter related errors, use:
bashnpm start -- --openssl-legacy-provider
Or set in package.json scripts:
json"start": "set NODE_OPTIONS=--openssl-legacy-provider && react-scripts start"
🔧 Technologies Used

Frontend: React.js, React Router v6
Styling: CSS-in-JS (styled components)
Authentication: Firebase Authentication
Database: Firebase Firestore
Hosting: GitHub Pages
Charts: Recharts
State Management: React Context API

📂 Project Structure
src/
├── components/         # UI components
│   ├── Auth/           # Authentication components
│   ├── Dashboard/      # Dashboard components
│   ├── Achievements/   # Achievement system
│   ├── CourseTracking/ # Module tracking
│   └── Analytics/      # Data visualization
├── context/            # React Context providers
│   ├── AuthContext.js  # Authentication context
│   └── ProgressContext.js # Progress tracking context
├── constants/          # App constants
│   └── courseData.js   # Course modules data
├── services/           # External services
│   └── firebase.js     # Firebase configuration
└── App.js              # Main application component
🧠 Key Concepts
Authentication Flow

User registers or logs in via Firebase Authentication
User document is created/fetched from Firestore
AuthContext provides the authentication state to the app

Progress Tracking Logic

User marks modules as "In Progress" or "Completed"
Progress is stored in Firestore and tracked in ProgressContext
Achievements are unlocked based on progress milestones
Analytics visualize progress over time

🛠️ Development
Available Scripts

npm start - Runs the app in development mode
npm test - Launches the test runner
npm run build - Builds the app for production
npm run deploy - Deploys to GitHub Pages

Adding New Modules
To add new course modules, edit the src/constants/courseData.js file:
javascriptexport const courseModules = [
  {
    id: 1,
    title: "Module Title",
    description: "Module description",
    category: "Category Name"
  },
  // Add more modules here
];
Adding New Achievements
To add new achievements, update the achievements array in Dashboard.js and the checkAndUnlockAchievements function in ProgressContext.js.
📱 Responsive Design
The app is designed to work on devices of all sizes:

Desktop: Full featured dashboard
Tablet: Optimized layout with all features
Mobile: Condensed view with essential features

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
🙏 Acknowledgements

React
Firebase
Recharts
React Router

Built with ❤️ by Husein Alfeel
