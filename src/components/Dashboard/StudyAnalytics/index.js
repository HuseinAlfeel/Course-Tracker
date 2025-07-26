import React, { useState, useEffect, useCallback } from 'react';
import StudyHoursChart from './StudyHoursChart';
import StudySummary from './StudySummary';
import SkillsRadarChart from './SkillsRadarChart';

const StudyAnalytics = ({ userProgress, allUsersProgress, currentUser }) => {
  const isMobile = window.innerWidth <= 768;
  const [weeklyStudyData, setWeeklyStudyData] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  
  // Generate study data for a week ending on a specific date
  const getStudyDataForWeek = useCallback((weekOffset, startDateOverride = null, endDateOverride = null) => {
    // Calculate dates for the selected week
    const today = new Date();
    
    // End date is today for current week, or offset for previous weeks
    const endDate = endDateOverride || new Date(today);
    if (!endDateOverride) {
      endDate.setDate(today.getDate() + (weekOffset * 7));
    }
    
    // Start date is 6 days before end date
    const startDate = startDateOverride || new Date(endDate);
    if (!startDateOverride) {
      startDate.setDate(endDate.getDate() - 6);
    }
    
    // Set times to get full day coverage
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    
    // Create array of days for the week
    const weekData = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Fill the week array with dates from start to end
    const tempDate = new Date(startDate);
    while (tempDate <= endDate) {
      weekData.push({
        day: days[tempDate.getDay()],
        date: new Date(tempDate),
        hours: 0
      });
      tempDate.setDate(tempDate.getDate() + 1);
    }
    
    // Populate with actual study data
    let weeklyTotal = 0;
    
    if (userProgress && userProgress.length > 0) {
      userProgress.forEach(module => {
        if (module.status === 'completed' && module.updatedAt) {
          const completedDate = new Date(module.updatedAt);
          
          // Check if completed date falls within selected week
          if (completedDate >= startDate && completedDate <= endDate) {
            // Find matching day in our data array
            const dayIndex = weekData.findIndex(day => 
              day.date.getDate() === completedDate.getDate() && 
              day.date.getMonth() === completedDate.getMonth() &&
              day.date.getFullYear() === completedDate.getFullYear()
            );
            
            if (dayIndex !== -1) {
              // Assuming 1.5 hours per completed module
              weekData[dayIndex].hours += 1.5;
              weeklyTotal += 1.5;
            }
          }
        }
      });
    }
    
    return { dailyData: weekData, totalHours: weeklyTotal };
  }, [userProgress]);
  
  // Initial data load for current week
  useEffect(() => {
    if (!userProgress) return;
    
    // Get today-ending week data
    const { dailyData, totalHours } = getStudyDataForWeek(0);
    setWeeklyStudyData(dailyData);
    setTotalHours(totalHours);
  }, [userProgress, getStudyDataForWeek]);
  
  // Handle week change from chart
  const handleWeekChange = (offset, startDate, endDate) => {
    const { dailyData, totalHours } = getStudyDataForWeek(offset, startDate, endDate);
    setWeeklyStudyData(dailyData);
    setTotalHours(totalHours);
  };
  
  const styles = {
    container: {
      backgroundColor: '#2c2c2c', 
      borderRadius: '10px', 
      padding: isMobile ? '12px' : '15px', // Reduced padding
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
      marginBottom: isMobile ? '15px' : '20px', // Reduced margin
      border: '1px solid #3c3c3c',
      overflow: 'hidden'
    },
    title: {
      color: '#ffffff',
      fontSize: isMobile ? '1.1rem' : '1.25rem',
      marginTop: 0,
      marginBottom: '12px', // Reduced margin
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    divider: {
      height: '1px',
      backgroundColor: '#3c3c3c',
      margin: '20px 0', // Reduced margin
      opacity: 0.7
    }
  };
  
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>
        <span style={{ marginRight: '10px' }}>📊</span>
        Learning Analytics
      </h3>
      
      <StudySummary weeklyStudyHours={totalHours} />
      
      <StudyHoursChart 
        studyHoursData={weeklyStudyData} 
        isMobile={isMobile}
        onWeekChange={handleWeekChange}
      />
      
      {/* Add divider between charts */}
      <div style={styles.divider}></div>
      
      {/* Add the new Radar Chart component */}
      <SkillsRadarChart 
        userProgress={userProgress}
      />
      
    </div>
  );
};

export default StudyAnalytics;