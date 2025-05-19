import React, { useContext } from 'react';
import { ProgressContext } from '../../context/ProgressContext';
import { courseModules } from '../../constants/courseData';

const ProgressSummaryCards = ({ userProgress, currentUser }) => {
  const { updateModuleStatus } = useContext(ProgressContext) || {
    updateModuleStatus: () => console.log('updateModuleStatus not available')
  };
  
  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
  
  // Calculate completion percentage
  const calculateCompletion = (progress) => {
    if (!progress || progress.length === 0) return 0;
    const completedModules = progress.filter(p => p.status === 'completed').length;
    return Math.round((completedModules / courseModules.length) * 100);
  };
  
  // Generate milestone based on completion percentage
  const getMilestone = (completion) => {
    if (completion >= 100) return { title: "Full Stack Master! 🎓", description: "You've completed the entire bootcamp! Congratulations!" };
    if (completion >= 75) return { title: "Backend Developer! 💻", description: "You've mastered backend development concepts!" };
    if (completion >= 50) return { title: "JavaScript Ninja! ⚡", description: "You're getting great at JavaScript and DOM manipulation!" };
    if (completion >= 25) return { title: "HTML/CSS Wizard! 🧙‍♂️", description: "You've learned the fundamentals of web design!" };
    return { title: "Just Getting Started! 🌱", description: "Keep going! You're on the path to becoming a developer!" };
  };
  
  // Get next module to study
  const getNextModule = () => {
    const completedModuleIds = userProgress
      .filter(p => p.status === 'completed')
      .map(p => p.moduleId);
    
    const inProgressModuleIds = userProgress
      .filter(p => p.status === 'in-progress')
      .map(p => p.moduleId);
    
    // First check if there are modules in progress
    if (inProgressModuleIds.length > 0) {
      const moduleInProgress = courseModules.find(m => m.id === inProgressModuleIds[0]);
      return {
        id: moduleInProgress.id,
        title: moduleInProgress.title,
        status: 'in-progress'
      };
    }
    
    // If not, find the next module that hasn't been completed
    for (let i = 0; i < courseModules.length; i++) {
      if (!completedModuleIds.includes(courseModules[i].id)) {
        return {
          id: courseModules[i].id,
          title: courseModules[i].title,
          status: 'not-started'
        };
      }
    }
    
    // If all modules are completed
    return {
      id: courseModules[courseModules.length - 1].id,
      title: 'All modules completed! 🎉',
      status: 'completed'
    };
  };

  // Handle module status change
  const handleModuleAction = (moduleId, status) => {
    // Call the update function with the new status
    const newStatus = status === 'in-progress' ? 'completed' : 'in-progress';
    console.log(`Setting module ${moduleId} to ${newStatus}`);
    updateModuleStatus(moduleId, newStatus);
  };
  
  const userCompletion = calculateCompletion(userProgress);
  const currentMilestone = getMilestone(userCompletion);
  const nextModule = getNextModule();
  
  const styles = {
    container: {
      display: 'grid', 
      gridTemplateColumns: isMobile ? '1fr' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(300px, 1fr))'), 
      gap: isMobile ? '12px' : '15px', // Reduced gap
      marginBottom: isMobile ? '15px' : '20px' // Reduced margin
    },
    card: {
      backgroundColor: '#2c2c2c', 
      borderRadius: '10px', 
      padding: isMobile ? '12px' : '15px', // Reduced padding
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
      border: '1px solid #3c3c3c'
    },
    cardTitle: {
      marginTop: '0',
      color: '#ffffff',
      fontSize: isMobile ? '1.1rem' : '1.25rem',
      marginBottom: '12px' // Reduced margin
    },
    progressValue: {
      fontSize: isMobile ? '2rem' : '2.5rem',
      fontWeight: 'bold',
      color: '#4d9aff',
      marginBottom: '12px' // Reduced margin
    },
    progressBar: {
      width: '100%', 
      height: '10px', 
      backgroundColor: '#3c3c3c', 
      borderRadius: '5px',
      marginBottom: '15px', // Reduced margin
      overflow: 'hidden'
    },
    progressFill: {
      width: `${userCompletion}%`, 
      height: '100%', 
      backgroundColor: '#4d9aff', 
      borderRadius: '5px',
      transition: 'width 0.5s ease-in-out'
    },
    infoBox: {
      backgroundColor: '#213547', 
      padding: isMobile ? '10px' : '12px', // Reduced padding
      borderRadius: '8px',
      borderLeft: '4px solid #4d9aff',
      marginTop: '8px' // Reduced margin
    },
    infoTitle: {
      fontWeight: 'bold',
      color: '#4d9aff',
      fontSize: isMobile ? '0.95rem' : '1rem'
    },
    infoText: {
      margin: '5px 0 0',
      color: '#b3b3b3',
      fontSize: isMobile ? '0.85rem' : '0.9rem'
    },
    streakContainer: {
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      marginTop: '15px', // Reduced margin
      marginBottom: '15px' // Reduced margin
    },
    streakValue: {
      fontSize: isMobile ? '2.8rem' : '3.5rem',
      fontWeight: 'bold',
      color: (currentUser?.streak || 0) >= 3 ? '#ff9d4d' : '#8a8a8a',
      display: 'flex',
      alignItems: 'center'
    },
    streakLabel: {
      fontSize: isMobile ? '1rem' : '1.1rem',
      color: '#b3b3b3',
      marginTop: '5px'
    },
    streakInfoBox: {
      backgroundColor: '#352918', 
      padding: isMobile ? '10px' : '12px', // Reduced padding
      borderRadius: '8px',
      borderLeft: '4px solid #ff9d4d',
      marginTop: '8px', // Reduced margin
      textAlign: 'center'
    },
    streakInfoText: {
      color: '#ffcc99',
      margin: 0
    },
    nextModuleBox: {
      backgroundColor: nextModule.status === 'in-progress' ? '#352918' : '#18352a', 
      padding: isMobile ? '10px' : '12px', // Reduced padding
      borderRadius: '8px',
      borderLeft: `4px solid ${nextModule.status === 'in-progress' ? '#ff9d4d' : '#4dff9d'}`,
      marginTop: '8px' // Reduced margin
    },
    nextModuleTitle: {
      fontWeight: 'bold',
      color: nextModule.status === 'in-progress' ? '#ffcc99' : '#99ffcc',
      fontSize: isMobile ? '0.95rem' : '1rem'
    },
    nextModuleText: {
      color: '#e6e6e6',
      margin: '5px 0 0'
    },
    actionButton: {
      backgroundColor: nextModule.status === 'in-progress' ? '#4dff9d' : '#4d9aff',
      color: 'white',
      border: 'none',
      width: '100%',
      padding: isMobile ? '10px' : '12px',
      borderRadius: '8px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      fontSize: isMobile ? '0.9rem' : '1rem',
      marginTop: '15px' // Reduced margin
    }
  };
  
  return (
    <div style={styles.container}>
      {/* Overall Progress Card */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Overall Progress</h3>
        <div style={styles.progressValue}>
          {userCompletion}%
        </div>
        <div style={styles.progressBar}>
          <div style={styles.progressFill} />
        </div>
        <div style={styles.infoBox}>
          <div style={styles.infoTitle}>{currentMilestone.title}</div>
          <p style={styles.infoText}>{currentMilestone.description}</p>
        </div>
      </div>
      
      {/* Current Streak Card */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Current Streak</h3>
        <div style={styles.streakContainer}>
          <div style={styles.streakValue}>
            {currentUser?.streak || 0} {(currentUser?.streak || 0) >= 3 && '🔥'}
          </div>
          <div style={styles.streakLabel}>days</div>
        </div>
        <div style={styles.streakInfoBox}>
          <p style={styles.streakInfoText}>
            {(currentUser?.streak || 0) >= 3 
              ? "You're on fire! Keep the momentum going!" 
              : "Study consistently to build your streak!"}
          </p>
        </div>
      </div>
      
      {/* Next Module Card */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Next Module</h3>
        <div style={styles.nextModuleBox}>
          <div style={styles.nextModuleTitle}>
            {nextModule.status === 'in-progress' ? 'Currently Learning:' : 'Next Up:'}
          </div>
          <div style={styles.nextModuleText}>{nextModule.title}</div>
        </div>
        <button 
          onClick={() => handleModuleAction(nextModule.id, nextModule.status)}
          style={styles.actionButton}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
          }}
        >
          {nextModule.status === 'in-progress' ? 'Mark as Completed' : 'Start Module'}
        </button>
      </div>
    </div>
  );
};

export default ProgressSummaryCards;