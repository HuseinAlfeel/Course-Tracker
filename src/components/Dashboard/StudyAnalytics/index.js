import React from 'react';
import StudyHoursChart from './StudyHoursChart';
import StudySummary from './StudySummary';
import dateUtils from '../../../utils/dateUtils';

const StudyAnalytics = ({ userProgress }) => {
  const isMobile = window.innerWidth <= 768;
  
  // Generate study data
  const { dailyData: studyHoursData, totalHours: weeklyStudyHours } = 
    dateUtils.generateStudyHoursData(userProgress);
  
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
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  };
  
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>
        <span style={{ marginRight: '10px' }}>📊</span>
        Learning Analytics
      </h3>
      
      <StudySummary weeklyStudyHours={weeklyStudyHours} />
      <StudyHoursChart studyHoursData={studyHoursData} isMobile={isMobile} />
    </div>
  );
};

export default StudyAnalytics;