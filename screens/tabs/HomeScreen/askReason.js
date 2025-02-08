import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Provider as PaperProvider, Chip } from "react-native-paper";
import { COLORS, globalStyles, theme } from "../../../globalStyles";
import Button from "../../../components/Button";
import CustomChip from "../../../components/CustomChip";

//DATABASE
import { getAuth } from "firebase/auth";
import {
  setDoc,
  doc,
  updateDoc,
  getDoc,
  count,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { CommonActions, } from "@react-navigation/native";

export default function askReason({navigation}) {
  const [selectedReason, setSelectedReason] = useState([]);
  const [memo, setMemo] = useState(null);
  const userUid = getAuth().currentUser.uid;
  
  const insertMemoToDatabase = async () => {
    try {
      await setDoc(doc(db, "users", userUid),
    {
      memo: memo,
    }, {
      merge: true
    });

    console.log('Memo inserted into database.');
    } catch (error) {
      console.error("Error inserting Memo into database: ", error);
    }

  }


  const insertReasonToDatabase = async () => {
    // const userUid = getAuth().currentUser.uid;
    const reasons = selectedReason;
   
    try {
      await setDoc(
        doc(db, "users", userUid),
        {
          currentReason: reasons,
        },
        { merge: true }
      );
      console.log("Current reasons saved to database");

     //2. Update emotion_tally subcollection

     for (let reason of reasons) {
      if (!reason || typeof reason !== "string") {
        console.error("Invalid reason:", reason);
        continue; // Skip invalid reasons
      }

      // Ensure reason is safe for Firestore document ID
      const safeReason = reason.replace(/[.#$/[\]]/g, "_");

      const reasonRef = doc(db, "users", userUid, "reason_tally", safeReason);
      const reasonDoc = await getDoc(reasonRef);

      if (reasonDoc.exists()) {
        await updateDoc(reasonRef, {
          count: increment(1),
          last_updated: serverTimestamp(),
        });
        console.log("Updated reason tally:", safeReason);
      } else {
        await setDoc(reasonRef, {
          count: 1,
          last_updated: serverTimestamp(),
        });
        console.log("Created new reason tally:", safeReason);
      }
    }
          
       // Fetch user's current emotion
      const userDoc = await getDoc(doc(db, "users", userUid));
      const emotion = userDoc.exists() ? userDoc.data().currentEmotion : null;
      if (emotion) {
        const emotionRef = doc(db, "users", userUid, "emotion_tally", emotion);
        const emotionDoc = await getDoc(emotionRef); // Get the emotion_tally document);
        // Get the current 'reasons' array from the document
      const currentReasons = emotionDoc.exists() ? emotionDoc.data().reasons || [] : [];
      // Loop through each reason in the array
      const newReasons = reasons.filter(reason => !currentReasons.includes(reason));

      if (newReasons.length > 0) {
        // Add only the unique reasons
        await updateDoc(emotionRef, {
          reasons: [...currentReasons, ...newReasons],
        });
        console.log("Reasons added to emotion_tally");
      } else {
        console.log("All reasons already exist in the emotion_tally");
      }
    } else {
      console.warn("No emotion found for user.");
    }
        
    } catch (error) {
      console.error("Error saving reasons to database:", error);
    }
  };


  //NAVIGATE TO MAINAPP FLOW
const navigateToMainScreen = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "MainAppFlow",
            state: {
              routes: [{ name: "Home" }],
            },
          },
        ],
      })
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={0}
    >
      <PaperProvider theme={theme}>
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
              source={require("../../../assets/topbanner-image.png")}
              style={globalStyles.topbanner}
              resizeMode="contain"
            />
            <View style={{ flex: 1 }}>
              <View style={[globalStyles.gap16, { marginTop: 250 }]}>
                <Text style={[globalStyles.h2, globalStyles.textCenter]}>
                  What’s making you feel {"\n"}
                  this way?
                </Text>
                {/* <Text style={[globalStyles.p, { textAlign: "left" }]}>
              Selected:
            </Text> */}
              </View>
              <View
                style={[
                  { marginTop: 32, flexWrap: "wrap" },
                  globalStyles.gap10,
                  globalStyles.row,
                ]}
              >
                <CustomChip
                  label="people"
                  onPress={(label) => {
                    setSelectedReason((prevReasons) => [...prevReasons, label]);
                  }}
                />
                <CustomChip
                  label="family"
                  onPress={(label) => {
                    setSelectedReason((prevReasons) => [...prevReasons, label]);
                  }}
                />
                <CustomChip
                  label="relationship"
                  onPress={(label) => {
                    setSelectedReason((prevReasons) => [...prevReasons, label]);
                  }}
                />
                <CustomChip
                  label="breakup"
                  onPress={(label) => {
                    setSelectedReason((prevReasons) => [...prevReasons, label]);
                  }}
                />
                <CustomChip
                  label="studying"
                  onPress={(label) => {
                    setSelectedReason((prevReasons) => [...prevReasons, label]);
                  }}
                />
                <CustomChip
                  label="work"
                  onPress={(label) => {
                    setSelectedReason((prevReasons) => [...prevReasons, label]);
                  }}
                />
                <CustomChip
                  label="money"
                  onPress={(label) => {
                    setSelectedReason((prevReasons) => [...prevReasons, label]);
                  }}
                />
                <CustomChip
                  label="health"
                  onPress={(label) => {
                    setSelectedReason((prevReasons) => [...prevReasons, label]);
                  }}
                />
                <CustomChip
                  label="exercise"
                  onPress={(label) => {
                    setSelectedReason((prevReasons) => [...prevReasons, label]);
                  }}
                />
                <CustomChip
                  label="insomnia"
                  onPress={(label) => {
                    setSelectedReason((prevReasons) => [...prevReasons, label]);
                  }}
                />
                <CustomChip
                  label="leisure"
                  onPress={(label) => {
                    setSelectedReason((prevReasons) => [...prevReasons, label]);
                  }}
                />
                <CustomChip
                  label="no reason"
                  onPress={(label) => {
                    setSelectedReason((prevReasons) => [...prevReasons, label]);
                  }}
                />
              </View>
              <View style={{ marginTop: 24, flex: 1 }}>
                <TextInput
                  label="Memo (280 characters)"
                  mode="outlined"
                  style={globalStyles.textInput}
                  theme={{
                    roundness: 16,
                  }}
                  value={memo}
                  onChangeText={setMemo}
                  // autoFocus={true}
                ></TextInput>
              </View>
            </View>
            <Button
              title="Done"
              style={{ alignItems: "flex-start" ,}}
              onPress={() => {
                insertReasonToDatabase();
                insertMemoToDatabase();
                navigateToMainScreen();
              }}
            />
          </View>
        </ScrollView>
      </PaperProvider>
    </KeyboardAvoidingView>
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

  topbanner: {
    position: "absolute",
    top: 0,
  },
});
