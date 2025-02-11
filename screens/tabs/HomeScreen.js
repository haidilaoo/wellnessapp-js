import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { COLORS, globalStyles } from "../../globalStyles";
import { ScrollView } from "react-native-gesture-handler";
import QuestButton from "../../components/QuestButton";
import Icon from "react-native-vector-icons/Feather";

//DATABASE
import {
  collection,
  getDocs,
  setDoc,
  doc,
  getDoc,
  Firestore,
} from "firebase/firestore";
import { db, firestore } from "../../firebaseConfig";
import { getAuth } from "firebase/auth"; // Import for Firebase authentication
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useDailyReset from "./useDailyReset";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  // const [meditateQuest, setMeditateQuest] = useState([]);
  // const [moveQuest, setMoveQuest] = useState([]);
  // const [musicQuest, setMusicQuest] = useState([]);
  // const [sleepQuest, setSleepQuest] = useState([]);
  const [quests, setQuests] = useState([]); // Stores selected 6 quests
  const [currentEmotion, setCurrentEmotion] = useState(null);
  
  const userUid = getAuth().currentUser.uid;
  const emotion = useDailyReset(userUid); // This hook will reset and retrieve currentEmotion daily

  useEffect(() => {
    const fetchQuests = async () => {
      const userDoc = await getDoc(doc(db, "users", userUid));
      try {
        // Fetch user's currentEmotion

        const emotion = userDoc.data().currentEmotion;
        console.log("Current Emotion:", emotion);

        setCurrentEmotion(emotion);
        console.log("Current Emotion: ", currentEmotion);
     
        // const emotion = "joyful"; // Replace this with dynamic emotion if needed
        const docRef = doc(db, "quests", emotion); // Reference specific emotion document
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // setMeditateQuest(docSnap.data().meditate || []); // Ensure array fallback if field doesn't exist
          // setMoveQuest(docSnap.data().move || []);
          // setMusicQuest(docSnap.data().music|| []);
          // setSleepQuest(docSnap.data().sleep || []);
          // Get all categories
          const meditate = docSnap.data().meditate || [];
          const move = docSnap.data().move || [];
          const music = docSnap.data().music || [];
          const sleep = docSnap.data().sleep || [];

          // Combine into one object with categories
          // const allQuests = [
          //   ...meditate.map((q) => ({ title: q, category: "Meditate" })),
          //   ...move.map((q) => ({ title: q, category: "Move" })),
          //   ...music.map((q) => ({ title: q, category: "Music" })),
          //   ...sleep.map((q) => ({ title: q, category: "Sleep" })),
          // ];

          // Convert to objects with category labels
          const meditateQuests = meditate.map((q) => ({
            title: q,
            category: "Meditate",
          }));
          const moveQuests = move.map((q) => ({ title: q, category: "Move" }));
          const musicQuests = music.map((q) => ({
            title: q,
            category: "Music",
          }));
          const sleepQuests = sleep.map((q) => ({
            title: q,
            category: "Sleep",
          }));
          // Combine non-sleep quests
          const nonSleepQuests = [
            ...meditateQuests,
            ...moveQuests,
            ...musicQuests,
          ];
          // // Shuffle and select up to 6 quests
          // const selectedQuests = shuffleAndSelect(allQuests, 6);
          // setQuests(selectedQuests);

          // Shuffle and select 4 from non-sleep categories
          const selectedNonSleep = shuffleAndSelect(nonSleepQuests, 4);
          // Shuffle and select up to 2 sleep quests
          const selectedSleep = shuffleAndSelect(sleepQuests, 2);
          // Ensure sleep quests always appear at the end
          setQuests([...selectedNonSleep, ...selectedSleep]);
        } else {
          console.warn(`No document found for emotion: ${emotion}`);
        }
      } catch (error) {
        console.error("Error fetching quests:", error);
      }
    };

    fetchQuests();
  }, []);
  // Manually trigger reset button for testing
  const handleManualReset = async () => {
    try {
      const today = new Date().toLocaleDateString();
      // Force the reset logic to run, regardless of the date
      await AsyncStorage.setItem("lastResetDate", today); // Update stored date to trigger reset
      await setDoc(
        doc(db, "users", userUid),
        { currentEmotion: null },
        { merge: true }
      );
      setCurrentEmotion(null); // Reset local state
      console.log("Manually reset currentEmotion to null");
    } catch (error) {
      console.error("Error manually resetting emotion:", error);
    }
  };
  // Function to shuffle array and pick `n` items
  const shuffleAndSelect = (array, n) => {
    const shuffled = array.sort(() => Math.random() - 0.5); // Shuffle
    return shuffled.slice(0, n); // Get first `n` items
  };
  const navigation = useNavigation();
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={[globalStyles.container, globalStyles.spaceBetween, { flex: 1 }]}
      >
        <Image
          source={require("../../assets/topbanner-image.png")}
          style={globalStyles.topbanner}
          resizeMode="contain"
        />
        <View style={[globalStyles.gap24, { marginTop: 250 }]}>
          <Text style={globalStyles.h3}>Today's quests</Text>
          <Button title="Manually Reset Emotion" onPress={handleManualReset} />
          <TouchableOpacity
            style={styles.emotionContainer}
            onPress={() => navigation.navigate("askEmotion")}
          >
            <View
              style={[
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              ]}
            >
              <View style={globalStyles.gap4}>
                {currentEmotion ? (
                  <>
                    <Text
                      style={[globalStyles.smallText, { color: COLORS.white }]}
                    >
                      Today's emotion
                    </Text>
                    <Text style={[globalStyles.pBold, { color: COLORS.white }]}>
                      {currentEmotion.charAt(0).toUpperCase() +
                        currentEmotion.slice(1)}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text
                      style={[globalStyles.smallText, { color: COLORS.white }]}
                    >
                      How was your day?
                    </Text>
                    <Text style={[globalStyles.pBold, { color: COLORS.white }]}>
                      Record your emotion today
                    </Text>
                  </>
                )}
              </View>
              <Icon name="chevron-right" size={24} color={COLORS.white} />
            </View>
          </TouchableOpacity>
          <View style={globalStyles.gap16}>
            {/* {meditateQuest && meditateQuest.length > 0 ? (
              meditateQuest.map((quest, index) => (
                <QuestButton key={index} title={quest} category="Meditate" />
              ))
            ) : (
              <Text>Loading or no quests available...</Text>
            )}
            {moveQuest && moveQuest.length > 0 ? (
              moveQuest.map((quest, index) => (
                <QuestButton key={index} title={quest} category="Move" />
              ))
            ) : (
              <Text>Loading or no quests available...</Text>
            )}
            {musicQuest && musicQuest.length > 0 ? (
              musicQuest.map((quest, index) => (
                <QuestButton key={index} title={quest} category="Music" />
              ))
            ) : (
              <Text>Loading or no quests available...</Text>
            )}
            {sleepQuest && sleepQuest.length > 0 ? (
              sleepQuest.map((quest, index) => (
                <QuestButton key={index} title={quest} category="Sleep" />
              ))
            ) : (
              <Text>Loading or no quests available...</Text>
            )} */}

            {quests.length > 0 && currentEmotion !== null ? (
              quests.map((quest, index) => (
                <QuestButton
                  key={index}
                  title={quest.title}
                  category={quest.category}
                />
              ))
            ) : (
              <Text>Loading or no quests available...</Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  emotionContainer: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 16,
    // borderColor: COLORS.borderDefault,
    // borderWidth: 1,
  },
});
