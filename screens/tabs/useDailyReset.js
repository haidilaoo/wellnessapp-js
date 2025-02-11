import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { View, Text } from 'react-native'
import React from 'react'
import { doc, setDoc } from 'firebase/firestore';

export default function useDailyReset(userUid)  {
  const [currentEmotion, setCurrentEmotion] = useState(null);
//   const [variable, setVariable] = useState(0); // Your variable to reset
  const [lastResetDate, setLastResetDate] = useState(null);

  useEffect(() => {
    const resetEmotionIfNeeded = async () => {
      try {
        const storedDate = await AsyncStorage.getItem('lastResetDate');
        const today = new Date().toLocaleDateString(); // Format as YYYY-MM-DD or any preferred format

        console.log('Stored date: ', storedDate);
        console.log('Today date: ', today);
        if (storedDate !== today) {
          // Reset the variable if the date has changed
                   // Reset the emotion in Firestore to null or any default value you want
                   await setDoc(
                             doc(db, "users", userUid),
                             { currentEmotion: null },
                             { merge: true });
        
                  setCurrentEmotion(null); // Update local state
          await AsyncStorage.setItem('lastResetDate', today); // Store today's date
          console.log('Reseted emotion successfully.');
        }
      } catch (error) {
        console.error('Error checking/resetting emotion', error);
      }
    };

    resetEmotionIfNeeded();
  }, [userUid]); // ✅ Only re-run when userUid changes

  return currentEmotion;
};

// export default useDailyReset;
