import { useState, useEffect } from 'react';

export const useUserActivity = () => {
  const [userActivity, setUserActivity] = useState({
    lastLogin: new Date(),
    lastLessonCompleted: localStorage.getItem('lastLessonCompleted') 
      ? new Date(localStorage.getItem('lastLessonCompleted'))
      : null,
    isActive: true
  });

  // Function to update last lesson completion
  const updateLastLesson = () => {
    const now = new Date();
    setUserActivity(prev => ({
      ...prev,
      lastLessonCompleted: now
    }));
    localStorage.setItem('lastLessonCompleted', now.toISOString());
  };

  // Function to get days since last activity
  const getDaysSince = (date) => {
    if (!date) return 999;
    const now = new Date();
    const diffTime = Math.abs(now - new Date(date));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Determine if user should see sad animation
  const shouldShowSadAnimation = () => {
    const daysSinceLogin = getDaysSince(userActivity.lastLogin);
    const daysSinceLesson = getDaysSince(userActivity.lastLessonCompleted);
    
    // Show sad animation if more than 3 days since login or 5 days since lesson
    return daysSinceLogin >= 3 || daysSinceLesson >= 5;
  };

  // Check for stored activity on component mount
  useEffect(() => {
    const storedLastLesson = localStorage.getItem('lastLessonCompleted');
    if (storedLastLesson) {
      setUserActivity(prev => ({
        ...prev,
        lastLessonCompleted: new Date(storedLastLesson)
      }));
    }
  }, []);

  return {
    userActivity,
    updateLastLesson,
    shouldShowSadAnimation: shouldShowSadAnimation(),
    daysSinceLastLesson: getDaysSince(userActivity.lastLessonCompleted)
  };
};
