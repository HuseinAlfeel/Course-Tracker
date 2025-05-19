import React, { useState } from 'react';
import { courseModules, categories } from '../../constants/courseData';

const CategoryProgress = ({ userProgress }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const isMobile = window.innerWidth <= 768;
  
  // Calculate category completion
  const getCategoryCompletion = () => {
    const result = categories.map(category => {
      const categoryModules = courseModules.filter(module => module.category === category.name);
      const completedInCategory = userProgress.filter(p => 
        categoryModules.some(m => m.id === p.moduleId) && 
        p.status === 'completed'
      ).length;
      
      const total = categoryModules.length;
      const percentage = total > 0 ? Math.round((completedInCategory / total) * 100) : 0;
      
      return {
        name: category.name,
        color: category.color,
        completed: completedInCategory,
        total: total,
        percentage: percentage
      };
    });
    
    return result;
  };

  const categoryCompletion = getCategoryCompletion();
  
  const styles = {
    container: {
      backgroundColor: '#2c2c2c', 
      borderRadius: '10px', 
      padding: isMobile ? '12px' : '15px', // Reduced padding
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
      marginBottom: isMobile ? '15px' : '20px', // Reduced margin
      border: '1px solid #3c3c3c'
    },
    title: {
      color: '#ffffff',
      fontSize: isMobile ? '1.1rem' : '1.25rem',
      marginTop: 0,
      marginBottom: '12px' // Reduced margin
    },
    grid: {
      display: 'grid', 
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', 
      gap: isMobile ? '8px' : '12px' // Reduced gap
    },
    card: {
      backgroundColor: '#323232', 
      borderRadius: '8px', 
      padding: isMobile ? '10px' : '12px', // Reduced padding
      border: '1px solid #3c3c3c'
    },
    header: {
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: '8px' // Reduced margin
    },
    categoryTitle: {
      fontWeight: '600',
      color: '#ffffff',
      fontSize: isMobile ? '0.9rem' : '1rem'
    },
    badge: (color) => ({
      backgroundColor: color, 
      color: 'white', 
      padding: isMobile ? '3px 8px' : '4px 10px', 
      borderRadius: '12px', 
      fontSize: isMobile ? '0.65rem' : '0.75rem',
      fontWeight: '600'
    }),
    progressBar: {
      width: '100%', 
      height: '10px', 
      backgroundColor: '#3c3c3c', 
      borderRadius: '5px',
      marginBottom: '8px', // Reduced margin
      overflow: 'hidden'
    },
    progressFill: (percentage, color) => ({
      width: `${percentage}%`, 
      height: '100%', 
      backgroundColor: color, 
      borderRadius: '5px',
      transition: 'width 0.5s ease-in-out'
    }),
    stats: {
      fontSize: isMobile ? '0.75rem' : '0.85rem',
      color: '#b3b3b3'
    }
  };
  
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Progress by Category</h3>
      <div style={styles.grid}>
        {categoryCompletion.map((category, index) => (
          <div 
            key={index} 
            style={styles.card}
            onMouseEnter={() => setHoveredCategory(index)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div style={styles.header}>
              <div>
                <div style={styles.categoryTitle}>{category.name}</div>
              </div>
              <div style={styles.badge(category.color)}>
                {category.percentage}%
              </div>
            </div>
            <div style={styles.progressBar}>
              <div style={styles.progressFill(category.percentage, category.color)} />
            </div>
            <div style={styles.stats}>
              {category.completed}/{category.total} modules completed
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryProgress;