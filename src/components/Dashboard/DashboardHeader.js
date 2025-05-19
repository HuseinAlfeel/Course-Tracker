import React from 'react';

const DashboardHeader = ({ currentUser }) => {
  // Random motivational quotes
  const quotes = [
    "The only way to learn a new programming language is by writing programs in it.",
    "The expert in anything was once a beginner.",
    "Code is like humor. When you have to explain it, it's bad.",
    "First, solve the problem. Then, write the code.",
    "Programming isn't about what you know; it's about what you can figure out."
  ];
  
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const isMobile = window.innerWidth <= 768;
  
  const styles = {
    container: {
      backgroundColor: '#2c2c2c', 
      padding: isMobile ? '15px' : '20px', 
      borderRadius: '10px', 
      textAlign: 'center',
      marginBottom: isMobile ? '20px' : '30px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
      border: '1px solid #3c3c3c'
    },
    title: {
      margin: '0',
      fontSize: isMobile ? '1.3rem' : '1.5rem',
      color: '#ffffff'
    },
    quote: {
      color: '#b3b3b3',
      fontStyle: 'italic',
      margin: '10px 0 0',
      fontSize: isMobile ? '0.9rem' : '1rem'
    }
  };
  
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Welcome, {currentUser?.name || 'User'}!</h2>
      <p style={styles.quote}>"{randomQuote}"</p>
    </div>
  );
};

export default DashboardHeader;