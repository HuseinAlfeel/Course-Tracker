import React from 'react';
import dateUtils from '../../utils/dateUtils';

const WeeklyProgressChart = ({ userProgress, allUsersProgress, currentUser }) => {
  const isMobile = window.innerWidth <= 768;
  
  // Generate weekly data for all users
  const generateWeeklyData = () => {
    // If no other users, just show current user's data
    if (!allUsersProgress || allUsersProgress.length === 0) {
      return [
        {
          name: currentUser?.name || 'You',
          thisWeek: dateUtils.getWeeklyCompletionCount(userProgress),
          isCurrentUser: true
        }
      ];
    }
    
    // Create data for all users
    return allUsersProgress.map(user => ({
      name: user.name,
      thisWeek: dateUtils.getWeeklyCompletionCount(user.progress),
      isCurrentUser: user.id === currentUser?.uid
    })).sort((a, b) => b.thisWeek - a.thisWeek);
  };
  
  const weeklyData = generateWeeklyData();
  
  // Calculate max value for scaling bars properly
  const maxWeeklyValue = Math.max(...weeklyData.map(user => user.thisWeek), 1);
  
  const styles = {
    container: {
      backgroundColor: '#2c2c2c', 
      borderRadius: '10px', 
      padding: isMobile ? '15px' : '20px', 
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
      marginBottom: isMobile ? '20px' : '30px',
      border: '1px solid #3c3c3c',
      overflow: 'hidden'
    },
    title: {
      color: '#ffffff',
      fontSize: isMobile ? '1.1rem' : '1.25rem',
      marginTop: 0,
      marginBottom: '15px'
    },
    barsContainer: {
      position: 'relative',
      height: isMobile ? '150px' : '200px',
      marginTop: '20px',
      marginBottom: '10px',
      overflowX: 'auto',
      overflowY: 'hidden',
      msOverflowStyle: 'none',
      scrollbarWidth: 'none',
      WebkitOverflowScrolling: 'touch'
    },
    bars: {
      display: 'flex',
      height: '100%',
      alignItems: 'flex-end',
      gap: isMobile ? '10px' : '30px',
      padding: '0 10px',
      minWidth: weeklyData.length > 4 ? `${weeklyData.length * (isMobile ? 80 : 100)}px` : '100%',
      justifyContent: weeklyData.length <= 4 ? 'center' : 'flex-start'
    },
    bar: {
      flex: '0 0 auto',
      width: isMobile ? '70px' : '90px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end'
    },
    barFill: (user, index) => ({
      width: '100%',
      height: `${(user.thisWeek / maxWeeklyValue) * 100}%`,
      backgroundColor: user.isCurrentUser ? '#4d9aff' : 
                    index === 0 ? '#4dff9d' : 
                    index === 1 ? '#ff9d4d' : '#4f4f4f',
      borderRadius: '6px 6px 0 0',
      minHeight: user.thisWeek > 0 ? '20px' : '0',
      transition: 'height 0.5s ease-in-out'
    }),
    barLabel: {
      padding: isMobile ? '5px' : '10px',
      color: '#b3b3b3',
      fontSize: isMobile ? '0.75rem' : '0.85rem',
      textAlign: 'center',
      marginTop: '5px',
      width: '100%'
    },
    userName: (isCurrentUser) => ({
      color: isCurrentUser ? '#ffffff' : '#b3b3b3', 
      fontWeight: isCurrentUser ? '600' : '400',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: isMobile ? '60px' : '90px'
    }),
    userScore: (isCurrentUser) => ({
      color: isCurrentUser ? '#ffffff' : '#b3b3b3', 
      fontWeight: isCurrentUser ? '600' : '400',
      marginTop: '2px'
    }),
    summary: {
      textAlign: 'center',
      marginTop: '20px',
      color: '#b3b3b3',
      fontSize: isMobile ? '0.85rem' : '1rem'
    }
  };
  
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>This Week's Progress</h3>
      
      {/* Weekly bars with horizontal scrolling and hidden scrollbar */}
      <div style={styles.barsContainer} className="scrollable-container">
        <div style={styles.bars}>
          {weeklyData.map((user, index) => (
            <div key={index} style={styles.bar}>
              <div style={styles.barFill(user, index)} />
              <div style={styles.barLabel}>
                <div style={styles.userName(user.isCurrentUser)}>
                  {user.name} {user.isCurrentUser && '(You)'}
                </div>
                <div style={styles.userScore(user.isCurrentUser)}>
                  {user.thisWeek} {user.thisWeek === 1 ? 'mod.' : 'mods.'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div style={styles.summary}>
        {weeklyData.length <= 1 ? 
          "Invite your teammates to join and track their progress!" : 
          `${weeklyData[0].name} is leading this week with ${weeklyData[0].thisWeek} modules completed!`
        }
      </div>
    </div>
  );
};

export default WeeklyProgressChart;