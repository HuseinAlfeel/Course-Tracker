// Date and time helper functions

/**
 * Generates study hours data based on completed modules
 * @param {Array} userProgress - The user's progress data
 * @returns {Object} Object containing daily data and total hours
 */
const generateStudyHoursData = (userProgress) => {
  // Assuming 1.5 hours per completed module
  const HOURS_PER_MODULE = 1.5;
  
  // Create an array for the last 7 days, starting with today and going back
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result = Array(7).fill().map(() => ({ day: '', hours: 0 }));
  
  // Get today and populate the days
  const today = new Date();
  
  // Fill the days array starting with today and going back 6 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dayIndex = 6 - i; // Reverse the index so today is at the end
    result[dayIndex].day = days[date.getDay()];
    
    // Store the date for comparison (but don't display it)
    result[dayIndex].date = new Date(date.setHours(0, 0, 0, 0));
  }
  
  // Count completed modules by day over the past week
  if (userProgress && userProgress.length > 0) {
    userProgress.forEach(module => {
      if (module.status === 'completed' && module.updatedAt) {
        const completedDate = new Date(module.updatedAt);
        // Set hours to 0 for proper date comparison
        const completedDay = new Date(completedDate.setHours(0, 0, 0, 0));
        
        // Find matching day in our result array
        const dayMatch = result.findIndex(day => 
          day.date && day.date.getTime() === completedDay.getTime()
        );
        
        if (dayMatch !== -1) {
          result[dayMatch].hours += HOURS_PER_MODULE;
        }
      }
    });
  }
  
  // Calculate total hours
  const totalHours = result.reduce((sum, day) => sum + day.hours, 0);
  
  return { dailyData: result, totalHours };
};

/**
 * Format a date for display
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
const formatDate = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Get the number of modules completed by a user in the current week
 * @param {Array} userProgress - User progress data
 * @returns {number} Count of completed modules this week
 */
const getWeeklyCompletionCount = (userProgress) => {
  if (!userProgress || !userProgress.length) return 0;
  
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  startOfWeek.setHours(0, 0, 0, 0);
  
  return userProgress.filter(module => {
    return module.status === 'completed' && 
          module.updatedAt && 
          new Date(module.updatedAt) >= startOfWeek;
  }).length;
};

/**
 * Get the start of the current week
 * @returns {Date} Start of week date
 */
const getStartOfWeek = () => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};

/**
 * Check if two dates are the same day
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} True if dates are the same day
 */
const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

/**
 * Get a date object for X days ago
 * @param {number} days - Number of days to go back
 * @returns {Date} Date object representing X days ago
 */
const getDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
};

/**
 * Get a friendly relative date string (Today, Yesterday, etc)
 * @param {Date|string} date - Date to format
 * @returns {string} Friendly date string
 */
const getFriendlyDate = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  if (isSameDay(dateObj, today)) {
    return 'Today';
  } else if (isSameDay(dateObj, yesterday)) {
    return 'Yesterday';
  } else {
    return formatDate(dateObj);
  }
};

// Export as an object with all functions
const dateUtils = {
  generateStudyHoursData,
  formatDate,
  getWeeklyCompletionCount,
  getStartOfWeek,
  isSameDay,
  getDaysAgo,
  getFriendlyDate
};

export default dateUtils;