import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../Auth/AuthContext';
import { ProgressContext } from '../../context/ProgressContext';
import { courseModules } from '../../constants/courseData';

// This component handles the Weekly Progress Chart specifically
const WeeklyProgressChart = () => {
  const { currentUser } = useContext(AuthContext);
  const { userProgress, allUsersProgress } = useContext(ProgressContext) || { 
    userProgress: [], 
    allUsersProgress: []
  };
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const containerRef = useRef(null);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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
  
  // Calculate max value for scaling bars properly
  const maxWeeklyValue = Math.max(...weeklyData.map(user => user.thisWeek), 1);
  
  // Calculate bar height as percentage of container height
  const getBarHeight = (value) => {
    // Use percentage-based height - this ensures bars always fit in the container
    return (value / maxWeeklyValue) * 100;
  };
  
  return (
    <div className="chart-container">
      <h3 className="chart-title">This Week's Progress</h3>
      
      <div 
        ref={containerRef}
        className="weekly-bars-container scrollable-container"
      >
        <div className="weekly-bars">
          {weeklyData.map((user, index) => (
            <div key={index} className="weekly-bar">
              <div 
                className="weekly-bar-fill"
                style={{
                  height: `${getBarHeight(user.thisWeek)}%`,
                  backgroundColor: user.isCurrentUser ? '#4d9aff' : 
                                  index === 0 ? '#4dff9d' : 
                                  index === 1 ? '#ff9d4d' : '#4f4f4f',
                  minHeight: user.thisWeek > 0 ? '20px' : '0'
                }}
              />
              <div className="weekly-bar-label">
                <div style={{ 
                  color: user.isCurrentUser ? '#ffffff' : '#b3b3b3', 
                  fontWeight: user.isCurrentUser ? '600' : '400',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100px'
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
      
      <div className="chart-summary">
        {weeklyData.length <= 1 ? 
          "Invite your teammates to join and track their progress!" : 
          `${weeklyData[0].name} is leading this week with ${weeklyData[0].thisWeek} modules completed!`
        }
      </div>
    </div>
  );
};

export default WeeklyProgressChart;