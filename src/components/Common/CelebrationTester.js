import React from 'react';
import { useCelebration } from '../../context/CelebrationContext';
import { BADGES } from '../../constants/badgeData';

const CelebrationTester = () => {
  const { celebrateLessonCompletion, celebrateBadgeAchievement } = useCelebration();

  const testLessonCelebration = () => {
    celebrateLessonCompletion();
  };

  const testBadgeCelebration = () => {
    // Test with the first badge
    const testBadge = BADGES[0]; // "First Steps" badge
    celebrateBadgeAchievement(testBadge);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      right: '20px',
      backgroundColor: '#2c2c2c',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #4c4c4c',
      zIndex: 40
    }}>
      <h4 style={{ color: '#fff', margin: '0 0 15px 0', fontSize: '14px' }}>🎉 Celebration Tester</h4>
      
      <button
        onClick={testLessonCelebration}
        style={{
          display: 'block',
          width: '100%',
          marginBottom: '10px',
          padding: '8px 12px',
          backgroundColor: '#4299e1',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        🎊 Test Lesson Celebration
      </button>
      
      <button
        onClick={testBadgeCelebration}
        style={{
          display: 'block',
          width: '100%',
          padding: '8px 12px',
          backgroundColor: '#f6ad55',
          color: 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        🏆 Test Badge Celebration
      </button>
      
      <p style={{ 
        color: '#9ca3af', 
        fontSize: '10px', 
        margin: '10px 0 0 0',
        lineHeight: '1.3'
      }}>
        Click buttons to test celebrations.<br/>
        Sound files may not play if missing.
      </p>
    </div>
  );
};

export default CelebrationTester;
