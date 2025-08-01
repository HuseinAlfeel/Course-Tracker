import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../../services/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register function
  const register = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update display name
      await updateProfile(user, {
        displayName: name
      });
      
      // Create user document in Firestore
      try {
        await setDoc(doc(db, "users", user.uid), {
          name,
          email,
          progress: [],
          streak: 0,
          lastUpdated: new Date().toISOString(),
          joinDate: new Date().toISOString(),
          achievements: [],  // Add this field for achievements
          studySessions: [], // Add this field for study sessions
          totalStudyTime: 0,  // Add this field for total study time
          bio: '',  // Profile info
          goal: 'Complete the full course',  // Learning goal
          studyReminder: false,  // Study preference
          hoursTarget: 5  // Weekly study hours target
        });
      } catch (firestoreError) {
        console.error("Error creating user document:", firestoreError);
      }
      
      return user;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // 🔐 LOGIN: Enhanced with better error handling and user feedback
  const login = async (email, password) => {
    console.log("🔐 Attempting login for:", email);
    
    try {
      setLoading(true);
      
      // Input validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Login successful with Firebase Auth");
      
      // Manually fetch user data to speed up the process
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setCurrentUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          auth: userCredential.user, // Store auth object for profile updates
          ...userData
        });
      }
      
      return userCredential.user;
    } catch (error) {
      console.error("❌ Login error:", error);
      
      // Provide user-friendly error messages
      let errorMessage = 'Login failed. Please try again.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    return signOut(auth);
  };
  
  // Update user profile
  const updateUserProfile = async (userId, profileData) => {
    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, profileData);
      
      // Update the current user state
      setCurrentUser(prevUser => ({
        ...prevUser,
        ...profileData
      }));
      
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    console.log("Setting up auth listener");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              auth: user, // Store auth object for profile updates
              ...userDoc.data()
            });
          } else {
            // User auth exists but no document - create one
            await setDoc(doc(db, "users", user.uid), {
              name: user.displayName || user.email.split('@')[0],
              email: user.email,
              progress: [],
              streak: 0,
              lastUpdated: new Date().toISOString(),
              joinDate: new Date().toISOString(),
              achievements: [],
              studySessions: [],
              totalStudyTime: 0,
              bio: '',
              goal: 'Complete the full course',
              studyReminder: false,
              hoursTarget: 5
            });
            
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              auth: user,
              name: user.displayName || user.email.split('@')[0],
              progress: [],
              streak: 0,
              achievements: [],
              studySessions: [],
              totalStudyTime: 0,
              bio: '',
              goal: 'Complete the full course',
              studyReminder: false,
              hoursTarget: 5
            });
          }
        } catch (error) {
          console.error("Error getting user document:", error);
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            auth: user,
            name: user.displayName || user.email.split('@')[0]
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    register,
    login,
    logout,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;