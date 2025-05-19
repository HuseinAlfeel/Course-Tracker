import React, { useState, useRef } from 'react';

const WeeklyProgressChart = ({ userProgress, allUsersProgress, currentUser }) => {
  const isMobile = window.innerWidth <= 768;
  const [hoveredUser, setHoveredUser] = useState(null);
  const containerRef = useRef(null);
  
  // Directly calculate weekly completions from user progress data
  const calculateWeeklyCompletions = (progress) => {
    if (!progress || !Array.isArray(progress)) return 0;
    
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Find modules completed this week
    return progress.filter(module => {
      if (module.status !== 'completed' || !module.updatedAt) return false;
      
      const completedDate = new Date(module.updatedAt);
      return completedDate >= startOfWeek;
    }).length;
  };
  
  // Generate data for the chart with proper counts
  const generateWeeklyData = () => {
    // Handle case with no other users
    if (!allUsersProgress || allUsersProgress.length === 0) {
      const currentUserModules = calculateWeeklyCompletions(userProgress);
      return [{
        name: currentUser?.name || 'You',
        thisWeek: currentUserModules,
        isCurrentUser: true,
        color: '#4d9aff' // Blue for current user
      }];
    }
    
    // Create data for all users with proper counts
    const userData = allUsersProgress.map(user => {
      // Check if this is the current user
      const isCurrentUser = user.id === currentUser?.uid;
      
      // Use the user's progress if it's the current user, otherwise use progress from allUsersProgress
      const progress = isCurrentUser ? userProgress : user.progress;
      
      return {
        id: user.id,
        name: user.name || 'Anonymous',
        thisWeek: calculateWeeklyCompletions(progress),
        isCurrentUser,
        // Different colors based on ranking and current user
        color: isCurrentUser ? '#4d9aff' : null // Null means color will be assigned later
      };
    });
    
    // Sort by modules completed (highest first)
    const sortedData = userData.sort((a, b) => b.thisWeek - a.thisWeek);
    
    // Assign colors to non-current users based on rank
    const colors = ['#4dff9d', '#ff9d4d', '#c775ff', '#75c7ff', '#ffcc75'];
    let colorIndex = 0;
    
    return sortedData.map(user => {
      if (!user.color) {
        user.color = colors[colorIndex % colors.length];
        colorIndex++;
      }
      return user;
    });
  };
  
  const weeklyData = generateWeeklyData();
  
  // Calculate max value for scaling bars properly (minimum 1 for visualization)
  const maxWeeklyValue = Math.max(...weeklyData.map(user => user.thisWeek), 1);
  
  // Function to get tooltip position class based on index
  const getTooltipClass = (index, total) => {
    if (index === 0) return 'left';
    if (index === total - 1) return 'right';
    return 'center';
  };
  
  const styles = {
    container: {
      backgroundColor: '#2c2c2c', 
      borderRadius: '10px', 
      padding: isMobile ? '15px' : '20px', 
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
      marginBottom: isMobile ? '20px' : '30px',
      border: '1px solid #3c3c3c',
      overflow: 'visible', // Changed to visible to allow tooltips to show
      position: 'relative'
    },
    title: {
      color: '#ffffff',
      fontSize: isMobile ? '1.1rem' : '1.25rem',
      marginTop: 0,
      marginBottom: '15px'
    },
    barsContainer: {
      position: 'relative',
      height: isMobile ? '170px' : '200px', // Increased height
      marginTop: '40px', // Space for tooltips above
      marginBottom: '20px',
      paddingLeft: '10px',
      paddingRight: '10px',
    },
    barsWrapper: {
      height: '100%',
      position: 'relative',
    },
    bars: {
      display: 'flex',
      height: '100%',
      alignItems: 'flex-end',
      gap: isMobile ? '15px' : '35px',
      padding: '0 10px',
      minWidth: weeklyData.length > 4 ? `${weeklyData.length * (isMobile ? 85 : 100)}px` : '100%',
      justifyContent: weeklyData.length <= 4 ? 'center' : 'flex-start'
    },
    bar: (isHovered) => ({
      flex: '0 0 auto',
      width: isMobile ? '65px' : '80px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end',
      transition: 'transform 0.3s ease',
      position: 'relative'
    }),
    barColumn: {
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      justifyContent: 'flex-end',
    },
    barFill: (user, isHovered, heightPercentage) => {
      // We need to ensure the height is calculated correctly
      const height = user.thisWeek > 0 ? `${heightPercentage}%` : '3px';
      
      return {
        width: '100%',
        height: height, // This must control the bar height
        background: `linear-gradient(to top, ${user.color}99, ${user.color})`,
        borderRadius: '6px 6px 0 0',
        boxShadow: isHovered ? `0 0 15px ${user.color}80` : 'none',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        maxHeight: '100%', // Ensure it doesn't exceed container
        minHeight: user.thisWeek > 0 ? '30px' : '3px' // Minimum visible height
      };
    },
    barGlow: (color) => ({
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '60%',
      background: `linear-gradient(to top, ${color}, transparent)`,
      opacity: 0.5,
      zIndex: 2
    }),
    barLabel: {
      padding: isMobile ? '5px 0' : '10px 0',
      color: '#b3b3b3',
      fontSize: isMobile ? '0.75rem' : '0.85rem',
      textAlign: 'center',
      marginTop: '5px',
      width: '100%'
    },
    userName: (user, isHovered) => ({
      color: isHovered ? user.color : user.isCurrentUser ? '#ffffff' : '#b3b3b3', 
      fontWeight: user.isCurrentUser ? '600' : '400',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: isMobile ? '60px' : '80px',
      transition: 'color 0.3s ease'
    }),
    userScore: (user, isHovered) => ({
      color: isHovered ? user.color : user.isCurrentUser ? '#ffffff' : '#b3b3b3', 
      fontWeight: user.isCurrentUser || isHovered ? '600' : '400',
      marginTop: '2px',
      transition: 'color 0.3s ease'
    }),
    summary: {
      textAlign: 'center',
      marginTop: '15px',
      color: '#b3b3b3',
      fontSize: isMobile ? '0.85rem' : '0.95rem'
    },
    barTop: (user, isHovered) => ({
      width: '100%',
      height: '3px',
      backgroundColor: isHovered ? 'white' : user.color,
      borderRadius: '3px 3px 0 0',
      transition: 'background-color 0.3s ease'
    }),
    tooltip: {
      position: 'absolute',
      top: '-35px',
      backgroundColor: 'rgba(40, 40, 40, 0.95)',
      color: '#fff',
      padding: '6px 10px',
      borderRadius: '6px',
      fontSize: '0.8rem',
      boxShadow: '0 0 10px rgba(0,0,0,0.3)',
      whiteSpace: 'nowrap',
      zIndex: 10,
      pointerEvents: 'none',
      opacity: 0,
      visibility: 'hidden',
      transition: 'opacity 0.3s ease, visibility 0.3s ease',
      width: 'max-content', // Ensure it fits the content
    },
    tooltipLeft: {
      left: '0',
      transform: 'translateX(0)'
    },
    tooltipRight: {
      right: '0',
      left: 'auto',
      transform: 'translateX(0)'
    },
    tooltipCenter: {
      left: '50%',
      transform: 'translateX(-50%)'
    },
    visibleTooltip: {
      opacity: 1,
      visibility: 'visible'
    },
    scrollContainer: {
      overflowX: 'auto',
      overflowY: 'visible',
      paddingTop: '5px',
      paddingBottom: '10px',
      marginLeft: '-10px', 
      marginRight: '-10px',
      paddingLeft: '10px',
      paddingRight: '10px'
    }
  };
  
  return (
    <div style={styles.container} ref={containerRef}>
      <h3 style={styles.title}>This Week's Progress</h3>
      
      {/* Container with horizontal scrolling */}
      <div style={styles.scrollContainer} className="scrollable-container">
        <div style={styles.barsContainer}>
          <div style={styles.barsWrapper}>
            <div style={styles.bars}>
              {weeklyData.map((user, index) => {
                const isHovered = hoveredUser === index;
                // Calculate height based on completion count
                // Use a 0-100 scale with minimum height for visibility
                const heightPercentage = (user.thisWeek / maxWeeklyValue) * 80;
                const tooltipClass = getTooltipClass(index, weeklyData.length);
                
                return (
                  <div 
                    key={index} 
                    style={styles.bar(isHovered)}
                    onMouseEnter={() => setHoveredUser(index)}
                    onMouseLeave={() => setHoveredUser(null)}
                  >
                    <div style={styles.barColumn}>
                      <div style={{ position: 'relative', width: '100%' }}>
                        {/* Tooltip with position class */}
                        <div 
                          style={{
                            ...styles.tooltip,
                            ...(tooltipClass === 'left' ? styles.tooltipLeft : 
                              tooltipClass === 'right' ? styles.tooltipRight : 
                              styles.tooltipCenter),
                            ...(isHovered ? styles.visibleTooltip : {}),
                            border: `1px solid ${user.color}`
                          }}
                        >
                          {user.thisWeek} module{user.thisWeek !== 1 ? 's' : ''} completed
                        </div>
                      </div>
                      
                      {/* Actual bar that should rise based on value */}
                      <div style={styles.barFill(user, isHovered, heightPercentage)}>
                        {/* Bar top highlight */}
                        <div style={styles.barTop(user, isHovered)} />
                        
                        {/* Glow effect inside bar */}
                        <div style={styles.barGlow(user.color)} />
                      </div>
                    </div>
                    
                    <div style={styles.barLabel}>
                      <div style={styles.userName(user, isHovered)}>
                        {user.name} {user.isCurrentUser && '(You)'}
                      </div>
                      <div style={styles.userScore(user, isHovered)}>
                        {user.thisWeek} {user.thisWeek === 1 ? 'mod.' : 'mods.'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <div style={styles.summary}>
        {weeklyData.length <= 1 ? 
          "Invite your teammates to join and track their progress!" : 
          weeklyData[0].thisWeek > 0 ?
            `${weeklyData[0].name} is leading this week with ${weeklyData[0].thisWeek} modules completed!` :
            `No modules completed by anyone this week. Time to make progress!`
        }
      </div>
    </div>
  );
};

export default WeeklyProgressChart;