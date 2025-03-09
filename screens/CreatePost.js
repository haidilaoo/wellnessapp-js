import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Pressable,
  StyleSheet,
  Keyboard,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { COLORS, globalStyles } from "../globalStyles";
// import { TextInput } from "react-native-paper";
import ActionSheet from "react-native-actionsheet";
import { useNavigation } from "@react-navigation/native";
import { Chip, Modal, PaperProvider, Portal } from "react-native-paper";
import Icon from "react-native-vector-icons/Feather";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getAuth } from "firebase/auth";
import Button from "../components/Button";
export default function CreatePost() {
  const navigation = useNavigation();
  const actionSheetRef = useRef(null);

  const handlePress = (index) => {
    if (index === 0) {
      Alert.alert("Draft Saved", "Your draft has been saved!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(), // Go back to the previous screen after pressing OK
        },
      ]);
    } else if (index === 1) {
      Alert.alert("Deleted", "Your post has been deleted.", [
        {
          text: "OK",
          onPress: () => navigation.goBack(), // Go back to the previous screen after pressing OK
        },
      ]);
    }
  };

  const [message, setMessage] = useState();
  const [topic, setTopic] = useState("🌎 Main Lobby");
  const userUid = getAuth().currentUser.uid;

  //OLD NESTING STRUCTURE
  // const insertPostToDatabase = async () => {
  //   try {
  //     const userDocRef = doc(db, "users", userUid);
  //     const userDocSnap = await getDoc(userDocRef);

  //     // Ensure document exists before accessing data
  //     const name = userDocSnap.exists()
  //       ? userDocSnap.data().nickname
  //       : "Unknown";
  //     const postRef = doc(collection(db, "posts", topic, "posts"));
  //     await setDoc(postRef, {
  //       user: userUid,
  //       name: name,
  //       message: message,
  //       timestamp: serverTimestamp(),
  //       topicCategory: topic,
  //       likes: 0,
  //     });
  //     console.log("New post inserted into database.");
  //   } catch (error) {
  //     console.error("Error inserting new post into database.", error);
  //   }
  // };

  const insertPostToDatabase = async () => {
    try {
      const userDocRef = doc(db, "users", userUid);
      const userDocSnap = await getDoc(userDocRef);
  
      // Ensure the user document exists before accessing data
      const name = userDocSnap.exists() ? userDocSnap.data().nickname : "Unknown";
  
      // Reference to the top-level "posts" collection
      const postRef = await addDoc(collection(db, "posts"), {
        user: userUid,
        name: name,
        message: message,
        timestamp: serverTimestamp(),
        topicCategory: topic, // Now stored as a field instead of being a subcollection
        profileImageUri: userDocSnap.data().profileImageUri,
        likes: 0,
        replyCount: 0,
      });
  
      console.log("New post inserted into database with ID:", postRef.id);
    } catch (error) {
      console.error("Error inserting new post into database:", error);
    }
  };
  

  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: COLORS.background,
    padding: 20,
    position: "absolute",
    bottom: 0,
    flex: 1,
    justifyContent: "flex-end",
  };
  useEffect(() => {
    if (visible) {
      Keyboard.dismiss(); // Hide the keyboard when modal appears
    }
  }, [visible]);
  const [buttonState, setButtonState] = useState(false);
  const handleButtonChange = (message) => {
    if (message.length > 0) {
      setButtonState(true);
    } else {
      setButtonState(false);
    }
  };
  return (
    <PaperProvider>
      <SafeAreaView style={globalStyles.container}>
        <View style={globalStyles.container}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={() => actionSheetRef.current.show()}>
              <Text style={[globalStyles.p, { color: COLORS.black }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <ActionSheet
              ref={actionSheetRef}
              title="Are you sure?"
              options={["Save Draft", "Delete", "Cancel"]}
              cancelButtonIndex={2} // Clicking this closes the sheet
              destructiveButtonIndex={1} // Makes "Delete" red (for emphasis)
              onPress={handlePress} // Handles button clicks
            />
            <Button
              style={{
                paddingVertical: 8,
                paddingHorizontal: 20,
                borderRadius: 24,
                alignSelf: "flex-start",
              }}
              title="Post"
              state={buttonState}
              onPress={() => {
                insertPostToDatabase();
                Alert.alert(
                  "Posted!",
                  "Your post has been posted in Community!",
                  [
                    {
                      text: "OK",
                      onPress: () => navigation.goBack(), // Go back to the previous screen after pressing OK
                    },
                  ]
                );
              }}
            >
              {/* <View
                style={{
                  backgroundColor: COLORS.primary,
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                  borderRadius: 24,
                  alignSelf: "flex-start",
                }}
              > */}
              {/* <Text style={[globalStyles.p, { color: COLORS.white }]}>
                  Post
                </Text> */}
              {/* </View> */}
            </Button>
          </View>

          <Portal>
            <Modal
              visible={visible}
              onDismiss={hideModal}
              contentContainerStyle={{ position: "absolute", bottom: -32 }}
            >
              <View
                style={{
                  backgroundColor: COLORS.background,
                  padding: 20,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  width: "100%", // Ensures full width
                }}
              >
                <Text style={[globalStyles.p, { marginBottom: 16 }]}>
                  Choose category:
                </Text>
                <View
                  style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}
                >
                  <Pressable
                    onPress={() => {
                      setTopic("🌎 Main Lobby");
                      hideModal();
                    }}
                    style={styles.pillBtn}
                  >
                    <Text
                      style={[globalStyles.btnText, { color: COLORS.black }]}
                    >
                      🌎 Main Lobby
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setTopic("😩 Vent & Rant");
                      hideModal();
                    }}
                    style={styles.pillBtn}
                  >
                    <Text
                      style={[globalStyles.btnText, { color: COLORS.black }]}
                    >
                      😩 Vent & Rant
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setTopic("🤔 Need Advice?");
                      hideModal();
                    }}
                    style={styles.pillBtn}
                  >
                    <Text
                      style={[globalStyles.btnText, { color: COLORS.black }]}
                    >
                      🤔 Need Advice?
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setTopic("💭 Deep Talks & Feels");
                      hideModal();
                    }}
                    style={styles.pillBtn}
                  >
                    <Text
                      style={[globalStyles.btnText, { color: COLORS.black }]}
                    >
                      💭 Deep Talks & Feels
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setTopic("🚩 Toxic or Nah?");
                      hideModal();
                    }}
                    style={[styles.pillBtn, { marginBottom: 24 }]}
                  >
                    <Text
                      style={[globalStyles.btnText, { color: COLORS.black }]}
                    >
                      🚩 Toxic or Nah?
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </Portal>

          <Pressable
            onPress={showModal}
            style={[styles.pillBtn, { marginTop: 16 }]}
          >
            <Text style={[globalStyles.btnText, { color: COLORS.black }]}>
              {topic}
            </Text>
            <Icon
              name="code"
              color="black"
              size={14}
              style={{ transform: [{ rotate: "90deg" }] }}
            />
          </Pressable>
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              alignItems: "center",
              marginTop: 16,
            }}
          >
            <Image
              source={require("../assets/Avatar.png")}
              style={{
                width: 56,
                height: 56,
              }}
            />
            <TextInput
              placeholder="What's on your mind?"
              multiline={true}
              autoFocus={true}
              numberOfLines={4}
              maxLength={400}
              value={message}
              onChangeText={(message) => {
                setMessage(message);
                handleButtonChange(message);
              }}
              style={{ color: COLORS.black, fontSize: 16, width: 300 }}
            ></TextInput>
          </View>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  pillBtn: {
    alignSelf: "flex-start",

    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#ECECEC",
    flexDirection: "row",
    gap: 4,
    borderRadius: 8,
    alignItems: "center",
  },
});
