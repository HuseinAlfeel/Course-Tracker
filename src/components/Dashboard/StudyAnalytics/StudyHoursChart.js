import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const StudyHoursChart = ({ studyHoursData, isMobile, onWeekChange }) => {
  // Track current week offset (0 = current week, -1 = previous week, etc.)
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekDateRange, setWeekDateRange] = useState('');
  
  // Update date range display when week offset changes
  useEffect(() => {
    // Get end date for the selected week (today for current week, or correspondingly offset)
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + (weekOffset * 7));
    
    // Get start date (6 days before end date)
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 6);
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    setWeekDateRange(`${formatDate(startDate)} - ${formatDate(endDate)}`);
    
    // Notify parent component about week change
    if (onWeekChange) {
      onWeekChange(weekOffset, startDate, endDate);
    }
  }, [weekOffset, onWeekChange]);
  
  // Navigation handlers
  const goToPreviousWeek = () => {
    setWeekOffset(prevOffset => prevOffset - 1);
  };
  
  const goToNextWeek = () => {
    if (weekOffset < 0) {
      setWeekOffset(prevOffset => prevOffset + 1);
    }
  };
  
  const goToCurrentWeek = () => {
    setWeekOffset(0);
  };
  
  // Format data for Recharts
  const chartData = studyHoursData.map(day => ({
    day: day.day,
    hours: day.hours,
    modules: Math.round(day.hours / 1.5)
  }));
  
  // Calculate max value for dynamic chart scaling
  const maxHours = Math.max(...chartData.map(item => item.hours), 0.1);
  const yAxisMax = Math.ceil(Math.max(maxHours, 3));
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: 'rgba(40, 40, 40, 0.95)',
            border: '1px solid #ff9d4d',
            padding: '10px',
            borderRadius: '6px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
          }}
        >
          <p style={{ 
            margin: '0 0 5px', 
            color: '#fff', 
            fontWeight: 'bold',
            fontSize: '0.95rem' 
          }}>
            {label}
          </p>
          <p style={{ 
            margin: '0', 
            color: '#fff',
            fontSize: '0.9rem'
          }}>
            Hours: <span style={{ color: '#ff9d4d', fontWeight: 'bold' }}>
              {payload[0].value.toFixed(1)}
            </span>
          </p>
          {payload[0].value > 0 && (
            <p style={{ 
              margin: '5px 0 0', 
              color: '#aaa', 
              fontSize: '0.8rem' 
            }}>
              ({Math.round(payload[0].value / 1.5)} modules)
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const styles = {
    container: {
      marginTop: '20px'
    },
    chartHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px'
    },
    title: {
      color: '#ffffff', 
      fontSize: isMobile ? '1rem' : '1.1rem',
      fontWeight: '500'
    },
    navigationControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    navButton: (isDisabled) => ({
      backgroundColor: isDisabled ? '#3a3a3a' : '#333',
      color: isDisabled ? '#666' : '#b3b3b3',
      border: '1px solid #444',
      borderRadius: '6px',
      padding: '6px 12px',
      fontSize: '0.9rem',
      cursor: isDisabled ? 'default' : 'pointer',
      transition: 'all 0.2s ease'
    }),
    dateRangeContainer: {
      display: 'flex',
      alignItems: 'center', 
      justifyContent: 'center',
      marginBottom: '15px'
    },
    dateRange: {
      color: '#b3b3b3',
      fontSize: isMobile ? '0.9rem' : '1rem',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px'
    },
    currentBadge: {
      backgroundColor: weekOffset === 0 ? 'rgba(77, 154, 255, 0.2)' : 'transparent',
      color: weekOffset === 0 ? '#4d9aff' : 'transparent',
      padding: '3px 8px',
      borderRadius: '4px',
      fontSize: '0.75rem',
      border: weekOffset === 0 ? '1px solid rgba(77, 154, 255, 0.4)' : 'none',
      display: weekOffset === 0 ? 'inline-block' : 'none'
    },
    chartContainer: {
      backgroundColor: '#272727',
      borderRadius: '10px', 
      padding: isMobile ? '15px 5px 5px 0' : '20px 10px 10px 0', 
      border: '1px solid #3c3c3c',
      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
      height: isMobile ? '250px' : '300px',
      position: 'relative'
    },
    legendContainer: {
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      marginTop: '15px',
      color: '#b3b3b3',
      fontSize: isMobile ? '0.8rem' : '0.9rem'
    },
    legendLine: {
      width: '20px', 
      height: '2px',
      background: 'linear-gradient(90deg, #ff7e1d, #ff9d4d)',
      marginRight: '8px',
      borderRadius: '1px'
    },
    noDataOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
      pointerEvents: 'none'
    },
    noDataText: {
      color: '#999',
      fontSize: '0.9rem',
      fontStyle: 'italic',
      backgroundColor: 'rgba(39, 39, 39, 0.8)',
      padding: '10px 20px',
      borderRadius: '8px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Chart header with navigation controls */}
      <div style={styles.chartHeader}>
        <div style={styles.title}>
          Daily Study Hours
        </div>
        
        <div style={styles.navigationControls}>
          <button 
            style={styles.navButton(false)} 
            onClick={goToPreviousWeek}
            aria-label="Previous Week"
          >
            ← Prev
          </button>
          
          {weekOffset !== 0 && (
            <button 
              style={{
                backgroundColor: 'rgba(77, 154, 255, 0.15)',
                color: '#4d9aff',
                border: '1px solid rgba(77, 154, 255, 0.3)',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }} 
              onClick={goToCurrentWeek}
              aria-label="Current Week"
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(77, 154, 255, 0.25)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(77, 154, 255, 0.15)';
              }}
            >
              Current
            </button>
          )}
          
          <button 
            style={styles.navButton(weekOffset === 0)} 
            onClick={goToNextWeek}
            disabled={weekOffset === 0}
            aria-label="Next Week"
          >
            Next →
          </button>
        </div>
      </div>
      
      {/* Date range display */}
      <div style={styles.dateRangeContainer}>
        <div style={styles.dateRange}>
          <span>{weekDateRange}</span>
          <span style={styles.currentBadge}>Current</span>
        </div>
      </div>
      
      <div style={styles.chartContainer}>
        {/* Always render the chart, even with no data */}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: isMobile ? -15 : 0,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff9d4d" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#ff9d4d" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#333" 
              strokeOpacity={0.8}
            />
            
            <XAxis 
              dataKey="day" 
              tick={{ fill: '#999', fontSize: isMobile ? 11 : 12 }}
              axisLine={{ stroke: '#444' }}
              tickLine={{ stroke: '#444' }}
            />
            
            <YAxis 
              domain={[0, yAxisMax]}
              tick={{ fill: '#999', fontSize: isMobile ? 11 : 12 }}
              axisLine={{ stroke: '#444' }}
              tickLine={{ stroke: '#444' }}
              tickCount={6}
              width={isMobile ? 25 : 35}
            />
            
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ stroke: '#666', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            
            <Area 
              type="monotone" 
              dataKey="hours" 
              stroke="#ff9d4d" 
              strokeWidth={1.5}
              fillOpacity={1} 
              fill="url(#colorHours)" 
              activeDot={{ 
                r: 4, 
                stroke: '#ff7e1d', 
                strokeWidth: 1, 
                fill: '#fff',
                boxShadow: '0 0 5px #ff9d4d' 
              }}
              dot={{ 
                r: 2.5, 
                strokeWidth: 1, 
                stroke: '#ff9d4d', 
                fill: '#ff9d4d'
              }}
            />
            
            <ReferenceLine y={0} stroke="#444" strokeWidth={1} />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Conditionally render "No data" message overlay */}
        {!chartData.some(day => day.hours > 0) && (
          <div style={styles.noDataOverlay}>
            <div style={styles.noDataText}>
              No study activity recorded this week
            </div>
          </div>
        )}
      </div>
      
      <div style={styles.legendContainer}>
        <div style={styles.legendLine} />
        <span>Study Hours</span>
      </div>
    </div>
  );
};

export default StudyHoursChart;