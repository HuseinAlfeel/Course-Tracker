import React, { useState, useEffect } from 'react';
import { DotLottiePlayer } from '@dotlottie/react-player';

// Import the actual .lottie files
import monkeyDancingAnimation from '../assets/animations/monkey-dancing.lottie';
import sadCircleAnimation from '../assets/animations/sad-circle.lottie';

const MotivationMascot = ({ 
  userName = null,
  lastCompletionDate = null,
  justCompletedModule = false,
  isLoading = false
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [recentlyCompleted, setRecentlyCompleted] = useState(false);

  // Get user's first name
  const getFirstName = (fullName) => {
    if (!fullName) {
      const storedName = localStorage.getItem('userName');
      return storedName || 'Champion';
    }
    return fullName.split(' ')[0];
  };
  
  const firstName = getFirstName(userName);

  // MESSAGE DEFINITIONS
  const encouragingMessages = [
    `🎉 Go ${firstName}! You're amazing!`,
    `🚀 Keep it up, ${firstName}!`,
    `💪 You've got this, ${firstName}!`,
    `⭐ Amazing work, ${firstName}!`,
    `🔥 On fire, ${firstName}!`
  ];

  const sadMessages = [
    `😢 ${firstName}, I miss you...`,
    `🥺 Come back, ${firstName}!`,
    `💙 Missing you, ${firstName}...`,
    `😴 Where are you, ${firstName}?`,
    `🤗 I'm waiting, ${firstName}!`
  ];

  const celebrationMessages = [
    `🎉 Wow ${firstName}! You just completed a module!`,
    `🚀 Amazing work, ${firstName}! Keep going!`,
    `💪 You're unstoppable, ${firstName}!`,
    `⭐ Incredible progress, ${firstName}!`,
    `🔥 You're on fire, ${firstName}!`
  ];

  // 48-hour rule: Check if user completed a lesson within last 48 hours
  const isRecentlyActive = () => {
    if (isLoading) {
      return true; // Assume active while loading to prevent sad state
    }
    if (!lastCompletionDate) {
      // NO COMPLETION DATE = DEFINITELY INACTIVE
      return false; 
    }
    const now = new Date();
    const completion = new Date(lastCompletionDate);
    const diffHours = (now - completion) / (1000 * 60 * 60);
    return diffHours <= 48; // Active if completed within 48 hours
  };

  // Handle module completion - switch to happy mode immediately
  useEffect(() => {
    if (justCompletedModule) {
      setRecentlyCompleted(true);
      // Keep happy mode for 10 seconds after completion
      const timer = setTimeout(() => {
        setRecentlyCompleted(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [justCompletedModule]);

  // BULLETPROOF LOGIC: ZERO TOLERANCE FOR ERROR
  const shouldShowSadState = !isLoading && !isRecentlyActive() && !recentlyCompleted;

  console.log('🔥 DEBUGGING LOGIC:', {
    isLoading,
    lastCompletionDate,
    recentlyCompleted,
    isRecentlyActiveResult: isRecentlyActive(),
    shouldShowSadState,
    userName: firstName
  });

  // SIMPLE CLEAR LOGIC: NO COMPLICATED IFS
  let currentMessages, currentAnimation, debugState;
  
  if (recentlyCompleted) {
    // STATE 1: CELEBRATION
    currentMessages = celebrationMessages;
    currentAnimation = monkeyDancingAnimation;
    debugState = 'CELEBRATION';
  } else if (shouldShowSadState) {
    // STATE 2: SAD (48+ hours inactive)
    currentMessages = sadMessages;
    currentAnimation = sadCircleAnimation;
    debugState = 'SAD';
  } else {
    // STATE 3: ENCOURAGING (active or loading)
    currentMessages = encouragingMessages;
    currentAnimation = monkeyDancingAnimation;  
    debugState = 'ENCOURAGING';
  }

  console.log(`🎭 FINAL STATE: ${debugState} | Animation: ${currentAnimation === sadCircleAnimation ? 'SAD_CIRCLE' : 'HAPPY_MONKEY'} | Messages: ${currentMessages === sadMessages ? 'SAD' : currentMessages === celebrationMessages ? 'CELEBRATION' : 'ENCOURAGING'}`);

  // Reset message index when state changes
  useEffect(() => {
    setCurrentMessageIndex(0);
  }, [shouldShowSadState, recentlyCompleted]);

  // Rotate messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % currentMessages.length);
    }, shouldShowSadState ? 12000 : 8000);
    return () => clearInterval(interval);
  }, [currentMessages.length, shouldShowSadState, currentMessages]);

  return (
    <div className="motivation-mascot">
      <div className="mascot-animation">
        <DotLottiePlayer
          src={currentAnimation}
          autoplay
          loop
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      
      <div className="mascot-message">
        <div className="message-text">
          {currentMessages[currentMessageIndex]}
        </div>
      </div>
    </div>
  );
};

export default MotivationMascot;
