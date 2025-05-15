import React, { useContext, useState } from 'react';
import { AuthContext } from '../Auth/AuthContext';
import { ProgressContext } from '../../context/ProgressContext';
import { courseModules, categories } from '../../constants/courseData';
import Achievements from '../Achievements/Achievements';
import WeeklyProgressChart from './WeeklyProgressChart';

// Define achievement data here since it's not being passed by props
const allAchievements = [
 {
   id: 'first_module',
   title: 'First Steps',
   description: 'Completed your first module',
   icon: '🌱',
   color: '#4dff9d'
 },
 {
   id: 'five_modules',
   title: 'Getting Traction',
   description: 'Completed 5 modules',
   icon: '🚀',
   color: '#4d9aff'
 },
 {
   id: 'ten_modules',
   title: 'Serious Learner',
   description: 'Completed 10 modules',
   icon: '📚',
   color: '#c44dff'
 },
 {
   id: 'html_css_50',
   title: 'HTML Apprentice',
   description: 'Reached 50% in Front-End Fundamentals',
   icon: '📝',
   color: '#FF5733'
 },
 {
   id: 'html_css_complete',
   title: 'CSS Stylist',
   description: 'Completed all Front-End Fundamentals modules',
   icon: '🎨',
   color: '#33B5FF'
 },
 {
   id: 'three_day_streak',
   title: 'Consistency Begins',
   description: 'Maintained a 3-day study streak',
   icon: '🔥',
   color: '#ff9d4d'
 },
 {
   id: 'seven_day_streak',
   title: 'Week Warrior',
   description: 'Maintained a 7-day study streak',
   icon: '🏆',
   color: '#ffd700'
 },
 {
   id: 'js_dom_50',
   title: 'Script Padawan',
   description: 'Reached 50% in JavaScript & DOM',
   icon: '⚙️',
   color: '#FFDD33'
 },
 {
   id: 'js_dom_complete',
   title: 'DOM Manipulator',
   description: 'Completed all JavaScript & DOM modules',
   icon: '🧩',
   color: '#33FF57'
 },
 {
   id: 'backend_50',
   title: 'Server Novice',
   description: 'Reached 50% in Backend Development',
   icon: '🔌',
   color: '#8A33FF'
 },
 {
   id: 'backend_complete',
   title: 'API Architect',
   description: 'Completed all Backend Development modules',
   icon: '🏗️',
   color: '#FF33A8'
 },
 {
   id: 'database_50',
   title: 'Data Collector',
   description: 'Reached 50% in Databases & Full Stack',
   icon: '💾',
   color: '#33FFC1'
 },
 {
   id: 'database_complete',
   title: 'Full Stack Engineer',
   description: 'Completed all Databases & Full Stack modules',
   icon: '🔄',
   color: '#C133FF'
 },
 {
   id: 'advanced_50',
   title: 'Advanced Explorer',
   description: 'Reached 50% in Advanced Topics',
   icon: '🔍',
   color: '#FF3333'
 },
 {
   id: 'advanced_complete',
   title: 'Technology Master',
   description: 'Completed all Advanced Topics modules',
   icon: '🧠',
   color: '#33FFEC'
 },
 {
   id: 'halfway_course',
   title: 'Halfway Hero',
   description: 'Completed 50% of the entire course',
   icon: '🏄',
   color: '#FFA533'
 },
 {
   id: 'course_75',
   title: 'Almost There',
   description: 'Completed 75% of the entire course',
   icon: '🏂',
   color: '#33FFA8'
 },
 {
   id: 'course_complete',
   title: 'Coding Champion',
   description: 'Completed the entire bootcamp',
   icon: '👑',
   color: '#FFD700'
 }
];




const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const { userProgress, allUsersProgress, updateModuleStatus, userAchievements } = useContext(ProgressContext) || { 
    userProgress: [], 
    allUsersProgress: [],
    updateModuleStatus: () => console.log('updateModuleStatus not available'),
    userAchievements: []
  };
  
  // Track hover state for charts
  const [hoveredDay, setHoveredDay] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  
  // Function to get the number of modules completed by a user in the current week
  const getWeeklyCompletionCount = (userProgress) => {
    if (!userProgress || !userProgress.length) return 0;
    
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);
    
    return userProgress.filter(module => {
      return module.status === 'completed' && 
             module.updatedAt && 
             new Date(module.updatedAt) >= startOfWeek;
    }).length;
  };
  
  // Generate weekly data for all users
  const generateWeeklyData = () => {
    // If no other users, just show current user's data
    if (!allUsersProgress || allUsersProgress.length === 0) {
      return [
        {
          name: currentUser?.name || 'You',
          thisWeek: getWeeklyCompletionCount(userProgress),
          isCurrentUser: true
        }
      ];
    }
    
    // Create data for all users
    return allUsersProgress.map(user => ({
      name: user.name,
      thisWeek: getWeeklyCompletionCount(user.progress),
      isCurrentUser: user.id === currentUser?.uid
    })).sort((a, b) => b.thisWeek - a.thisWeek);
  };
  
  const weeklyData = generateWeeklyData();
  
  // Calculate completion percentage
  const calculateCompletion = (progress) => {
    if (!progress || progress.length === 0) return 0;
    const completedModules = progress.filter(p => p.status === 'completed').length;
    return Math.round((completedModules / courseModules.length) * 100);
  };
  
  // Generate leaderboard data
  const generateLeaderboard = () => {
    if (!allUsersProgress || allUsersProgress.length === 0) {
      return [{
        name: currentUser?.name || 'You',
        completion: calculateCompletion(userProgress),
        completedModules: userProgress.filter(p => p.status === 'completed').length,
        streak: currentUser?.streak || 0,
        isCurrentUser: true
      }];
    }
    
    return allUsersProgress.map(user => ({
      id: user.id,
      name: user.name,
      completion: calculateCompletion(user.progress),
      completedModules: user.progress.filter(p => p.status === 'completed').length,
      streak: user.streak || 0,
      isCurrentUser: user.id === currentUser?.uid
    })).sort((a, b) => b.completion - a.completion);
  };
  
  const leaderboardData = generateLeaderboard();
  
  // Calculate category completion
  const getCategoryCompletion = () => {
    const result = categories.map(category => {
      const categoryModules = courseModules.filter(module => module.category === category.name);
      const completedInCategory = userProgress.filter(p => 
        categoryModules.some(m => m.id === p.moduleId) && 
        p.status === 'completed'
      ).length;
      
      const total = categoryModules.length;
      const percentage = total > 0 ? Math.round((completedInCategory / total) * 100) : 0;
      
      return {
        name: category.name,
        color: category.color,
        completed: completedInCategory,
        total: total,
        percentage: percentage
      };
    });
    
    return result;
  };
  
  // Generate study hours data based on completed modules
  const generateStudyHoursData = () => {
    // Assuming 1.5 hours per completed module
    const HOURS_PER_MODULE = 1.5;
    
    // Create an array for the last 7 days
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const result = days.map(day => ({ day, hours: 0 }));
    
    // Count completed modules by day over the past week
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ...
    
    userProgress.forEach(module => {
      if (module.status === 'completed' && module.updatedAt) {
        const completedDate = new Date(module.updatedAt);
        const daysAgo = Math.floor((today - completedDate) / (1000 * 60 * 60 * 24));
        
        // Only include if completed within the last 7 days
        if (daysAgo < 7) {
          const dayIndex = (dayOfWeek - daysAgo) % 7;
          const normalizedDayIndex = dayIndex < 0 ? dayIndex + 7 : dayIndex;
          // Map to the correct array index (Mon=0, Tue=1, ..., Sun=6)
          const arrayIndex = (normalizedDayIndex + 6) % 7;
          
          result[arrayIndex].hours += HOURS_PER_MODULE;
        }
      }
    });
    
    // Calculate total hours
    const totalHours = result.reduce((sum, day) => sum + day.hours, 0);
    
    return { dailyData: result, totalHours };
  };
  
  const { dailyData: studyHoursData, totalHours: weeklyStudyHours } = generateStudyHoursData();
  
  // Get next module to study
  const getNextModule = () => {
    const completedModuleIds = userProgress
      .filter(p => p.status === 'completed')
      .map(p => p.moduleId);
    
    const inProgressModuleIds = userProgress
      .filter(p => p.status === 'in-progress')
      .map(p => p.moduleId);
    
    // First check if there are modules in progress
    if (inProgressModuleIds.length > 0) {
      const moduleInProgress = courseModules.find(m => m.id === inProgressModuleIds[0]);
      return {
        id: moduleInProgress.id,
        title: moduleInProgress.title,
        status: 'in-progress'
      };
    }
    
    // If not, find the next module that hasn't been completed
    for (let i = 0; i < courseModules.length; i++) {
      if (!completedModuleIds.includes(courseModules[i].id)) {
        return {
          id: courseModules[i].id,
          title: courseModules[i].title,
          status: 'not-started'
        };
      }
    }
    
    // If all modules are completed
    return {
      id: courseModules[courseModules.length - 1].id,
      title: 'All modules completed! 🎉',
      status: 'completed'
    };
  };
  
  // Generate milestone based on completion percentage
  const getMilestone = (completion) => {
    if (completion >= 100) return { title: "Full Stack Master! 🎓", description: "You've completed the entire bootcamp! Congratulations!" };
    if (completion >= 75) return { title: "Backend Developer! 💻", description: "You've mastered backend development concepts!" };
    if (completion >= 50) return { title: "JavaScript Ninja! ⚡", description: "You're getting great at JavaScript and DOM manipulation!" };
    if (completion >= 25) return { title: "HTML/CSS Wizard! 🧙‍♂️", description: "You've learned the fundamentals of web design!" };
    return { title: "Just Getting Started! 🌱", description: "Keep going! You're on the path to becoming a developer!" };
  };

  // Get data for display
  const userCompletion = calculateCompletion(userProgress);
  const categoryCompletion = getCategoryCompletion();
  const nextModule = getNextModule();
  const currentMilestone = getMilestone(userCompletion);
  
  // Random motivational quotes
  const quotes = [
    "The only way to learn a new programming language is by writing programs in it.",
    "The expert in anything was once a beginner.",
    "Code is like humor. When you have to explain it, it's bad.",
    "First, solve the problem. Then, write the code.",
    "Programming isn't about what you know; it's about what you can figure out."
  ];
  
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  
  // Format module start/mark complete buttons
  const handleModuleAction = (moduleId, status) => {
    // Call the update function with the new status
    const newStatus = status === 'in-progress' ? 'completed' : 'in-progress';
    console.log(`Setting module ${moduleId} to ${newStatus}`);
    updateModuleStatus(moduleId, newStatus);
  };
  
  // Get the device type to apply responsive styles
  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
  
  // Define common styles for reuse
  const styles = {
    pageContainer: {
      width: '100%', 
      margin: '0 auto', 
      padding: isMobile ? '10px' : '20px',
      backgroundColor: '#1e1e1e', 
      minHeight: 'calc(100vh - 70px)', 
      color: '#e0e0e0',
      borderRadius: '0px',
      maxWidth: isMobile ? '100%' : '1200px',
      overflow: 'hidden',
      boxSizing: 'border-box'
    },
    pageTitle: {
      fontSize: isMobile ? '1.5rem' : '2rem', 
      marginBottom: isMobile ? '15px' : '20px', 
      color: '#ffffff', 
      textAlign: 'center',
      fontWeight: '700'
    },
    welcomeBanner: {
      backgroundColor: '#2c2c2c', 
      padding: isMobile ? '15px' : '20px', 
      borderRadius: '10px', 
      textAlign: 'center',
      marginBottom: isMobile ? '20px' : '30px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
      border: '1px solid #3c3c3c'
    },
    welcomeTitle: {
      margin: '0',
      fontSize: isMobile ? '1.3rem' : '1.5rem',
      color: '#ffffff'
    },
    welcomeQuote: {
      color: '#b3b3b3',
      fontStyle: 'italic',
      margin: '10px 0 0',
      fontSize: isMobile ? '0.9rem' : '1rem'
    },
    cardsContainer: {
      display: 'grid', 
      gridTemplateColumns: isMobile ? '1fr' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(300px, 1fr))'), 
      gap: isMobile ? '15px' : '20px',
      marginBottom: isMobile ? '20px' : '30px'
    },
    card: {
      backgroundColor: '#2c2c2c', 
      borderRadius: '10px', 
      padding: isMobile ? '15px' : '20px', 
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
      border: '1px solid #3c3c3c'
    },
    cardTitle: {
      marginTop: '0',
      color: '#ffffff',
      fontSize: isMobile ? '1.1rem' : '1.25rem',
      marginBottom: '15px'
    },
    progressValue: {
      fontSize: isMobile ? '2rem' : '2.5rem',
      fontWeight: 'bold',
      color: '#4d9aff',
      marginBottom: '15px'
    },
    progressBar: {
      width: '100%', 
      height: '10px', 
      backgroundColor: '#3c3c3c', 
      borderRadius: '5px',
      marginBottom: '20px',
      overflow: 'hidden'
    },
    progressFill: (percentage, color = '#4d9aff') => ({
      width: `${percentage}%`, 
      height: '100%', 
      backgroundColor: color, 
      borderRadius: '5px',
      transition: 'width 0.5s ease-in-out'
    }),
    infoBox: (bgColor, borderColor) => ({
      backgroundColor: bgColor, 
      padding: isMobile ? '12px' : '15px', 
      borderRadius: '8px',
      borderLeft: `4px solid ${borderColor}`,
      marginTop: '10px'
    }),
    infoTitle: (color) => ({
      fontWeight: 'bold',
      color: color,
      fontSize: isMobile ? '0.95rem' : '1rem'
    }),
    infoText: {
      margin: '5px 0 0',
      color: '#b3b3b3',
      fontSize: isMobile ? '0.85rem' : '0.9rem'
    },
    actionButton: (bgColor) => ({
      backgroundColor: bgColor,
      color: 'white',
      border: 'none',
      width: '100%',
      padding: isMobile ? '10px' : '12px',
      borderRadius: '8px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      fontSize: isMobile ? '0.9rem' : '1rem'
    }),
    streakContainer: {
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      marginTop: '20px',
      marginBottom: '20px'
    },
    streakValue: (streak) => ({
      fontSize: isMobile ? '2.8rem' : '3.5rem',
      fontWeight: 'bold',
      color: streak >= 3 ? '#ff9d4d' : '#8a8a8a',
      display: 'flex',
      alignItems: 'center'
    }),
    streakLabel: {
      fontSize: isMobile ? '1rem' : '1.1rem',
      color: '#b3b3b3',
      marginTop: '5px'
    },
    weeklyContainer: {
      backgroundColor: '#2c2c2c', 
      borderRadius: '10px', 
      padding: isMobile ? '15px' : '20px', 
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
      marginBottom: isMobile ? '20px' : '30px',
      border: '1px solid #3c3c3c',
      overflow: 'hidden'
    },
    weeklyBars: {
      display: 'flex',
      justifyContent: 'center',
      height: isMobile ? '150px' : '200px',
      alignItems: 'flex-end',
      marginTop: '20px',
      gap: isMobile ? '10px' : '30px',
      overflow: 'auto',
      paddingBottom: '10px',
      // Added for mobile scrolling
      width: '100%',
      flexWrap: isMobile ? 'nowrap' : 'wrap',
      maxWidth: '100%'
    },
    weeklyBar: {
      flex: isMobile ? '0 0 70px' : '1 0 auto',
      maxWidth: isMobile ? '70px' : '100px',
      minWidth: isMobile ? '70px' : 'auto',
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: isMobile ? '0 5px' : '0 10px'
    },
    weeklyBarFill: (height, isCurrentUser) => ({
      width: '100%', 
      height: `${height}px`, 
      backgroundColor: isCurrentUser ? '#4d9aff' : '#4f4f4f',
      borderRadius: '6px 6px 0 0',
      minHeight: '20px',
      transition: 'height 0.5s ease-in-out'
    }),
    weeklyBarLabel: {
      padding: isMobile ? '5px' : '10px',
      color: '#b3b3b3',
      fontSize: isMobile ? '0.75rem' : '0.85rem',
      textAlign: 'center',
      marginTop: '5px',
      width: '100%'
    },
    categoryGrid: {
      display: 'grid', 
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', 
      gap: isMobile ? '10px' : '15px'
    },
    categoryCard: {
      backgroundColor: '#323232', 
      borderRadius: '8px', 
      padding: isMobile ? '12px' : '15px',
      border: '1px solid #3c3c3c'
    },
    categoryHeader: {
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: '10px'
    },
    categoryTitle: {
      fontWeight: '600',
      color: '#ffffff',
      fontSize: isMobile ? '0.9rem' : '1rem'
    },
    categoryBadge: (color) => ({
      backgroundColor: color, 
      color: 'white', 
      padding: isMobile ? '3px 8px' : '4px 10px', 
      borderRadius: '12px', 
      fontSize: isMobile ? '0.65rem' : '0.75rem',
      fontWeight: '600'
    }),
    categoryStats: {
      fontSize: isMobile ? '0.75rem' : '0.85rem',
      color: '#b3b3b3'
    },
    leaderboardTable: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '15px',
      fontSize: isMobile ? '0.85rem' : '1rem'
    },
    leaderboardHeader: {
      textAlign: 'left',
      padding: isMobile ? '8px 10px' : '10px 15px',
      backgroundColor: '#323232',
      color: '#e0e0e0',
      fontWeight: '600',
      borderBottom: '1px solid #444'
    },
    leaderboardCell: (isCurrentUser) => ({
      padding: isMobile ? '8px 10px' : '12px 15px',
      borderBottom: '1px solid #3c3c3c',
      backgroundColor: isCurrentUser ? 'rgba(77, 154, 255, 0.1)' : 'transparent'
    }),
    rankBadge: (rank) => {
      let color, emoji;
      
      switch(rank) {
        case 1:
          color = '#ffd700'; // Gold
          emoji = '🏆';
          break;
        case 2:
          color = '#c0c0c0'; // Silver
          emoji = '🥈';
          break;
        case 3:
          color = '#cd7f32'; // Bronze
          emoji = '🥉';
          break;
        default:
          color = '#718096';
          emoji = '';
      }
      
      return {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '3px 6px' : '4px 8px',
        backgroundColor: `${color}20`,
        color: color,
        borderRadius: '4px',
        fontWeight: '600',
        border: `1px solid ${color}`
      };
    },
    analyticsSummary: {
      backgroundColor: 'rgba(77, 154, 255, 0.1)',
      padding: isMobile ? '12px' : '15px',
      borderRadius: '8px',
      marginBottom: '20px',
      borderLeft: '4px solid #4d9aff'
    },
    summaryText: {
      color: '#e0e0e0',
      fontSize: isMobile ? '0.85rem' : '0.95rem'
    },
    highlightText: {
      color: '#4d9aff',
      fontWeight: '600'
    },
    tooltip: {
      position: 'absolute',
      backgroundColor: 'rgba(40, 40, 40, 0.95)',
      color: '#fff',
      padding: '10px',
      borderRadius: '4px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
      border: '1px solid #4d9aff',
      zIndex: 10,
      fontSize: '0.85rem',
      pointerEvents: 'none'
    },
    // New styles for responsive achievements section
    achievementContainer: {
      marginTop: '10px',
      marginBottom: '20px'
    },
    achievementHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: isMobile ? '15px' : '20px',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '10px' : '0'
    },
    achievementTitle: {
      color: '#ffffff',
      fontSize: isMobile ? '1.1rem' : '1.25rem',
      fontWeight: '600',
      margin: 0
    },
    toggleButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#4d9aff',
      cursor: 'pointer',
      padding: '5px 10px',
      borderRadius: '4px',
      fontSize: isMobile ? '0.8rem' : '0.9rem',
      transition: 'all 0.2s ease'
    },
    achievementGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: isMobile ? '10px' : '15px',
      overflow: 'auto',
      paddingBottom: '10px'
    },
    achievementCard: (unlocked, color) => ({
      backgroundColor: unlocked ? '#2c2c2c' : 'rgba(44, 44, 44, 0.5)',
      borderRadius: '8px',
      padding: isMobile ? '10px' : '15px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: isMobile ? '5px' : '10px',
      boxShadow: unlocked ? '0 4px 6px rgba(0,0,0,0.2)' : 'none',
      border: unlocked ? `2px solid ${color}` : '2px solid #3c3c3c',
      opacity: unlocked ? 1 : 0.7,
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }),
    achievementIcon: {
      fontSize: isMobile ? '1.5rem' : '2rem',
      marginBottom: isMobile ? '3px' : '5px'
    },
    achievementCardTitle: {
      color: '#ffffff',
      fontSize: isMobile ? '0.8rem' : '0.9rem',
      fontWeight: '600',
      marginBottom: '2px',
      lineHeight: '1.2'
    },
    achievementDescription: {
      color: '#b3b3b3',
      fontSize: isMobile ? '0.7rem' : '0.8rem',
      lineHeight: '1.2'
    },
    achievementCounter: {
      color: '#b3b3b3',
      fontSize: isMobile ? '0.8rem' : '0.9rem',
      marginTop: '10px',
      textAlign: 'center'
    },
    // Mobile-specific table adjustments
    responsiveTable: {
      overflowX: isMobile ? 'auto' : 'visible',
      width: '100%',
      display: 'block'
    },
    // Styles for analytical charts
    chartContainer: {
      height: isMobile ? '250px' : '300px', 
      position: 'relative',
      marginTop: '20px'
    }
  };
  
  // Calculate max value for weekly chart
  const maxWeeklyValue = Math.max(...weeklyData.map(user => user.thisWeek), 1);
  const chartScale = isMobile ? 120 : 150; // Maximum chart height in pixels
  
return (
    <div style={{
      backgroundColor: '#1e1e1e',
      width: '100%',
      margin: 0,
      padding: 0,
      minHeight: 'calc(100vh - 70px)',
      overflowX: 'hidden'
    }}>
      <div style={styles.pageContainer}>
        <h1 style={styles.pageTitle}>
          Web Development Bootcamp Tracker
        </h1>
        
        {/* Welcome Banner */}
        <div style={styles.welcomeBanner}>
          <h2 style={styles.welcomeTitle}>Welcome, {currentUser?.name || 'User'}!</h2>
          <p style={styles.welcomeQuote}>"{randomQuote}"</p>
        </div>
        
        {/* Main Dashboard Cards */}
        <div style={styles.cardsContainer}>
          {/* Overall Progress Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Overall Progress</h3>
            <div style={styles.progressValue}>
              {userCompletion}%
            </div>
            <div style={styles.progressBar}>
              <div style={styles.progressFill(userCompletion)} />
            </div>
            <div style={styles.infoBox('#213547', '#4d9aff')}>
              <div style={styles.infoTitle('#4d9aff')}>{currentMilestone.title}</div>
              <p style={styles.infoText}>{currentMilestone.description}</p>
            </div>
          </div>
          

          
          {/* Current Streak Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Current Streak</h3>
            <div style={styles.streakContainer}>
              <div style={styles.streakValue(currentUser?.streak || 0)}>
                {currentUser?.streak || 0} {currentUser?.streak >= 3 && '🔥'}
              </div>
              <div style={styles.streakLabel}>days</div>
            </div>
            <div style={styles.infoBox('#352918', '#ff9d4d')}>
              <p style={{...styles.infoText, textAlign: 'center', color: '#ffcc99'}}>
                {currentUser?.streak >= 3 
                  ? "You're on fire! Keep the momentum going!" 
                  : "Study consistently to build your streak!"}
              </p>
            </div>
          </div>
          
          {/* Next Module Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Next Module</h3>
            <div style={
              styles.infoBox(
                nextModule.status === 'in-progress' ? '#352918' : '#18352a',
                nextModule.status === 'in-progress' ? '#ff9d4d' : '#4dff9d'
              )
            }>
              <div style={
                styles.infoTitle(
                  nextModule.status === 'in-progress' ? '#ffcc99' : '#99ffcc'
                )
              }>
                {nextModule.status === 'in-progress' ? 'Currently Learning:' : 'Next Up:'}
              </div>
              <div style={{color: '#e6e6e6', marginTop: '5px'}}>{nextModule.title}</div>
            </div>
            <div style={{marginTop: '20px'}}>
              <button 
                onClick={() => handleModuleAction(nextModule.id, nextModule.status)}
                style={
                  styles.actionButton(
                    nextModule.status === 'in-progress' ? '#4dff9d' : '#4d9aff'
                  )
                }
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                }}
              >
                {nextModule.status === 'in-progress' ? 'Mark as Completed' : 'Start Module'}
              </button>
            </div>
          </div>
        </div>
        
{/* Achievements - UPDATED FOR MOBILE */}
       <div style={styles.weeklyContainer}>
         <div style={styles.achievementHeader}>
           <h3 style={styles.achievementTitle}>Your Achievements</h3>
           <button 
             style={styles.toggleButton}
             onClick={() => setShowAllAchievements(!showAllAchievements)}
             onMouseOver={(e) => {
               e.currentTarget.style.backgroundColor = 'rgba(77, 154, 255, 0.1)';
             }}
             onMouseOut={(e) => {
               e.currentTarget.style.backgroundColor = 'transparent';
             }}
           >
             {showAllAchievements ? 'Show Unlocked Only' : 'Show All Achievements'}
           </button>
         </div>
         
         <div style={styles.achievementGrid}>
           {userAchievements && allAchievements && (showAllAchievements ? allAchievements : allAchievements.filter(a => userAchievements.includes(a.id))).map((achievement) => {
             const isUnlocked = userAchievements && userAchievements.includes(achievement.id);
             
             return (
               <div 
                 key={achievement.id} 
                 style={styles.achievementCard(isUnlocked, achievement.color)}
                 onMouseOver={(e) => {
                   if (isUnlocked) {
                     e.currentTarget.style.transform = 'translateY(-3px)';
                     e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
                   }
                 }}
                 onMouseOut={(e) => {
                   if (isUnlocked) {
                     e.currentTarget.style.transform = 'translateY(0)';
                     e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
                   }
                 }}
               >
                 <div style={styles.achievementIcon}>{achievement.icon}</div>
                 <div style={styles.achievementCardTitle}>{achievement.title}</div>
                 <div style={styles.achievementDescription}>{achievement.description}</div>
                 
                 {!isUnlocked && (
                   <div style={{
                     fontSize: isMobile ? '0.7rem' : '0.8rem',
                     color: '#999',
                     marginTop: '5px'
                   }}>
                     🔒 Not yet unlocked
                   </div>
                 )}
               </div>
             );
           })}
         </div>
         
         <div style={styles.achievementCounter}>
           {userAchievements ? userAchievements.length : 0} / {allAchievements ? allAchievements.length : 0} achievements unlocked
         </div>
       </div>

       {/* Weekly Progress Chart - IMPROVED VERSION */}
       <div style={styles.weeklyContainer}>
         <h3 style={styles.cardTitle}>This Week's Progress</h3>
         
         {/* Weekly bars with horizontal scrolling and hidden scrollbar */}
         <div style={{
           position: 'relative',
           height: isMobile ? '150px' : '200px',
           marginTop: '20px',
           marginBottom: '10px',
           overflowX: 'auto',
           overflowY: 'hidden',
           msOverflowStyle: 'none',  /* IE and Edge */
           scrollbarWidth: 'none',  /* Firefox */
           WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
           '&::-webkit-scrollbar': { display: 'none' }  /* Chrome, Safari */
         }} className="scrollable-container">
           <div style={{
             display: 'flex',
             height: '100%',
             alignItems: 'flex-end',
             gap: isMobile ? '10px' : '30px',
             padding: '0 10px',
             minWidth: weeklyData.length > 4 ? `${weeklyData.length * (isMobile ? 80 : 100)}px` : '100%',
             justifyContent: weeklyData.length <= 4 ? 'center' : 'flex-start'
           }}>
             {weeklyData.map((user, index) => (
               <div key={index} style={{
                 flex: '0 0 auto',
                 width: isMobile ? '70px' : '90px',
                 height: '100%',
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: 'center',
                 justifyContent: 'flex-end'
               }}>
                 <div style={{
                   width: '100%',
                   height: `${(user.thisWeek / maxWeeklyValue) * 100}%`, // Percentage-based height
                   backgroundColor: user.isCurrentUser ? '#4d9aff' : 
                                index === 0 ? '#4dff9d' : 
                                index === 1 ? '#ff9d4d' : '#4f4f4f',
                   borderRadius: '6px 6px 0 0',
                   minHeight: user.thisWeek > 0 ? '20px' : '0',
                   transition: 'height 0.5s ease-in-out'
                 }} />
                 <div style={styles.weeklyBarLabel}>
                   <div style={{ 
                     color: user.isCurrentUser ? '#ffffff' : '#b3b3b3', 
                     fontWeight: user.isCurrentUser ? '600' : '400',
                     whiteSpace: 'nowrap',
                     overflow: 'hidden',
                     textOverflow: 'ellipsis',
                     maxWidth: isMobile ? '60px' : '90px'
                   }}>
                     {user.name} {user.isCurrentUser && '(You)'}
                   </div>
                   <div style={{ 
                     color: user.isCurrentUser ? '#ffffff' : '#b3b3b3', 
                     fontWeight: user.isCurrentUser ? '600' : '400',
                     marginTop: '2px'
                   }}>
                     {user.thisWeek} {user.thisWeek === 1 ? 'mod.' : 'mods.'}
                   </div>
                 </div>
               </div>
             ))}
           </div>
         </div>
         
         <div style={{ textAlign: 'center', marginTop: '20px', color: '#b3b3b3', fontSize: isMobile ? '0.85rem' : '1rem' }}>
           {weeklyData.length <= 1 ? 
             "Invite your teammates to join and track their progress!" : 
             `${weeklyData[0].name} is leading this week with ${weeklyData[0].thisWeek} modules completed!`
           }
         </div>
       </div>

       {/* Leaderboard - MOBILE OPTIMIZED */}
       <div style={styles.weeklyContainer}>
         <h3 style={styles.cardTitle}>Leaderboard</h3>
         <div style={styles.responsiveTable}>
           <table style={styles.leaderboardTable}>
             <thead>
               <tr>
                 <th style={{...styles.leaderboardHeader, width: isMobile ? '40px' : 'auto'}}>Rank</th>
                 <th style={styles.leaderboardHeader}>Name</th>
                 <th style={styles.leaderboardHeader}>Progress</th>
                 {!isMobile && (
                   <th style={styles.leaderboardHeader}>Modules</th>
                 )}
                 <th style={styles.leaderboardHeader}>Streak</th>
               </tr>
             </thead>
             <tbody>
               {leaderboardData.map((user, index) => (
                 <tr key={index}>
                   <td style={styles.leaderboardCell(user.isCurrentUser)}>
                     <span style={styles.rankBadge(index + 1)}>
                       {index < 3 ? ['🏆', '🥈', '🥉'][index] : (index + 1)}
                     </span>
                   </td>
                   <td style={{...styles.leaderboardCell(user.isCurrentUser), fontWeight: user.isCurrentUser ? '600' : '400'}}>
                     {isMobile ? (user.name.length > 10 ? `${user.name.substring(0, 8)}...` : user.name) : user.name} {user.isCurrentUser && '(You)'}
                   </td>
                   <td style={styles.leaderboardCell(user.isCurrentUser)}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                       <span>{user.completion}%</span>
                       <div style={{ flex: 1, ...styles.progressBar, margin: 0 }}>
                         <div style={styles.progressFill(user.completion)} />
                       </div>
                     </div>
                   </td>
                   {!isMobile && (
                     <td style={styles.leaderboardCell(user.isCurrentUser)}>
                       {user.completedModules}/{courseModules.length}
                     </td>
                   )}
                   <td style={styles.leaderboardCell(user.isCurrentUser)}>
                     <span style={{ color: user.streak >= 3 ? '#ff9d4d' : '#8a8a8a' }}>
                       {user.streak} {!isMobile && 'days'} {user.streak >= 3 && '🔥'}
                     </span>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       </div>
       
       {/* Learning Analytics - MOBILE OPTIMIZED */}
       <div style={styles.weeklyContainer}>
         <h3 style={styles.cardTitle}>
           <span style={{ marginRight: '10px' }}>📊</span>
           Learning Analytics
         </h3>
         
         <div style={styles.analyticsSummary}>
           <p style={styles.summaryText}>
             You've studied for <span style={styles.highlightText}>{weeklyStudyHours.toFixed(1)} hours</span> in the last week. 
             Consistent daily practice, even in short sessions, is key to mastering programming skills.
           </p>
         </div>
         
         {/* Daily Study Hours Chart - MOBILE OPTIMIZED */}
         <div style={{ marginTop: '20px' }}>
           <div style={{ marginBottom: '10px', color: '#ffffff', fontSize: isMobile ? '1rem' : '1.1rem' }}>
             Daily Study Hours (Last Week)
           </div>
           
           <div style={{ 
             height: isMobile ? '250px' : '300px', 
             backgroundColor: '#272727',
             borderRadius: '8px', 
             padding: isMobile ? '15px 10px' : '20px', 
             position: 'relative',
             border: '1px solid #3c3c3c',
             overflow: 'hidden'
           }}>
             {/* Y-axis labels */}
             <div style={{ 
               position: 'absolute',
               left: isMobile ? '5px' : '10px',
               top: 0,
               bottom: '30px',
               width: isMobile ? '25px' : '30px',
               display: 'flex',
               flexDirection: 'column-reverse',
               justifyContent: 'space-between',
               paddingTop: '10px',
               paddingBottom: '10px'
             }}>
               {[0, 0.75, 1.5, 2.25, 3].map(value => (
                 <div key={value} style={{ color: '#999', fontSize: isMobile ? '0.7rem' : '0.8rem' }}>{value}</div>
               ))}
             </div>
             
             {/* Grid lines */}
             <div style={{ 
               position: 'absolute',
               left: isMobile ? '30px' : '50px',
               right: '10px',
               top: '10px',
               bottom: '30px',
               display: 'flex',
               flexDirection: 'column-reverse',
               justifyContent: 'space-between'
             }}>
               {[0, 0.75, 1.5, 2.25, 3].map((value, i) => (
                 <div key={i} style={{ 
                   width: '100%', 
                   borderBottom: i === 0 ? '1px solid #444' : '1px dashed #333',
                   height: 0
                 }} />
               ))}
             </div>

             {/* Interactive hover areas */}
             <div style={{
               position: 'absolute',
               left: isMobile ? '30px' : '50px',
               right: '10px',
               top: '10px',
               bottom: '30px',
               display: 'flex',
               justifyContent: 'space-between',
               zIndex: 3
             }}>
               {studyHoursData.map((day, i) => (
                 <div 
                   key={i}
                   style={{
                     height: '100%',
                     flex: 1,
                     cursor: 'pointer'
                   }}
                   onMouseEnter={() => setHoveredDay(i)}
                   onMouseLeave={() => setHoveredDay(null)}
                   onTouchStart={() => setHoveredDay(i)}
                   onTouchEnd={() => setTimeout(() => setHoveredDay(null), 2000)}
                 />
               ))}
             </div>
             
             {/* Hover tooltips */}
             {hoveredDay !== null && (
               <div style={{
                 ...styles.tooltip,
                 left: `${(isMobile ? 30 : 50) + (hoveredDay * (100 - (isMobile ? 40 : 70)) / (studyHoursData.length - 1)) + (isMobile ? 20 : 35)}px`,
                 top: '40px'
               }}>
                 <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                   {studyHoursData[hoveredDay].day}
                 </div>
                 <div>
                   Hours: <span style={{ color: '#ff9d4d', fontWeight: 'bold' }}>
                     {studyHoursData[hoveredDay].hours.toFixed(1)}
                   </span>
                 </div>
                 {studyHoursData[hoveredDay].hours > 0 && (
                   <div style={{ fontSize: '0.8rem', marginTop: '5px', color: '#aaa' }}>
                     ({(studyHoursData[hoveredDay].hours / 1.5).toFixed(0)} modules)
                   </div>
                 )}
               </div>
             )}

             {/* SVG for smooth line chart - FIXED FOR MOBILE */}
             <svg 
               style={{ 
                 position: 'absolute',
                 left: isMobile ? '30px' : '50px',
                 right: '10px',
                 top: '10px',
                 bottom: '30px',
                 width: `calc(100% - ${isMobile ? '40' : '60'}px)`,
                 height: 'calc(100% - 40px)',
                 overflow: 'visible'
               }}
               viewBox="0 0 6 3"
               preserveAspectRatio="none"
             >
               {/* Chart area background */}
               <rect
                 x="0" y="0" width="6" height="3"
                 fill="transparent"
               />
               
               {/* Create smooth curve */}
               <path
                 d={`
                   M 0 ${3 - Math.min(studyHoursData[0].hours, 2.99)}
                   ${studyHoursData.slice(1).map((point, i) => {
                     // Control points for smooth bezier curves
                     const prevX = i;
                     const prevY = 3 - Math.min(studyHoursData[i].hours, 2.99);
                     const currX = i + 1;
                     const currY = 3 - Math.min(point.hours, 2.99);
                     
                     // Calculate control points
                     const cp1x = prevX + 0.5;
                     const cp1y = prevY;
                     const cp2x = currX - 0.5;
                     const cp2y = currY;
                     
                     return `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${currX} ${currY}`;
                   }).join(' ')}
                 `}
                 fill="none"
                 stroke="#ff9d4d"
                 strokeWidth="0.06"
                 strokeLinecap="round"
                 strokeLinejoin="round"
               />
               
               {/* Area under the curve with gradient */}
               <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stopColor="#ff9d4d" stopOpacity="0.4" />
                 <stop offset="100%" stopColor="#ff9d4d" stopOpacity="0.05" />
               </linearGradient>
               
               <path
                 d={`
                   M 0 ${3 - Math.min(studyHoursData[0].hours, 2.99)}
                   ${studyHoursData.slice(1).map((point, i) => {
                     // Control points for smooth bezier curves
                     const prevX = i;
                     const prevY = 3 - Math.min(studyHoursData[i].hours, 2.99);
                     const currX = i + 1;
                     const currY = 3 - Math.min(point.hours, 2.99);
                     
                     // Calculate control points
                     const cp1x = prevX + 0.5;
                     const cp1y = prevY;
                     const cp2x = currX - 0.5;
                     const cp2y = currY;
                     
                     return `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${currX} ${currY}`;
                   }).join(' ')}
                   L 6 3
                   L 0 3
                   Z
                 `}
                 fill="url(#areaGradient)"
                 stroke="none"
               />
               
               {/* Data points */}
               {studyHoursData.map((point, i) => (
                 <circle
                   key={i}
                   cx={i}
                   cy={3 - Math.min(point.hours, 2.99)}
                   r={hoveredDay === i ? "0.08" : "0.05"}
                   fill={hoveredDay === i ? "#ffffff" : "#ff9d4d"}
                   stroke={hoveredDay === i ? "#ff9d4d" : "none"}
                   strokeWidth="0.02"
                 />
               ))}
             </svg>
             
             {/* X-axis labels */}
             <div style={{ 
               position: 'absolute',
               left: isMobile ? '30px' : '50px',
               right: '10px',
               bottom: '5px',
               display: 'flex',
               justifyContent: 'space-between'
             }}>
               {studyHoursData.map((day, i) => (
                 <div 
                   key={i} 
                   style={{ 
                     color: hoveredDay === i ? '#ffffff' : '#999', 
                     fontSize: isMobile ? '0.7rem' : '0.8rem',
                     fontWeight: hoveredDay === i ? 'bold' : 'normal'
                   }}
                 >
                   {day.day}
                 </div>
               ))}
             </div>
           </div>
           
           {/* Legend */}
           <div style={{ 
             display: 'flex', 
             alignItems: 'center', 
             justifyContent: 'center',
             marginTop: '15px',
             color: '#b3b3b3',
             fontSize: isMobile ? '0.8rem' : '0.9rem'
           }}>
             <div style={{ 
               width: '20px', 
               height: '3px', 
               backgroundColor: '#ff9d4d', 
               marginRight: '8px' 
             }} />
             <span>Study Hours</span>
           </div>
         </div>
       </div>
         
       {/* Category Progress Section - MOBILE OPTIMIZED */}
       <div style={styles.weeklyContainer}>
         <h3 style={styles.cardTitle}>Progress by Category</h3>
         <div style={styles.categoryGrid}>
           {categoryCompletion.map((category, index) => {
             return (
               <div 
                 key={index} 
                 style={styles.categoryCard}
                 onMouseEnter={() => setHoveredCategory(index)}
                 onMouseLeave={() => setHoveredCategory(null)}
               >
                 <div style={styles.categoryHeader}>
                   <div>
                     <div style={styles.categoryTitle}>{category.name}</div>
                   </div>
                   <div style={styles.categoryBadge(category.color)}>
                     {category.percentage}%
                   </div>
                 </div>
                 <div style={styles.progressBar}>
                   <div style={styles.progressFill(category.percentage, category.color)} />
                 </div>
                 <div style={styles.categoryStats}>
                   {category.completed}/{category.total} modules completed
                 </div>
               </div>
             );
           })}
         </div>
       </div>
     </div>
   </div>
 );
}

export default Dashboard;