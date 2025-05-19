import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../Auth/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { updateProfile } from 'firebase/auth';

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const isMobile = window.innerWidth <= 768;
  
  // Form states
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    bio: '',
    goal: '',
    studyReminder: false,
    hoursTarget: 5
  });
  
  // Populate form with current user data
  useEffect(() => {
    if (currentUser) {
      setUserData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        bio: currentUser.bio || '',
        goal: currentUser.goal || 'Complete the full course',
        studyReminder: currentUser.studyReminder || false,
        hoursTarget: currentUser.hoursTarget || 5
      });
    }
  }, [currentUser]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData({
      ...userData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSave = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Update Firestore document
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        name: userData.name,
        bio: userData.bio,
        goal: userData.goal,
        studyReminder: userData.studyReminder,
        hoursTarget: parseInt(userData.hoursTarget) || 5
      });
      
      // If user has Auth profile, update that too
      if (currentUser.auth) {
        await updateProfile(currentUser.auth, {
          displayName: userData.name
        });
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: isMobile ? '12px' : '20px',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px'
    },
    title: {
      color: '#ffffff',
      fontSize: '1.5rem',
      margin: 0
    },
    card: {
      backgroundColor: '#2c2c2c',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
      marginBottom: '20px',
      border: '1px solid #3c3c3c'
    },
    profileHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px'
    },
    avatar: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: '#4d9aff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      color: 'white',
      marginRight: '20px',
      fontWeight: '600'
    },
    profileInfo: {
      flex: 1
    },
    profileName: {
      color: 'white',
      fontSize: '1.5rem',
      marginTop: 0,
      marginBottom: '5px'
    },
    profileEmail: {
      color: '#b3b3b3',
      margin: 0
    },
    editButton: {
      backgroundColor: isEditing ? '#6b7280' : '#4d9aff',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.2s ease'
    },
    section: {
      marginBottom: '20px'
    },
    sectionTitle: {
      color: '#ffffff',
      fontSize: '1.1rem',
      marginTop: 0,
      marginBottom: '15px',
      borderBottom: '1px solid #3c3c3c',
      paddingBottom: '10px'
    },
    formGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      color: '#e0e0e0',
      marginBottom: '8px',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      backgroundColor: '#333333',
      border: '1px solid #4c4c4c',
      borderRadius: '6px',
      color: '#e0e0e0',
      fontSize: '1rem',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: '10px 12px',
      backgroundColor: '#333333',
      border: '1px solid #4c4c4c',
      borderRadius: '6px',
      color: '#e0e0e0',
      fontSize: '1rem',
      minHeight: '100px',
      resize: 'vertical',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '10px 12px',
      backgroundColor: '#333333',
      border: '1px solid #4c4c4c',
      borderRadius: '6px',
      color: '#e0e0e0',
      fontSize: '1rem',
      boxSizing: 'border-box'
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center'
    },
    checkbox: {
      marginRight: '10px',
      width: '18px',
      height: '18px',
      accentColor: '#4d9aff'
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
      marginTop: '20px'
    },
    saveButton: {
      backgroundColor: loading ? '#6b7280' : '#4dff9d',
      color: loading ? '#e0e0e0' : '#000000',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '6px',
      cursor: loading ? 'default' : 'pointer',
      fontWeight: '600',
      transition: 'all 0.2s ease'
    },
    cancelButton: {
      backgroundColor: '#6b7280',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.2s ease'
    },
    statsCard: {
      backgroundColor: '#213547',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
      marginBottom: '20px',
      border: '1px solid #3c3c3c',
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
      gap: '15px'
    },
    statItem: {
      textAlign: 'center',
      padding: '10px'
    },
    statValue: {
      color: '#4d9aff',
      fontSize: '1.8rem',
      fontWeight: '700',
      margin: '0 0 5px 0'
    },
    statLabel: {
      color: '#b3b3b3',
      fontSize: '0.9rem'
    },
    error: {
      color: '#ff6b6b',
      marginTop: '10px',
      padding: '10px',
      borderRadius: '6px',
      backgroundColor: 'rgba(255, 107, 107, 0.1)',
      border: '1px solid rgba(255, 107, 107, 0.3)'
    },
    success: {
      color: '#4dff9d',
      marginTop: '10px',
      padding: '10px',
      borderRadius: '6px',
      backgroundColor: 'rgba(77, 255, 157, 0.1)',
      border: '1px solid rgba(77, 255, 157, 0.3)'
    },
    fieldValueDisplay: {
      color: '#e0e0e0',
      backgroundColor: '#333333',
      padding: '10px 12px',
      borderRadius: '6px',
      marginBottom: '15px'
    }
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Profile Settings</h2>
        <button 
          style={styles.editButton}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </button>
      </div>
      
      <div style={styles.card}>
        <div style={styles.profileHeader}>
          <div style={styles.avatar}>
            {userData.name.charAt(0) || 'U'}
          </div>
          <div style={styles.profileInfo}>
            <h3 style={styles.profileName}>{userData.name || 'User'}</h3>
            <p style={styles.profileEmail}>{userData.email}</p>
          </div>
        </div>
        
        {!isEditing ? (
          <div>
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>About Me</h4>
              <div style={styles.fieldValueDisplay}>
                {userData.bio || 'No bio information added yet.'}
              </div>
            </div>
            
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>Learning Goals</h4>
              <div style={styles.fieldValueDisplay}>
                {userData.goal}
              </div>
            </div>
            
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>Study Preferences</h4>
              <div style={styles.fieldValueDisplay}>
                Study Reminders: {userData.studyReminder ? 'Enabled' : 'Disabled'}
              </div>
              <div style={styles.fieldValueDisplay}>
                Weekly Study Goal: {userData.hoursTarget} hours
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>Personal Information</h4>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Name</label>
                <input 
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Your display name"
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Email (Cannot be changed)</label>
                <input 
                  type="email"
                  name="email"
                  value={userData.email}
                  disabled
                  style={{...styles.input, backgroundColor: '#2a2a2a', cursor: 'not-allowed'}}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Bio</label>
                <textarea 
                  name="bio"
                  value={userData.bio}
                  onChange={handleChange}
                  style={styles.textarea}
                  placeholder="Tell us a bit about yourself"
                ></textarea>
              </div>
            </div>
            
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>Learning Preferences</h4>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Learning Goal</label>
                <select 
                  name="goal"
                  value={userData.goal}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="Complete the full course">Complete the full course</option>
                  <option value="Focus on Front-End skills">Focus on Front-End skills</option>
                  <option value="Focus on Back-End skills">Focus on Back-End skills</option>
                  <option value="Learn specific technologies">Learn specific technologies</option>
                  <option value="Prepare for a job interview">Prepare for a job interview</option>
                  <option value="Build a portfolio project">Build a portfolio project</option>
                </select>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Weekly Study Target (hours)</label>
                <input 
                  type="number"
                  name="hoursTarget"
                  value={userData.hoursTarget}
                  onChange={handleChange}
                  style={styles.input}
                  min="1"
                  max="40"
                />
              </div>
              
              <div style={styles.checkboxContainer}>
                <input 
                  type="checkbox"
                  name="studyReminder"
                  checked={userData.studyReminder}
                  onChange={handleChange}
                  style={styles.checkbox}
                  id="studyReminder"
                />
                <label htmlFor="studyReminder" style={{...styles.label, display: 'inline'}}>
                  Enable study reminders
                </label>
              </div>
            </div>
            
            <div style={styles.buttonGroup}>
              <button 
                style={styles.cancelButton}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button 
                style={styles.saveButton}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
            
            {error && <div style={styles.error}>{error}</div>}
            {success && <div style={styles.success}>Profile updated successfully!</div>}
          </div>
        )}
      </div>
      
      <div style={styles.statsCard}>
        <div style={styles.statItem}>
          <div style={styles.statValue}>
            {currentUser?.streak || 0}
          </div>
          <div style={styles.statLabel}>
            Day Streak
          </div>
        </div>
        
        <div style={styles.statItem}>
          <div style={styles.statValue}>
            {currentUser?.progress?.filter(p => p.status === 'completed').length || 0}
          </div>
          <div style={styles.statLabel}>
            Modules Completed
          </div>
        </div>
        
        <div style={styles.statItem}>
          <div style={styles.statValue}>
            {currentUser?.achievements?.length || 0}
          </div>
          <div style={styles.statLabel}>
            Achievements
          </div>
        </div>
        
        <div style={styles.statItem}>
          <div style={styles.statValue}>
            {currentUser?.totalStudyTime ? 
              (currentUser.totalStudyTime > 60 ? 
                Math.floor(currentUser.totalStudyTime / 60) + 'h' : 
                currentUser.totalStudyTime + 'm') 
              : '0h'}
          </div>
          <div style={styles.statLabel}>
            Total Study Time
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;