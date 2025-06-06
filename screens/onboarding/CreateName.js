import React, { useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { TextInput, Provider as PaperProvider } from "react-native-paper";
import { COLORS, globalStyles, theme } from "../../globalStyles";
import Button from "../../components/Button";
import Checkbox from "../../components/Checkbox";
import { getAuth } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function CreateName({ navigation }) {
 
  const [nickname, setNickname] = useState(null);
  const [buttonState, setButtonState] = useState(false);
  const handleButtonChange = (nickname) => {
    if (nickname.length > 0) {
      setButtonState(true);
    } else {
      setButtonState(false);
    }
  };

  const insertNameToDatabase = async () => {
    const userUid = getAuth().currentUser.uid
    const name = nickname

    try {
      await setDoc(doc(db, "users", userUid), {
        nickname: name,
      }, {merge: true}
    );
    console.log("Name saved to database"); } catch (error) {
      console.error("Error saving nickname to database:", error);
    }
  }

  return (
    <PaperProvider theme={theme}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[globalStyles.container, globalStyles.spaceBetween]}>
        <Image
          source={require("../../assets/topbanner-image.png")}
          style={globalStyles.topbanner}
          resizeMode="contain"
        />
        <View>
          <View style={[globalStyles.gap16, { marginTop: 250 }]}>
            <Text style={[globalStyles.h2, globalStyles.textCenter]}>
              What should I call you?
            </Text>
            <Text style={[globalStyles.p, {textAlign: "center",}]}>
              This will be the name displayed to the community when you post or
              comment
            </Text>
          </View>
          <View style={[{ marginTop: 32 }, globalStyles.gap10]}>
            <TextInput
              label="Nickname (12 characters)"
              mode="outlined"
              style={globalStyles.textInput}
              theme={{
                roundness: 16,
              }}
              value={nickname}
              onChangeText={(nickname) => {
                setNickname(nickname), handleButtonChange(nickname);
              }}
            ></TextInput>
          </View>
        </View>
        <Button
          title="Set nickname"
          style={{ alignItems: "flex-start" }}
          state={buttonState}
          onPress={() => {insertNameToDatabase(); navigation.navigate("FinishOnboarding"); }}
        />
      </View>
      </TouchableWithoutFeedback>
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

  topbanner: {
    position: "absolute",
    top: 0,
  },
});
