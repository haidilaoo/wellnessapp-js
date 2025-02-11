import { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Import Firestore instance

import { View, Text } from 'react-native'
import React from 'react'


export const UserContext = createContext(null);

// UserProvider Component
export const UserProvider = ({ children }) => {
  const [userID, setUser] = useState(null);
  const [selection, setSelection] = useState(null);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUser(firebaseUser);
          setSelection(userDoc.data().selection || null); // Fallback emotion
          setCurrentEmotion(userDoc.data().currentEmotion || null); // Fallback emotion
        }
      } else {
        setUser(null);
        setSelection(null);
        setCurrentEmotion(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{  selection, currentEmotion }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook for Accessing Context
export const useUser = () => useContext(UserContext);