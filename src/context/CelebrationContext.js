import React, { createContext, useContext, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';

const CelebrationContext = createContext();

export const useCelebration = () => {
  const context = useContext(CelebrationContext);
  if (!context) {
    throw new Error('useCelebration must be used within a CelebrationProvider');
  }
  return context;
};

export const CelebrationProvider = ({ children }) => {
  const [achievementModal, setAchievementModal] = useState({
    isVisible: false,
    badge: null
  });

  // Play sound utility with error handling
  const playSound = useCallback((soundFile) => {
    try {
      const audio = new Audio(`/sounds/${soundFile}`);
      audio.volume = 0.5;
      audio.play().catch(error => {
        console.log(`Sound file ${soundFile} not found or couldn't play:`, error);
      });
    } catch (error) {
      console.log(`Error playing sound ${soundFile}:`, error);
    }
  }, []);

  // Lesson completion celebration
  const celebrateLessonCompletion = useCallback(() => {
    // Play lesson victory sound
    playSound('LessonVictory.mp3');

    // Course theme colors
    const colors = ['#4299e1', '#f6ad55', '#68d391', '#fc8181', '#b794f4'];

    // Center burst
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors
      });
    }, 0);

    // Left side burst
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 55,
        origin: { x: 0.25, y: 0.6 },
        colors: colors
      });
    }, 500);

    // Right side burst
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 55,
        origin: { x: 0.75, y: 0.6 },
        colors: colors
      });
    }, 1000);

    console.log('🎉 Lesson completion celebration triggered!');
  }, [playSound]);

  // Badge achievement celebration
  const celebrateBadgeAchievement = useCallback((badge) => {
    // Play big victory sound
    playSound('BigVictory.mp3');

    // Celebration colors for badges
    const celebrationColors = ['#FFD700', '#FFA500', '#FF6347', '#32CD32', '#1E90FF', '#DA70D6'];

    // Multiple bigger confetti bursts
    const runConfetti = () => {
      // Main explosion
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: celebrationColors
      });

      // Left explosion
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { x: 0.2, y: 0.4 },
        colors: celebrationColors
      });

      // Right explosion
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { x: 0.8, y: 0.4 },
        colors: celebrationColors
      });
    };

    // First burst immediately
    runConfetti();

    // Second burst after 0.8 seconds
    setTimeout(runConfetti, 800);

    // Third burst after 1.6 seconds
    setTimeout(runConfetti, 1600);

    // Show achievement modal
    setAchievementModal({
      isVisible: true,
      badge: badge
    });

    // Auto-dismiss modal after 10 seconds
    setTimeout(() => {
      setAchievementModal({
        isVisible: false,
        badge: null
      });
    }, 10000);

    console.log('🏆 Badge achievement celebration triggered!', badge);
  }, [playSound]);

  // Dismiss achievement modal
  const dismissAchievementModal = useCallback(() => {
    setAchievementModal({
      isVisible: false,
      badge: null
    });
  }, []);

  const value = {
    celebrateLessonCompletion,
    celebrateBadgeAchievement,
    achievementModal,
    dismissAchievementModal
  };

  return (
    <CelebrationContext.Provider value={value}>
      {children}
    </CelebrationContext.Provider>
  );
};
