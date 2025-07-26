// Simple audio test component
import React from 'react';

const AudioTest = () => {
  const testAudio = (filename) => {
    console.log('Testing audio paths...');
    
    // Test different path configurations
    const paths = [
      `/Course-Tracker/sounds/${filename}`,
      `/sounds/${filename}`,
      `./sounds/${filename}`,
      `sounds/${filename}`,
      `${window.location.origin}/Course-Tracker/sounds/${filename}`,
      `${process.env.PUBLIC_URL}/sounds/${filename}`
    ];
    
    paths.forEach((path, index) => {
      const audio = new Audio(path);
      console.log(`Testing path ${index + 1}: ${path}`);
      
      audio.addEventListener('loadstart', () => {
        console.log(`✅ Path ${index + 1} loading started: ${path}`);
      });
      
      audio.addEventListener('canplay', () => {
        console.log(`✅ Path ${index + 1} can play: ${path}`);
      });
      
      audio.addEventListener('error', (e) => {
        console.log(`❌ Path ${index + 1} failed: ${path}`, e);
      });
      
      // Try to load (don't play yet)
      audio.load();
    });
  };

  return (
    <div style={{ position: 'fixed', bottom: '10px', right: '10px', background: 'white', padding: '10px', border: '1px solid #ccc', zIndex: 9999 }}>
      <h4>Audio Test</h4>
      <button onClick={() => testAudio('LessonVictory.mp3')}>
        Test Lesson Sound
      </button>
      <br />
      <button onClick={() => testAudio('BigVictory.mp3')}>
        Test Big Victory Sound
      </button>
    </div>
  );
};

export default AudioTest;
