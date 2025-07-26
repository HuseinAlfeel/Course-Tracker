// All 18 badges with their unlock conditions
export const BADGES = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Completed your first module',
    icon: '🌱',
    condition: (completedModules) => completedModules.length >= 1
  },
  {
    id: 'getting-traction',
    title: 'Getting Traction',
    description: 'Completed 5 modules',
    icon: '🚀',
    condition: (completedModules) => completedModules.length >= 5
  },
  {
    id: 'serious-learner',
    title: 'Serious Learner',
    description: 'Completed 10 modules',
    icon: '📚',
    condition: (completedModules) => completedModules.length >= 10
  },
  {
    id: 'html-apprentice',
    title: 'HTML Apprentice',
    description: 'Reached 50% in Front-End Fundamentals',
    icon: '📄',
    condition: (completedModules, progress) => {
      const frontendProgress = progress.categories?.['Front-End Fundamentals']?.percentage || 0;
      return frontendProgress >= 50;
    }
  },
  {
    id: 'css-stylist',
    title: 'CSS Stylist',
    description: 'Completed all Front-End Fundamentals modules',
    icon: '🎨',
    condition: (completedModules, progress) => {
      const frontendProgress = progress.categories?.['Front-End Fundamentals']?.percentage || 0;
      return frontendProgress >= 100;
    }
  },
  {
    id: 'consistency-begins',
    title: 'Consistency Begins',
    description: 'Maintained a 3-day study streak',
    icon: '🔥',
    condition: (completedModules, progress) => {
      return progress.currentStreak >= 3;
    }
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Maintained a 7-day study streak',
    icon: '🏆',
    condition: (completedModules, progress) => {
      return progress.currentStreak >= 7;
    }
  },
  {
    id: 'script-padawan',
    title: 'Script Padawan',
    description: 'Reached 50% in JavaScript & DOM',
    icon: '⚙️',
    condition: (completedModules, progress) => {
      const jsProgress = progress.categories?.['JavaScript & DOM']?.percentage || 0;
      return jsProgress >= 50;
    }
  },
  {
    id: 'dom-manipulator',
    title: 'DOM Manipulator',
    description: 'Completed all JavaScript & DOM modules',
    icon: '🧩',
    condition: (completedModules, progress) => {
      const jsProgress = progress.categories?.['JavaScript & DOM']?.percentage || 0;
      return jsProgress >= 100;
    }
  },
  {
    id: 'server-novice',
    title: 'Server Novice',
    description: 'Reached 50% in Backend Development',
    icon: '🖥️',
    condition: (completedModules, progress) => {
      const backendProgress = progress.categories?.['Backend Development']?.percentage || 0;
      return backendProgress >= 50;
    }
  },
  {
    id: 'api-architect',
    title: 'API Architect',
    description: 'Completed all Backend Development modules',
    icon: '🏗️',
    condition: (completedModules, progress) => {
      const backendProgress = progress.categories?.['Backend Development']?.percentage || 0;
      return backendProgress >= 100;
    }
  },
  {
    id: 'data-collector',
    title: 'Data Collector',
    description: 'Reached 50% in Databases & Full Stack',
    icon: '💾',
    condition: (completedModules, progress) => {
      const dbProgress = progress.categories?.['Databases & Full Stack']?.percentage || 0;
      return dbProgress >= 50;
    }
  },
  {
    id: 'full-stack-engineer',
    title: 'Full Stack Engineer',
    description: 'Completed all Databases & Full Stack modules',
    icon: '🔗',
    condition: (completedModules, progress) => {
      const dbProgress = progress.categories?.['Databases & Full Stack']?.percentage || 0;
      return dbProgress >= 100;
    }
  },
  {
    id: 'advanced-explorer',
    title: 'Advanced Explorer',
    description: 'Reached 50% in Advanced Topics',
    icon: '🔍',
    condition: (completedModules, progress) => {
      const advancedProgress = progress.categories?.['Advanced Topics']?.percentage || 0;
      return advancedProgress >= 50;
    }
  },
  {
    id: 'technology-master',
    title: 'Technology Master',
    description: 'Completed all Advanced Topics modules',
    icon: '🧠',
    condition: (completedModules, progress) => {
      const advancedProgress = progress.categories?.['Advanced Topics']?.percentage || 0;
      return advancedProgress >= 100;
    }
  },
  {
    id: 'halfway-hero',
    title: 'Halfway Hero',
    description: 'Completed 50% of the entire course',
    icon: '🏃',
    condition: (completedModules, progress) => {
      return progress.overallProgress >= 50;
    }
  },
  {
    id: 'almost-there',
    title: 'Almost There',
    description: 'Completed 75% of the entire course',
    icon: '🎯',
    condition: (completedModules, progress) => {
      return progress.overallProgress >= 75;
    }
  },
  {
    id: 'coding-champion',
    title: 'Coding Champion',
    description: 'Completed the entire bootcamp',
    icon: '👑',
    condition: (completedModules, progress) => {
      return progress.overallProgress >= 100;
    }
  }
];

// Function to check for newly earned badges
export const checkForNewBadges = (completedModules, progress, earnedBadges = []) => {
  const newlyEarnedBadges = [];

  for (const badge of BADGES) {
    // Skip if badge is already earned
    if (earnedBadges.includes(badge.id)) {
      continue;
    }

    // Check if badge condition is met
    if (badge.condition(completedModules, progress)) {
      newlyEarnedBadges.push(badge);
    }
  }

  return newlyEarnedBadges;
};

// Function to get all earned badges
export const getEarnedBadges = (completedModules, progress) => {
  return BADGES.filter(badge => badge.condition(completedModules, progress));
};

// Function to get badge by ID
export const getBadgeById = (badgeId) => {
  return BADGES.find(badge => badge.id === badgeId);
};
