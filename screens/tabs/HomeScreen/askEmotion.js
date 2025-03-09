import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Provider as PaperProvider } from "react-native-paper";

import { COLORS, globalStyles, theme } from "../../../globalStyles";
import Button from "../../../components/Button";
import React, { useState, useRef, useEffect } from "react";
// import Slider from "@react-native-community/slider";
import { Slider } from "@rneui/themed";

//DATABASE
import { getAuth } from "firebase/auth";
import {
  setDoc,
  doc,
  getDoc,
  increment,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";

import EmotionButton from "../../../components/EmotionButton";
import CustomSnackbar from "../../../components/Snackbar";

export default function askEmotion({ navigation }) {
  const [sliderValue, setSliderValue] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState(null);

  // const [scrollValue, setScrollValue] = useState(0);
  const scrollViewRef = useRef(null);
  const windowWidth = Dimensions.get("window").width;

  const handleBtnState = (state) => {
    setEmotionBtnState(!state);
    console.log("btn clicked");
  };

  // Function to handle slider change
  const handleSliderChange = (value) => {
    setSliderValue(value);
    const offsetX = (value / 100) * (contentWidth - windowWidth - 32); // Adjust for paddingHorizontal
    // Scroll the ScrollView to the new position based on the slider value
    scrollViewRef.current.scrollTo({ x: offsetX, animated: false });
  };

  // Function to handle scrollview change
  const handleScrollChange = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newValue = Math.round(
      (offsetX / (contentWidth - windowWidth - 32)) * 100
    );
    setSliderValue(newValue);
  };

  // Function to measure content width
  const handleContentSizeChange = (width) => {
    setContentWidth(width);
  };

  const insertEmotionToDatabase = async () => {
    const userUid = getAuth().currentUser.uid;
    const emotion = selectedEmotion;

    try {
      // 1. Save the latest emotion as a field in the "users" collection
      await setDoc(
        doc(db, "users", userUid),
        { currentEmotion: emotion },
        { merge: true }
      );
      console.log("Emotion saved to database");

      //2. Update emotion_tally subcollection
      const emotionRef = doc(db, "users", userUid, "emotion_tally", emotion);
      const emotionDoc = await getDoc(emotionRef); // check if emotion alr exists as doc

      if (emotionDoc.exists()) {
        await updateDoc(emotionRef, {
          count: increment(1),
          last_updated: serverTimestamp(),
        });
      } else {
        await setDoc(emotionRef, {
          count: 1,
          last_updated: serverTimestamp(),
          reasons: [], // Initialize reasons array
        });
      }
      console.log("Emotion tally updated");

    } catch (error) {
      console.error("Error saving emotion to database:", error);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <View style={[globalStyles.container, globalStyles.spaceBetween]}>
        <Image
          source={require("../../../assets/topbanner-image.png")}
          style={globalStyles.topbanner}
          resizeMode="contain"
        />
        <View>
          <View style={[globalStyles.gap16, { marginTop: 250 }]}>
            <Text style={[globalStyles.h2, globalStyles.textCenter]}>
              How are you feeling today?
            </Text>
            <Text style={[globalStyles.p, {textAlign: "center",}]}>
              Careot will give suggestions & insights {"\n"} based on your mood
            </Text>
          </View>
          <View
            style={[{ marginTop: 48, marginBottom: 24, marginHorizontal: -16 }]}
          >
            <ScrollView
              horizontal={true}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              onContentSizeChange={(w) => handleContentSizeChange(w)} // Capture content width
              showsHorizontalScrollIndicator={false}
              ref={scrollViewRef}
              onScroll={handleScrollChange}
            >
              <View style={[globalStyles.gap32, globalStyles.row]}>
              <EmotionButton
                  title="angry"
                  emotion="angry"
                  state={selectedEmotion === "angry"}
                  onPress={() => {
                    setSelectedEmotion("angry");
                  }}
                />
                <EmotionButton
                  title="sad"
                  emotion="sad"
                  state={selectedEmotion === "sad"}
                  onPress={() => {
                    setSelectedEmotion("sad");
                  }}
                />
                  <EmotionButton
                  title="dead"
                  emotion="dead"
                  state={selectedEmotion === "dead"}
                  onPress={() => {
                    setSelectedEmotion("dead");
                  }}
                />
                  <EmotionButton
                  title="overwhelmed"
                  emotion="overwhelmed"
                  state={selectedEmotion === "overwhelmed"}
                  onPress={() => {
                    setSelectedEmotion("overwhelmed");
                  }}
                />
                  <EmotionButton
                  title="confused"
                  emotion="confused"
                  state={selectedEmotion === "confused"}
                  onPress={() => {
                    setSelectedEmotion("confused");
                  }}
                />
                <EmotionButton
                  title="tired"
                  emotion="tired"
                  state={selectedEmotion === "tired"}
                  onPress={() => {
                    setSelectedEmotion("tired");
                  }}
                />
                <EmotionButton
                  title="bored"
                  emotion="bored"
                  state={selectedEmotion === "bored"}
                  onPress={() => {
                    setSelectedEmotion("bored");
                  }}
                />
                <EmotionButton
                  title="meh"
                  emotion="meh"
                  state={selectedEmotion === "meh"}
                  onPress={() => {
                    setSelectedEmotion("meh");
                  }}
                />
                <EmotionButton
                  title="chill"
                  emotion="chill"
                  state={selectedEmotion === "chill"}
                  onPress={() => {
                    setSelectedEmotion("chill");
                  }}
                />
                <EmotionButton
                  title="silly"
                  emotion="silly"
                  state={selectedEmotion === "silly"}
                  onPress={() => {
                    setSelectedEmotion("silly");
                  }}
                />
                        <EmotionButton
                  title="cute"
                  emotion="cute"
                  state={selectedEmotion === "cute"}
                  onPress={() => {
                    setSelectedEmotion("cute");
                  }}
                />
                 <EmotionButton
                  title="motivated"
                  emotion="motivated"
                  state={selectedEmotion === "motivated"}
                  onPress={() => {
                    setSelectedEmotion("motivated");
                  }}
                />
                  <EmotionButton
                  title="in love"
                  emotion="love"
                  state={selectedEmotion === "love"}
                  onPress={() => {
                    setSelectedEmotion("love");
                  }}
                />
                <EmotionButton
                  title="joyful"
                  emotion="joyful"
                  state={selectedEmotion === "joyful"}
                  onPress={() => {
                    setSelectedEmotion("joyful");
                  }}
                />
              </View>
            </ScrollView>
          </View>
          <View style={{ alignSelf: "center", width: "100%" }}>
            <Slider
              // animateTransitions
              // animationType="timing"
              maximumTrackTintColor="#E6E6E6"
              maximumValue={100}
              minimumTrackTintColor="#E6E6E6"
              minimumValue={0}
              onSlidingComplete={() => console.log("onSlidingComplete()")}
              onSlidingStart={() => console.log("onSlidingStart()")}
              // onValueChange={(value) => console.log("onValueChange()", value)}
              orientation="horizontal"
              step={1}
              style={{ height: 40 }}
              thumbStyle={{ height: 24, width: 24 }}
              thumbTintColor="#FF702C"
              thumbTouchSize={{ width: 44, height: 44 }}
              trackStyle={{ height: 10, borderRadius: 20 }}
              value={sliderValue}
              onValueChange={handleSliderChange}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 48,
              }}
            >
              <Text style={globalStyles.smallText}>Low moods</Text>
              <Text style={globalStyles.smallText}>Good moods</Text>
            </View>
          </View>
        </View>
        <Button
          title="Select mood"
          style={[
            { alignItems: "flex-start" },
            selectedEmotion === null ? globalStyles.disabled : null,
          ]}
          onPress={() => {
            insertEmotionToDatabase();
            navigation.navigate("askReason");
          }}
        />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emailText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
});
