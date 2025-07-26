import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../Auth/AuthContext';
import { ProgressContext } from '../../context/ProgressContext';
import DashboardHeader from './DashboardHeader';
import ProgressSummaryCards from './ProgressSummaryCards';
import AchievementsPanel from './AchievementsPanel';
import WeeklyProgressChart from './WeeklyProgressChart';
import LeaderboardTable from './LeaderboardTable';
import StudyAnalytics from './StudyAnalytics';
import CategoryProgress from './CategoryProgress';
import MotivationMascot from '../MotivationMascot';

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const { userProgress, allUsersProgress, userAchievements, recentModuleCompletion, isLoading } = useContext(ProgressContext) || {
    userProgress: [],
    allUsersProgress: [],
    userAchievements: [],
    recentModuleCompletion: false
  };
  
  const [justCompletedLesson, setJustCompletedLesson] = useState(false);
  
  // Device detection for responsive design
  const isMobile = window.innerWidth <= 768;
  
  // Calculate user's position in leaderboard
  const getUserLeaderboardPosition = () => {
    if (!currentUser || !allUsersProgress.length) return null;
    
    // Sort users by progress (completed modules)
    const sortedUsers = [...allUsersProgress].sort((a, b) => {
      const aCompleted = a.progress ? a.progress.filter(p => p.status === 'completed').length : 0;
      const bCompleted = b.progress ? b.progress.filter(p => p.status === 'completed').length : 0;
      return bCompleted - aCompleted;
    });
    
    const userPosition = sortedUsers.findIndex(user => user.id === currentUser.uid) + 1;
    return userPosition > 0 ? userPosition : null;
  };
  
  const userPosition = getUserLeaderboardPosition();
  const totalUsers = allUsersProgress.length;
  
  // Get user's name from different sources
  const getUserName = () => {
    // Try different sources for user name
    if (currentUser?.displayName) return currentUser.displayName;
    if (currentUser?.email) {
      // Extract name from email if available
      const emailName = currentUser.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    return null;
  };

  // Get the date of the user's last completed lesson
  const getLastCompletionDate = () => {
    if (!userProgress || userProgress.length === 0) return null;
    
    const completedLessons = userProgress.filter(p => p.status === 'completed');
    if (completedLessons.length === 0) return null;
    
    // Sort by completion date and get the most recent
    const sortedCompletions = completedLessons.sort((a, b) => {
      const dateA = a.completedAt ? new Date(a.completedAt) : new Date(0);
      const dateB = b.completedAt ? new Date(b.completedAt) : new Date(0);
      return dateB - dateA;
    });
    
    return sortedCompletions[0]?.completedAt || null;
  };
  
  // Listen for lesson completions (this would be triggered from completion actions)
  useEffect(() => {
    if (justCompletedLesson) {
      const timer = setTimeout(() => {
        setJustCompletedLesson(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [justCompletedLesson]);
  
  return (
    <div style={{
      backgroundColor: '#1e1e1e',
      width: '100%',
      margin: 0,
      padding: 0, // Remove padding here
    }}>
      <div style={{
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
      }}>
          <h1 style={{
        fontSize: isMobile ? '1.4rem' : '1.8rem', // Smaller heading
        marginTop: '5px', // Reduced top margin
        marginBottom: isMobile ? '10px' : '15px', // Reduced bottom margin
        color: '#ffffff', 
        textAlign: 'center',
        fontWeight: '700'
      }}>
        Course Tracker
      </h1>
        
        <DashboardHeader currentUser={currentUser} />
        
        <ProgressSummaryCards 
          userProgress={userProgress} 
          currentUser={currentUser}
        />
        
        <AchievementsPanel 
          userAchievements={userAchievements} 
        />
        
        <WeeklyProgressChart 
          userProgress={userProgress}
          allUsersProgress={allUsersProgress}
          currentUser={currentUser}
        />
        
        <LeaderboardTable 
          allUsersProgress={allUsersProgress}
          currentUser={currentUser}
        />
        
        {/* Motivation Mascot - Personal encouragement for current user */}
        <MotivationMascot
          userName={getUserName()}
          lastCompletionDate={getLastCompletionDate()}
          justCompletedModule={recentModuleCompletion}
          isLoading={isLoading}
        />
        
        <StudyAnalytics 
        userProgress={userProgress}
        allUsersProgress={allUsersProgress}
        currentUser={currentUser}
       />
        
        <CategoryProgress 
          userProgress={userProgress}
        />
      </div>
    </div>
  );
};

export default Dashboard;