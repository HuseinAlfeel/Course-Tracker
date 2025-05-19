import React, { useState } from 'react';
import allAchievements from '../../constants/achievementData';

const AchievementsPanel = ({ userAchievements }) => {
  const [showAll, setShowAll] = useState(false);
  const isMobile = window.innerWidth <= 768;
  
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
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: isMobile ? '15px' : '20px',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '10px' : '0'
    },
    title: {
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
    grid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: isMobile ? '10px' : '15px',
      overflow: 'auto',
      paddingBottom: '10px'
    },
    card: (unlocked, color) => ({
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
    icon: {
      fontSize: isMobile ? '1.5rem' : '2rem',
      marginBottom: isMobile ? '3px' : '5px'
    },
    cardTitle: {
      color: '#ffffff',
      fontSize: isMobile ? '0.8rem' : '0.9rem',
      fontWeight: '600',
      marginBottom: '2px',
      lineHeight: '1.2'
    },
    description: {
      color: '#b3b3b3',
      fontSize: isMobile ? '0.7rem' : '0.8rem',
      lineHeight: '1.2'
    },
    lockedText: {
      fontSize: isMobile ? '0.7rem' : '0.8rem',
      color: '#999',
      marginTop: '5px'
    },
    counter: {
      color: '#b3b3b3',
      fontSize: isMobile ? '0.8rem' : '0.9rem',
      marginTop: '10px',
      textAlign: 'center'
    }
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Your Achievements</h3>
        <button 
          style={styles.toggleButton}
          onClick={() => setShowAll(!showAll)}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(77, 154, 255, 0.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {showAll ? 'Show Unlocked Only' : 'Show All Achievements'}
        </button>
      </div>
      
      <div style={styles.grid}>
        {userAchievements && allAchievements && 
          (showAll ? allAchievements : allAchievements.filter(a => userAchievements.includes(a.id)))
          .map((achievement) => {
            const isUnlocked = userAchievements && userAchievements.includes(achievement.id);
            
            return (
              <div 
                key={achievement.id} 
                style={styles.card(isUnlocked, achievement.color)}
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
                <div style={styles.icon}>{achievement.icon}</div>
                <div style={styles.cardTitle}>{achievement.title}</div>
                <div style={styles.description}>{achievement.description}</div>
                
                {!isUnlocked && (
                  <div style={styles.lockedText}>
                    🔒 Not yet unlocked
                  </div>
                )}
              </div>
            );
          })
        }
      </div>
      
      <div style={styles.counter}>
        {userAchievements ? userAchievements.length : 0} / {allAchievements ? allAchievements.length : 0} achievements unlocked
      </div>
    </div>
  );
};

export default AchievementsPanel;