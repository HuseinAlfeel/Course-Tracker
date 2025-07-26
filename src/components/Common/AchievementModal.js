import React from 'react';
import { useCelebration } from '../../context/CelebrationContext';

const AchievementModal = () => {
  const { achievementModal, dismissAchievementModal } = useCelebration();

  if (!achievementModal.isVisible || !achievementModal.badge) {
    return null;
  }

  const { badge } = achievementModal;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}
        onClick={dismissAchievementModal}
      >
        {/* Modal Card */}
        <div
          className="animate-bounce-in"
          style={{
            background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '400px',
            width: '100%',
            margin: '16px',
            border: '1px solid #4b5563',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            position: 'relative'
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={dismissAchievementModal}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              fontSize: '24px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'color 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.color = '#ffffff'}
            onMouseOut={(e) => e.target.style.color = '#9ca3af'}
          >
            ×
          </button>

          {/* Trophy Icon */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏆</div>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#ffffff', 
              marginBottom: '8px',
              margin: 0 
            }}>
              Achievement Unlocked!
            </h2>
          </div>

          {/* Badge Information */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>{badge.icon}</div>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#fbbf24', 
              marginBottom: '12px',
              margin: 0 
            }}>
              {badge.title}
            </h3>
            <p style={{ 
              color: '#d1d5db', 
              fontSize: '14px', 
              lineHeight: '1.5', 
              marginBottom: '24px',
              margin: 0 
            }}>
              {badge.description}
            </p>
            
            {/* Congratulations Message */}
            <div style={{
              background: 'linear-gradient(90deg, #f59e0b 0%, #f97316 100%)',
              color: '#000000',
              fontWeight: '600',
              padding: '8px 16px',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              🎉 Congratulations! 🎉
            </div>
          </div>

          {/* Auto-dismiss indicator */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '12px',
              margin: 0 
            }}>
              This will auto-dismiss in a few seconds
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AchievementModal;
