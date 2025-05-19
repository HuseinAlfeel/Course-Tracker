import React, { useContext } from 'react';
import { AuthContext } from '../Auth/AuthContext';
import { ProgressContext } from '../../context/ProgressContext';
import DashboardHeader from './DashboardHeader';
import ProgressSummaryCards from './ProgressSummaryCards';
import AchievementsPanel from './AchievementsPanel';
import WeeklyProgressChart from './WeeklyProgressChart';
import LeaderboardTable from './LeaderboardTable';
import StudyAnalytics from './StudyAnalytics';
import CategoryProgress from './CategoryProgress';

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const { userProgress, allUsersProgress, userAchievements } = useContext(ProgressContext) || {
    userProgress: [],
    allUsersProgress: [],
    userAchievements: []
  };
  
  // Device detection for responsive design
  const isMobile = window.innerWidth <= 768;
  
  return (
    <div style={{
      backgroundColor: '#1e1e1e',
      width: '100%',
      margin: 0,
      padding: 0,
      minHeight: 'calc(100vh - 70px)',
      overflowX: 'hidden'
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
          fontSize: isMobile ? '1.5rem' : '2rem', 
          marginBottom: isMobile ? '15px' : '20px', 
          color: '#ffffff', 
          textAlign: 'center',
          fontWeight: '700'
        }}>
          Web Development Bootcamp Tracker
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