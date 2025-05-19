import React from 'react';

const StudySummary = ({ weeklyStudyHours }) => {
  const isMobile = window.innerWidth <= 768;
  
  const styles = {
    container: {
      backgroundColor: 'rgba(77, 154, 255, 0.1)',
      padding: isMobile ? '12px' : '15px',
      borderRadius: '8px',
      marginBottom: '20px',
      borderLeft: '4px solid #4d9aff'
    },
    text: {
      color: '#e0e0e0',
      fontSize: isMobile ? '0.85rem' : '0.95rem',
      margin: 0
    },
    highlight: {
      color: '#4d9aff',
      fontWeight: '600'
    }
  };
  
  return (
    <div style={styles.container}>
      <p style={styles.text}>
        You've studied for <span style={styles.highlight}>{weeklyStudyHours.toFixed(1)} hours</span> in the last week. 
        Consistent daily practice, even in short sessions, is key to mastering programming skills.
      </p>
    </div>
  );
};

export default StudySummary;