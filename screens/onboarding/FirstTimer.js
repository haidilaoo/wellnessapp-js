import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { COLORS, globalStyles } from "../../globalStyles";
import Button from "../../components/Button";
import Checkbox from "../../components/Checkbox";

//DATABASE
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { getAuth } from "firebase/auth"; // Import for Firebase authentication

export default function FirstTimer({ route, navigation }) {
  // const { user, handleAuthentication } = route.params; // Extract parameters
  const screenHeight = Dimensions.get("window").height;
  const [checkboxOptions, setCheckboxOptions] = useState([]);
  const [checkedStates, setCheckedStates] = useState(
    new Array(checkboxOptions.length).fill(false)
  );
  const [buttonState, setButtonState] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "FirstTimerScreenOptions")
        );
        const options = querySnapshot.docs.map((doc) => doc.data().title); // Assuming "title" is the field name
        setCheckboxOptions(options);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleButtonChange = (index, isChecked) => {
    // Enable button if at least one checkbox is checked
    const updatedStates = [...checkedStates];
    updatedStates[index] = isChecked; // Update the state of the checkbox
    setCheckedStates(updatedStates);
    // Enable button if at least one checkbox is checked, otherwise disable it
    setButtonState(updatedStates.includes(true));
    console.log(buttonState);
  };

  //to be called when user onPress continue button with navigate
  const insertOptionToDatabase = async () => {
    const userUid = getAuth().currentUser.uid

    // Get the selected options
    const selectedOptions = checkboxOptions.filter((_, index) => checkedStates[index]);
    
    try {
      // Save selected options to the user's document in Firestore
      await setDoc(doc(db, "users", userUid), {
        selection: selectedOptions, // Save selected options as an array
      }, {merge: true} // Merge with existing data, preventing overwriting
    );
      console.log("Selected options saved to database");
    }catch (error) {
      console.error("Error saving selected options to database:", error);
    }
  };

  

  return (
    // <View style={styles.container}>
    //   <Text style={styles.title}>Welcome</Text>
    //   <Text style={styles.emailText}>{user.email}</Text>
    //   <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
    // </View>
    <View style={[globalStyles.container, globalStyles.spaceBetween]}>
      <Image
        source={require("../../assets/topbanner-image.png")}
        style={globalStyles.topbanner}
        resizeMode="contain"
      />
      <View>
        <View style={[globalStyles.gap16, { marginTop: 250 }]}>
          <Text style={[globalStyles.h2, globalStyles.textCenter]}>
            What’s on your mind?
          </Text>
          <Text style={globalStyles.p}>I want to...</Text>
        </View>
        <View style={[{ marginTop: 32 }, globalStyles.gap10]}>
          <ScrollView style={[{ height: screenHeight * 0.4 }]}>
            <View style={{ flex: 1, gap: 10 }}>
              {checkboxOptions.map((option, index) => (
                <Checkbox
                   key={index}
                  title={option}
                  onPress={(isChecked) => handleButtonChange(index, isChecked)}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
      <Button
        title="Continue"
        style={{ alignItems: "flex-start" }}
        state={buttonState}
        onPress={() => {
          insertOptionToDatabase(); // Call your function to save data to the database
          navigation.navigate("CreateName"); // Navigate to the "CreateName" screen
        }}
      />
    </View>
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
    marginTop: -24,
    height: undefined, // Fixed height
    width: Dimensions.get("window").width, // Let the width adjust based on the aspect ratio
    aspectRatio: 1, // Maintain a 1:1 ratio
  },
});
