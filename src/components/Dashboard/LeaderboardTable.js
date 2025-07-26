import React from 'react';
import { courseModules } from '../../constants/courseData';

const LeaderboardTable = ({ allUsersProgress, currentUser }) => {
  const isMobile = window.innerWidth <= 768;
  
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
        completion: calculateCompletion(currentUser?.progress || []),
        completedModules: (currentUser?.progress || []).filter(p => p.status === 'completed').length,
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
  
  const styles = {
    container: {
      backgroundColor: '#2c2c2c', 
      borderRadius: '10px', 
      padding: isMobile ? '15px' : '20px', 
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
      marginBottom: isMobile ? '20px' : '30px',
      border: '1px solid #3c3c3c'
    },
    title: {
      color: '#ffffff',
      fontSize: isMobile ? '1.1rem' : '1.25rem',
      marginTop: 0,
      marginBottom: '15px'
    },
    tableWrapper: {
      overflowX: isMobile ? 'auto' : 'visible',
      width: '100%',
      display: 'block'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '15px',
      fontSize: isMobile ? '0.85rem' : '1rem'
    },
    headerCell: {
      textAlign: 'left',
      padding: isMobile ? '8px 10px' : '10px 15px',
      backgroundColor: '#323232',
      color: '#e0e0e0',
      fontWeight: '600',
      borderBottom: '1px solid #444'
    },
    rankCell: {
      width: isMobile ? '40px' : 'auto'
    },
    cell: (isCurrentUser) => ({
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
          break;
        case 3:
          color = '#cd7f32'; // Bronze
          break;
        default:
          color = '#718096';
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
    userName: (isCurrentUser) => ({
      fontWeight: isCurrentUser ? '600' : '400'
    }),
    progressCell: {
      display: 'flex', 
      alignItems: 'center', 
      gap: '10px'
    },
    progressBar: {
      width: '100%', 
      height: '10px', 
      backgroundColor: '#3c3c3c', 
      borderRadius: '5px',
      overflow: 'hidden',
      margin: 0
    },
    progressFill: (percentage) => ({
      width: `${percentage}%`, 
      height: '100%', 
      backgroundColor: '#4d9aff', 
      borderRadius: '5px',
      transition: 'width 0.5s ease-in-out'
    }),
    streakValue: (streak) => ({
      color: streak >= 3 ? '#ff9d4d' : '#8a8a8a'
    })
  };
  
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Leaderboard</h3>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{...styles.headerCell, ...styles.rankCell}}>Rank</th>
              <th style={styles.headerCell}>Name</th>
              <th style={styles.headerCell}>Progress</th>
              {!isMobile && (
                <th style={styles.headerCell}>Modules</th>
              )}
              <th style={styles.headerCell}>Streak</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((user, index) => (
              <tr key={index}>
                <td style={styles.cell(user.isCurrentUser)}>
                  <span style={styles.rankBadge(index + 1)}>
                    {index < 3 ? ['🏆', '🥈', '🥉'][index] : (index + 1)}
                  </span>
                </td>
                <td style={{...styles.cell(user.isCurrentUser), ...styles.userName(user.isCurrentUser)}}>
                  {isMobile ? (user.name.length > 10 ? `${user.name.substring(0, 8)}...` : user.name) : user.name} {user.isCurrentUser && '(You)'}
                </td>
                <td style={styles.cell(user.isCurrentUser)}>
                  <div style={styles.progressCell}>
                    <span>{user.completion}%</span>
                    <div style={{ flex: 1 }}>
                      <div style={styles.progressBar}>
                        <div style={styles.progressFill(user.completion)} />
                      </div>
                    </div>
                  </div>
                </td>
                {!isMobile && (
                  <td style={styles.cell(user.isCurrentUser)}>
                    {user.completedModules}/{courseModules.length}
                  </td>
                )}
                <td style={styles.cell(user.isCurrentUser)}>
                  <span style={styles.streakValue(user.streak)}>
                    {user.streak} {!isMobile && 'days'} {user.streak >= 3 && '🔥'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;