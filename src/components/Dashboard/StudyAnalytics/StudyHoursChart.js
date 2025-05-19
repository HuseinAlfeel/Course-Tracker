import React, { useState } from 'react';

const StudyHoursChart = ({ studyHoursData, isMobile }) => {
  const [hoveredDay, setHoveredDay] = useState(null);

  const styles = {
    container: {
      marginTop: '20px'
    },
    title: {
      marginBottom: '10px', 
      color: '#ffffff', 
      fontSize: isMobile ? '1rem' : '1.1rem'
    },
    chartContainer: {
      height: isMobile ? '250px' : '300px', 
      backgroundColor: '#272727',
      borderRadius: '8px', 
      padding: isMobile ? '15px 10px' : '20px', 
      position: 'relative',
      border: '1px solid #3c3c3c',
      overflow: 'hidden'
    },
    yAxisLabels: {
      position: 'absolute',
      left: isMobile ? '5px' : '10px',
      top: 0,
      bottom: '30px',
      width: isMobile ? '25px' : '30px',
      display: 'flex',
      flexDirection: 'column-reverse',
      justifyContent: 'space-between',
      paddingTop: '10px',
      paddingBottom: '10px'
    },
    yAxisLabel: {
      color: '#999', 
      fontSize: isMobile ? '0.7rem' : '0.8rem'
    },
    gridLines: {
      position: 'absolute',
      left: isMobile ? '30px' : '50px',
      right: '10px',
      top: '10px',
      bottom: '30px',
      display: 'flex',
      flexDirection: 'column-reverse',
      justifyContent: 'space-between'
    },
    gridLine: (isBaseLine) => ({
      width: '100%', 
      borderBottom: isBaseLine ? '1px solid #444' : '1px dashed #333',
      height: 0
    }),
    interactiveArea: {
      position: 'absolute',
      left: isMobile ? '30px' : '50px',
      right: '10px',
      top: '10px',
      bottom: '30px',
      display: 'flex',
      justifyContent: 'space-between',
      zIndex: 3
    },
    dayHoverArea: {
      height: '100%',
      flex: 1,
      cursor: 'pointer'
    },
    tooltip: {
      position: 'absolute',
      backgroundColor: 'rgba(40, 40, 40, 0.95)',
      color: '#fff',
      padding: '10px',
      borderRadius: '4px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
      border: '1px solid #4d9aff',
      zIndex: 10,
      fontSize: '0.85rem',
      pointerEvents: 'none'
    },
    tooltipDay: {
      fontWeight: 'bold', 
      marginBottom: '5px'
    },
    tooltipHours: {
      color: '#ff9d4d', 
      fontWeight: 'bold'
    },
    tooltipModules: {
      fontSize: '0.8rem', 
      marginTop: '5px', 
      color: '#aaa'
    },
    svg: {
      position: 'absolute',
      left: isMobile ? '30px' : '50px',
      right: '10px',
      top: '10px',
      bottom: '30px',
      width: `calc(100% - ${isMobile ? '40' : '60'}px)`,
      height: 'calc(100% - 40px)',
      overflow: 'visible'
    },
    xAxisLabels: {
      position: 'absolute',
      left: isMobile ? '30px' : '50px',
      right: '10px',
      bottom: '5px',
      display: 'flex',
      justifyContent: 'space-between'
    },
    xAxisLabel: (isHovered) => ({
      color: isHovered ? '#ffffff' : '#999', 
      fontSize: isMobile ? '0.7rem' : '0.8rem',
      fontWeight: isHovered ? 'bold' : 'normal'
    }),
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
      height: '3px', 
      backgroundColor: '#ff9d4d', 
      marginRight: '8px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        Daily Study Hours (Last Week)
      </div>
      
      <div style={styles.chartContainer}>
        {/* Y-axis labels */}
        <div style={styles.yAxisLabels}>
          {[0, 0.75, 1.5, 2.25, 3].map(value => (
            <div key={value} style={styles.yAxisLabel}>{value}</div>
          ))}
        </div>
        
        {/* Grid lines */}
        <div style={styles.gridLines}>
          {[0, 0.75, 1.5, 2.25, 3].map((value, i) => (
            <div key={i} style={styles.gridLine(i === 0)} />
          ))}
        </div>

        {/* Interactive hover areas */}
        <div style={styles.interactiveArea}>
          {studyHoursData.map((day, i) => (
            <div 
              key={i}
              style={styles.dayHoverArea}
              onMouseEnter={() => setHoveredDay(i)}
              onMouseLeave={() => setHoveredDay(null)}
              onTouchStart={() => setHoveredDay(i)}
              onTouchEnd={() => setTimeout(() => setHoveredDay(null), 2000)}
            />
          ))}
        </div>
        
        {/* Hover tooltips */}
        {hoveredDay !== null && (
          <div style={{
            ...styles.tooltip,
            left: `${(isMobile ? 30 : 50) + (hoveredDay * (100 - (isMobile ? 40 : 70)) / (studyHoursData.length - 1)) + (isMobile ? 20 : 35)}px`,
            top: '40px'
          }}>
            <div style={styles.tooltipDay}>
              {studyHoursData[hoveredDay].day}
            </div>
            <div>
              Hours: <span style={styles.tooltipHours}>
                {studyHoursData[hoveredDay].hours.toFixed(1)}
              </span>
            </div>
            {studyHoursData[hoveredDay].hours > 0 && (
              <div style={styles.tooltipModules}>
                ({Math.round(studyHoursData[hoveredDay].hours / 1.5)} modules)
              </div>
            )}
          </div>
        )}

        {/* SVG for smooth line chart - IMPROVED VERSION */}
        <svg 
          style={styles.svg}
          viewBox={`0 0 ${studyHoursData.length - 1} 3`}
          preserveAspectRatio="none"
        >
          {/* Create smooth curve with improved control points */}
          <path
            d={`
              M 0 ${3 - Math.min(studyHoursData[0].hours, 2.99)}
              ${studyHoursData.slice(1).map((point, i) => {
                const prevX = i;
                const prevY = 3 - Math.min(studyHoursData[i].hours, 2.99);
                const currX = i + 1;
                const currY = 3 - Math.min(point.hours, 2.99);
                
                // Improved control points for smoother curve
                const cp1x = prevX + 0.3;
                const cp1y = prevY;
                const cp2x = currX - 0.3;
                const cp2y = currY;
                
                return `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${currX} ${currY}`;
              }).join(' ')}
            `}
            fill="none"
            stroke="#ff9d4d"
            strokeWidth="0.08"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Area under the curve with gradient */}
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff9d4d" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ff9d4d" stopOpacity="0.05" />
          </linearGradient>
          
          <path
            d={`
              M 0 ${3 - Math.min(studyHoursData[0].hours, 2.99)}
              ${studyHoursData.slice(1).map((point, i) => {
                const prevX = i;
                const prevY = 3 - Math.min(studyHoursData[i].hours, 2.99);
                const currX = i + 1;
                const currY = 3 - Math.min(point.hours, 2.99);
                
                // Improved control points
                const cp1x = prevX + 0.3;
                const cp1y = prevY;
                const cp2x = currX - 0.3;
                const cp2y = currY;
                
                return `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${currX} ${currY}`;
              }).join(' ')}
              L ${studyHoursData.length - 1} 3
              L 0 3
              Z
            `}
            fill="url(#areaGradient)"
            stroke="none"
          />
          
          {/* Data points with improved hover effect */}
          {studyHoursData.map((point, i) => (
            <g key={i}>
              {/* Larger hit area for hover */}
              <circle
                cx={i}
                cy={3 - Math.min(point.hours, 2.99)}
                r="0.2"
                fill="transparent"
                stroke="transparent"
              />
              {/* Visible point */}
              <circle
                cx={i}
                cy={3 - Math.min(point.hours, 2.99)}
                r={hoveredDay === i ? "0.12" : "0.08"}
                fill={hoveredDay === i ? "#ffffff" : "#ff9d4d"}
                stroke={hoveredDay === i ? "#ff9d4d" : "none"}
                strokeWidth="0.03"
              />
            </g>
          ))}
        </svg>
        
        {/* X-axis labels */}
        <div style={styles.xAxisLabels}>
          {studyHoursData.map((day, i) => (
            <div 
              key={i} 
              style={styles.xAxisLabel(hoveredDay === i)}
            >
              {day.day}
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div style={styles.legendContainer}>
        <div style={styles.legendLine} />
        <span>Study Hours</span>
      </div>
    </div>
  );
};

export default StudyHoursChart;