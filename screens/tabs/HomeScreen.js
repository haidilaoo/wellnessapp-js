import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Animated } from "react-native";
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
  serverTimestamp,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db, firestore } from "../../firebaseConfig";
import { getAuth } from "firebase/auth"; // Import for Firebase authentication
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useDailyReset from "./useDailyReset";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomSnackbar from "../../components/Snackbar";

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
        console.log("Current Emotion from database:", emotion);

        setCurrentEmotion(emotion);
        console.log("Current Emotion after reset: ", currentEmotion);

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
            title: q.title,
            description: q.description,
            category: "Meditate",
          }));
          const moveQuests = move.map((q) => ({
            title: q.title,
            description: q.description,
            category: "Move",
          }));
          const musicQuests = music.map((q) => ({
            title: q.title,
            description: q.description,
            category: "Music",
          }));
          const sleepQuests = sleep.map((q) => ({
            title: q.title,
            description: q.description,
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
        // console.error("Error fetching quests:", error);
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

  // const [visible, setVisible] = useState(true); // for non arrays
  const [visibleQuests, setVisibleQuests] = useState([]); // Initially, all quests are visible
  const [questAnimations, setQuestAnimations] = useState([]);

  // Update visibleQuests when quests are loaded
  useEffect(() => {
    if (quests.length > 0) {
      setVisibleQuests(new Array(quests.length).fill(true)); // Ensure all quests are initially visible
      setQuestAnimations(quests.map(() => new Animated.Value(1))); // Start fully visible
    }
  }, [quests]); // Runs only when `quests` updates

  const [showNotification, setShowNotification] = useState(false);

  // const fadeAnim = new Animated.Value(0); // For fade-in effect
  const [lastRemovedIndex, setLastRemovedIndex] = useState(null);
  const handleHideComponent = (index) => {
    // setVisible(false); // Hide the component

    Animated.timing(questAnimations[index], {
      toValue: 0, // Fully hidden
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
    setVisibleQuests((prev) =>
      prev.map((isVisible, i) => (i === index ? false : isVisible))
    );
    setLastRemovedIndex(index); // Store last removed quest index

    setShowNotification(true); // Show notification // State update happens asynchronously
    console.log("Notification state: ", showNotification);
  });
  };

  const handleShowComponent = () => {
    // setVisible(false); // Hide the component
    if (lastRemovedIndex !== null) {
      
      setVisibleQuests((prev) =>
        prev.map((isVisible, i) => (i === lastRemovedIndex ? true : isVisible))
      );
      setTimeout(() => {
      Animated.timing(questAnimations[lastRemovedIndex], {
        toValue: 1, // Fully visible again
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
      setLastRemovedIndex(null); // Reset index after restoring
    });
  }, 50); // Small delay to ensure visibility before animation starts
    setShowNotification(false); // Show notification // State update happens asynchronously
    console.log("Notification state: ", showNotification);
  }
  };

  const onDismissSnackBar = () => {
    setShowNotification(false);
  };
  const [completedQuest, setCompletedQuest] = useState({
    mediate: 0,
    sleep: 0,
    move: 0,
    music: 0,
  });
  const insertQuestToDatabase = async (category) => {
    const userUid = getAuth().currentUser.uid;

    try {
      //2. Update emotion_tally subcollection
      const questRef = doc(db, "users", userUid, "quest_tally", category);
      const questDoc = await getDoc(questRef); // check if quest_tally alr exists as doc

      if (questDoc.exists()) {
        await updateDoc(questRef, {
          count: increment(1),
          last_updated: serverTimestamp(),
        });
      } else {
        await setDoc(questRef, {
          count: 1,
          last_updated: serverTimestamp(),
        });
      }
      console.log(`Updated quest tally for category: ${category}`);
    } catch (error) {
      console.error("Error saving quest to database:", error);
    }
  };
  const handleCompletedQuest = (category) => {
    setCompletedQuest((prev) => ({
      ...prev,
      [category]: prev[category] + 1,
    }));
    insertQuestToDatabase(category);
  };

  const removeQuestFromDatabase = async (category) => {
    const userUid = getAuth().currentUser.uid;

    try {
      const questRef = doc(db, "users", userUid, "quest_tally", category);
      const questDoc = await getDoc(questRef);

      if (questDoc.exists()) {
        const currentCount = questDoc.data().count;

        if (currentCount > 0) {
          await updateDoc(questRef, {
            count: increment(-1), // Decrement count
            last_updated: serverTimestamp(),
          });
          console.log(`Removed quest from category: ${category}`);
        } else {
          console.log(`No quests to remove in category: ${category}`);
        }
      } else {
        console.log(`Quest category '${category}' does not exist.`);
      }
    } catch (error) {
      console.error("Error removing quest from database:", error);
    }
  };
  const handleUndoQuest = (category) => {
    setCompletedQuest((prev) => ({
      ...prev,
      [category]: Math.max(0, prev[category] - 1), // Ensure count doesn't go below 0
    }));

    removeQuestFromDatabase(category);
  };
  const allQuestsCompleted =
    quests.length > 0 && visibleQuests.every((visible) => !visible);
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            globalStyles.container,
            globalStyles.spaceBetween,
            { flex: 1 },
          ]}
        >
          <Image
            source={require("../../assets/topbanner-image.png")}
            style={globalStyles.topbanner}
            resizeMode="contain"
          />
          <View style={[globalStyles.gap24, { marginTop: 250 }]}>
            {/* <Text style={globalStyles.h3}>Today's quests</Text> */}
            {/* <Button
              title="Manually Reset Emotion"
              onPress={handleManualReset}
            /> */}

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
                        style={[
                          globalStyles.smallText,
                          { color: COLORS.white },
                        ]}
                      >
                        Today's emotion
                      </Text>
                      <Text
                        style={[globalStyles.pBold, { color: COLORS.white }]}
                      >
                        {currentEmotion.charAt(0).toUpperCase() +
                          currentEmotion.slice(1)}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text
                        style={[
                          globalStyles.smallText,
                          { color: COLORS.white },
                        ]}
                      >
                        How was your day?
                      </Text>
                      <Text
                        style={[globalStyles.pBold, { color: COLORS.white }]}
                      >
                        Record your emotion today
                      </Text>
                    </>
                  )}
                </View>
                <Icon name="chevron-right" size={24} color={COLORS.white} />
              </View>
            </TouchableOpacity>
            <Text style={globalStyles.h3}>Today's quests</Text>
            <View style={globalStyles.gap16}>
              {quests.length > 0 && currentEmotion !== null ? (
                allQuestsCompleted ? (
                  // All quests completed UI
                  <View style={styles.allCompletedContainer}>
                    <Image
                      source={require("../../assets/noquest.png")}
                      style={{ width: 167, height: 160 }}
                    />
                    <Text
                      style={[
                        globalStyles.pMedium,
                        { textAlign: "center", color: COLORS.primary, marginTop: 8 },
                      ]}
                    >
                      All quests completed!
                    </Text>
                    <Text
                      style={[
                        globalStyles.smallText,
                        { textAlign: "center", opacity: 0.7 , },
                      ]}
                    >
                      Choose another emotion to generate new quests
                    </Text>
                    <TouchableOpacity
                      style={[styles.newEmotionButton, {marginTop: 16}]}
                      onPress={() => navigation.navigate("askEmotion")}
                    >
                      <Text
                        style={[
                          globalStyles.smallTextMedium,
                          { color: COLORS.primary },
                        ]}
                      >
                        Record new emotion
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  quests.map((quest, index) =>
                    visibleQuests[index] ? (
                      <Animated.View
                    key={index}
                    style={[
                      
                      {
                        opacity: questAnimations[index], // Fade effect
                        transform: [{ translateX: questAnimations[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [300, 0], // Moves out of view
                        }) }],
                      },
                    ]}
                  >
                      <QuestButton
                        key={index}
                        title={quest.title}
                        category={quest.category}
                        description={quest.description}
                        onPress={() => {
                          handleHideComponent(index);
                          handleCompletedQuest(quest.category);
                        }}
                      />
                      </Animated.View>
                    ) : null
                  )
                )
              ) : (
                <>
                  <View
                    style={{
                      alignItems: "center",
                      gap: 16,
                      paddingHorizontal: 16,
                    }}
                  >
                    <Image
                      source={require("../../assets/noquest.png")}
                      style={{ width: 167, height: 160 }}
                    />
                    <Text
                      style={[
                        globalStyles.smallText,
                        { textAlign: "center", opacity: 0.5 },
                      ]}
                    >
                      No quests available...{"\n"}
                      Record your emotion to unlock quests{"\n"} for the day!
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      {showNotification && (
        // <Animated.View style={[styles.notification, { opacity: fadeAnim }]}>
        //   <Text style={styles.notificationText}>Quest Completed!</Text>
        // </Animated.View>
        <CustomSnackbar
          message="Quest completed!"
          onDismiss={onDismissSnackBar}
          visible={showNotification}
          onUndo={() => {
            handleShowComponent();
            handleUndoQuest(quests[lastRemovedIndex].category);
          }}
          style={{
            position: "absolute",
            bottom: 10, // Adjust as needed
            left: 0,
            right: 0,
          }} // Directly style Snackbar
        ></CustomSnackbar>
      )}
    </View>
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
  notification: {
    position: "absolute",
    bottom: 20,
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  notificationText: {
    color: "white",
    fontSize: 16,
  },
   // New styles for the completed quests UI
   allCompletedContainer: {
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  newEmotionButton: {
    backgroundColor: COLORS.tertiary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
  },

});
