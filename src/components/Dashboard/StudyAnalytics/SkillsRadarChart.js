// New component: src/components/Dashboard/StudyAnalytics/SkillsRadarChart.js

import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip
} from 'recharts';
import { courseModules, categories } from '../../../constants/courseData';

const SkillsRadarChart = ({ userProgress }) => {
  const isMobile = window.innerWidth <= 768;
  
  // Generate data for the radar chart
  const generateSkillsData = () => {
    return categories.map(category => {
      const categoryModules = courseModules.filter(module => module.category === category.name);
      const completedInCategory = userProgress.filter(p => 
        categoryModules.some(m => m.id === p.moduleId) && 
        p.status === 'completed'
      ).length;
      
      const inProgressInCategory = userProgress.filter(p => 
        categoryModules.some(m => m.id === p.moduleId) && 
        p.status === 'in-progress'
      ).length;
      
      const total = categoryModules.length;
      const percentage = total > 0 ? Math.round((completedInCategory / total) * 100) : 0;
      
      return {
        category: category.name,
        value: percentage,
        inProgress: inProgressInCategory > 0,
        fullMark: 100,
        color: category.color
      };
    });
  };
  
  const skillsData = generateSkillsData();
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'rgba(44, 44, 44, 0.95)',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          border: `1px solid ${data.color}`,
        }}>
          <div style={{ fontWeight: 'bold', color: data.color, marginBottom: '4px' }}>
            {data.category}
          </div>
          <div style={{ color: '#fff' }}>
            Completed: <span style={{ color: data.color, fontWeight: 'bold' }}>{data.value}%</span>
          </div>
          {data.inProgress && (
            <div style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '4px' }}>
              Has modules in progress
            </div>
          )}
        </div>
      );
    }
    return null;
  };
  
  // Custom style for filled area
  const gradientId = 'skillsGradient';
  
  const styles = {
    container: {
      marginTop: '40px',
      marginBottom: '20px'
    },
    titleContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '15px'
    },
    title: {
      color: '#ffffff',
      fontSize: isMobile ? '1.1rem' : '1.2rem',
      fontWeight: '600',
      margin: 0,
      display: 'flex',
      alignItems: 'center'
    },
    icon: {
      marginRight: '10px',
      fontSize: isMobile ? '1.2rem' : '1.4rem'
    },
    chartContainer: {
      height: isMobile ? '300px' : '400px',
      marginTop: '10px',
      marginBottom: '20px'
    },
    explanation: {
      color: '#b3b3b3',
      fontSize: isMobile ? '0.85rem' : '0.9rem',
      textAlign: 'center',
      marginTop: '10px',
      padding: '10px',
      backgroundColor: 'rgba(44, 44, 44, 0.5)',
      borderRadius: '8px'
    }
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.titleContainer}>
        <h3 style={styles.title}>
          <span style={styles.icon}>⭐</span>
          Developer Skills Radar
        </h3>
      </div>
      
      <div style={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillsData}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4d9aff" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#9d4dff" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <PolarGrid stroke="#555" strokeDasharray="3 3" />
            <PolarAngleAxis 
              dataKey="category" 
              tick={{ fill: '#e0e0e0', fontSize: isMobile ? 10 : 12 }}
              tickLine={{ stroke: '#666' }}
              style={{ fontSize: isMobile ? '0.75rem' : '0.85rem' }} 
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              axisLine={{ stroke: '#666' }}
              tick={{ fill: '#b3b3b3', fontSize: isMobile ? 10 : 12 }}
              tickCount={5}
            />
            <Radar 
              name="Skills" 
              dataKey="value" 
              stroke="#4d9aff" 
              fill="url(#skillsGradient)" 
              fillOpacity={0.6}
              animationDuration={900}
              animationEasing="ease-in-out"
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      <p style={styles.explanation}>
        This radar chart visualizes your progress across all course categories, 
        highlighting your strengths and areas for growth. 
        Expand your skills by focusing on categories with lower completion rates.
      </p>
    </div>
  );
};

export default SkillsRadarChart;