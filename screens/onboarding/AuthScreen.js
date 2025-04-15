import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
// import { TextInput } from "react-native-gesture-handler";
import { TextInput, Provider as PaperProvider } from "react-native-paper"; //using this instead of native TextInput as this has built in support for floating labels
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { COLORS, globalStyles, theme } from "../../globalStyles";
import Button from "../../components/Button";
import { useNavigation, CommonActions } from "@react-navigation/native"; // Import navigation hook
// import { useUser } from "./UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

//AUTHENTICATION
import { initializeApp } from "@firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "@firebase/auth";
//TO PERSIST LOGIN DATA
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

//Google Sign in
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "@firebase/auth";

WebBrowser.maybeCompleteAuthSession();

//FOR DATABASE FIRESTORE
import { db } from "../../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useUser } from "./UserContext";

const firebaseConfig = {
  apiKey: "AIzaSyAryoh-bO90naehPlcOwsahHDIBVHJ_pSM",
  authDomain: "wellnessapp-reactnative.firebaseapp.com",
  projectId: "wellnessapp-reactnative",
  storageBucket: "wellnessapp-reactnative.firebasestorage.app",
  messagingSenderId: "940653385662",
  appId: "1:940653385662:web:9d79c5c9993c54944d4bef",
  measurementId: "G-4JBXCYTR5C",
};

const app = initializeApp(firebaseConfig);
//TO PERSIST LOGIN DATA
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// const userGlobal = useUser();

const AuthScreen = ({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  isLogin,
  setIsLogin,
  handleAuthentication,
  promptAsync,
}) => {
  return (
    <PaperProvider theme={theme}>
      <View style={[globalStyles.container, globalStyles.spaceBetween]}>
        <View>
          <TextInput
            label="Email"
            mode="outlined"
            style={globalStyles.textInput}
            theme={{
              roundness: 16,
            }}
            value={email}
            onChangeText={setEmail}
          ></TextInput>
          <View style={globalStyles.marginBottom8}></View>
          <TextInput
            label="Password"
            mode="outlined"
            style={globalStyles.textInput}
            theme={{
              roundness: 16,
            }}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          ></TextInput>
          {!isLogin && (
            <TextInput
              label="Confirm password"
              mode="outlined"
              style={[globalStyles.textInput, { marginTop: 8 }]}
              theme={{
                roundness: 16,
              }}
              value={confirmPassword} // Bind state value
              onChangeText={(text) => setConfirmPassword(text)} // Update state
              secureTextEntry
            />
          )}

          {/* <Text style={[{ margin: 32, alignSelf: "center" }]}>or</Text>
          <Button
            title="Continue with Google"
            // onPress={() => promptAsync()}
            variant="secondary"
            textColor={COLORS.black}
            // iconName="google"
            // iconColor="COLORS.primary"
            imageSource={require("../../assets/google-icon.png")} // Local image source
            imageSize={24} // Adjust size of the image
          /> */}
        </View>
        <View>
          <Button
            title={isLogin ? "Login" : "Sign up"}
            onPress={handleAuthentication}
          />

          <View style={{ marginTop: 16 }}>
            <Text
              style={styles.toggleText}
              onPress={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "Need an account? Sign up"
                : "Already have an account? Login"}
            </Text>
          </View>
        </View>
        {/* <Snackbar
          visible={errorVisible}
          onDismiss={onDismissSnackBar}
          duration={5000}
          action={{
            icon: 'close',
            onIconPress: onDismissSnackBar, 
            color: COLORS.white,
          }}  
          style= {{backgroundColor: COLORS.black, }}   
          theme={{colors: {text: COLORS.white}}}
        >
          {errorMsg}
        </Snackbar> */}
        <Toast config={toastConfig} />
      </View>
    </PaperProvider>
  );
};

export default App = ({ route }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null); // Track user authentication state
  const { mode } = route.params || {}; // || {}; accounts for if mode is undefined
  //TO RENDER IF LOGIN UI OR SIGN UP UI DEPENDING ON BUTTON CLICKED
  const [isLogin, setIsLogin] = useState(route.params?.mode === "login"); //set to true if mode=login
  const navigation = useNavigation(); // Access navigation

  const [confirmPassword, setConfirmPassword] = useState("");

  //TO CHANGE HEADER TITLE DYNAMICALLY
  useLayoutEffect(() => {
    navigation.setOptions({ title: isLogin ? "Login" : "Create an account" });
  }, [isLogin]);

  const auth = getAuth(app);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    let result = passwordRegex.test(password);
    if ((result === false)) {
      console.log("Error: Confirm password cannot be empty.");
      Toast.show({
        type: "error",
        text1: "Password error",
        text2:
          "Password must have at least 6 characters, including 1 uppercase letter, 1 lowercase letter, and 1 digit.",
        visibilityTime: 4000,
        position: "bottom",
      });
      return false;
    } else {
      return true;
    }
  };

  const validateConfirmPassword = () => {
    if (confirmPassword === "") {
      console.log("Error: Confirm password cannot be empty.");
      Toast.show({
        type: "error",
        text1: "Password error",
        // text2: 'Invalid email address 🛑',
        text2: "Confirm password cannot be empty.",
        visibilityTime: 4000,
        position: "bottom",
      });
      return false;
    }
    if (confirmPassword !== password) {
      console.log("Error: Passwords do not match.");
      Toast.show({
        type: "error",
        text1: "Passwords mismatch",
        // text2: 'Invalid email address 🛑',
        text2: "Passwords do not match.",
        visibilityTime: 4000,
        position: "bottom",
      });
      return false;
    }
    return true;
  };
  const { selection, currentEmotion } = useUser();

  const handleAuthentication = async () => {
    try {
      if (user) {
        // If user is already authenticated, log out
        console.log("User logged out successfully!");
        await signOut(auth);
      } else {
        // Sign in or sign up
        if (isLogin) {
          // Sign in (no need to check confirm password)
          await signInWithEmailAndPassword(auth, email, password);
          console.log("selection:", selection);
          console.log("currentEmotion:", currentEmotion);

          // if (selection === null) {
          //   console.log('selection is null, navigating to OnboardingFlow');
          //   navigation.navigate("OnboardingFlow", { screen: "FirstTimer" });
          // } else if (currentEmotion === null) {
          //   console.log('currentEmotion is null, navigating to askEmotion screen');
          //   navigation.navigate("HomeScreenFlow", { screen: "askEmotion" });
          // } else {
          //   console.log('Both values present, navigating to HomeScreen');
          //   navigation.navigate("HomeScreenFlow", { screen: "HomeScreen" });
          // }
          console.log("User signed in successfully!");
        } else {
          //check if password contains minimum 6 characters, At least one lowercase letter,At least one uppercase letter,At least one digit (number)
          if (!validatePassword(password)) {
            return;
          }
          // Sign up (validate confirm password)
          if (!validateConfirmPassword()) {
            return; // Stop execution if validation fails
          }
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const user = userCredential.user;
          // Store additional user details in Firestore
          await setDoc(doc(db, "users", user.uid), {
            // name: name,
            email: email,
            createdAt: new Date(),
            isOnboardingCompleted: false, // Set onboarding status to false initially
            profileImageUri: null,
          });
          console.log("User registered and added to Firestore:", user.uid);
        }
      }
    } catch (error) {
      console.log("Authentication error:", error.message);
      // const message = error.message || 'An error occurred';
      let message = "";
      let title = "";
      if (error.message === "Firebase: Error (auth/email-already-in-use).") {
        title = "Authentication failed";
        message = "Email already in use 🛑";
      } else if (error.message === "Firebase: Error (auth/invalid-email).") {
        title = "Authentication failed";
        message = "Invalid email address 🛑";
      } else if (
        error.message ===
        "Firebase: Password should be at least 6 characters (auth/weak-password)."
      ) {
        title = "Weak password";
        message = "Password should be at least 6 characters";
      } else if (error.message === "Firebase: Error (auth/invalid-credential).") {
        title = "Authentication failed";
        message = "❌ Wrong email or password. Please try again.";
      } 
      else {
        title = "Authentication failed";
        message = error.message || "An error occurred. Please try again.";
      }

      Toast.show({
        type: "error",
        text1: title,
        // text2: 'Invalid email address 🛑',
        text2: message,
        visibilityTime: 4000,
        position: "bottom",
      });
    }
  };

  const discovery = {
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
  };
  // const [userInfo, setUserInfo] = React.useState();
  //   const [request, response, promptAsync] = Google.useAuthRequest({
  //     androidClientId:
  //     '1011145449920-mjptpu7sveg951hk401imblhatjujhcb.apps.googleusercontent.com',
  //     iosClientId: '',
  //     webClientId: '1011145449920-d1rnhn4u2h0tbntcqjv4eoat4evhbbii.apps.googleusercontent.com',
  //     redirectUri: AuthSession.makeRedirectUri({
  //       useProxy: true, // Uses Expo’s Auth proxy
  //     }),

  //   },discovery);
  //   React.useEffect(() => {
  //     if (response?.type === 'success') {
  //       const { id_token } = response.params;
  //       const credential = GoogleAuthProvider.credential(id_token);
  //       signInWithCredential(auth, credential);
  //     }
  //   }, [response]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User signed in:", user.uid);
        // No need to navigate here—App.js will handle it
      } else {
        console.log("User not signed in - Staying on AuthScreen");
      }
    });

    return unsubscribe; // Cleanup
  }, [navigation]);
  return (
    <ScrollView contentContainerStyle={styles.authContainer}>
      {user ? null : (
        // Show sign-in or sign-up form if user is not authenticated
        <AuthScreen
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isLogin={isLogin}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword} // Pass state setters to AuthScreen
          setIsLogin={setIsLogin}
          handleAuthentication={handleAuthentication}

          // promptAsync={promptAsync}
        />
      )}
    </ScrollView>
  );
};

const toastConfig = {
  error: ({ text1, text2, ...rest }) => (
    <View 
      style={{
        width: '90%',
        backgroundColor: COLORS.white,
        borderLeftColor: "#FF4B4B",
        borderLeftWidth: 6,
        borderRadius: 4,
        padding: 16,
        marginHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={[globalStyles.smallTextBold]}>{text1}</Text>
        <Text style={[globalStyles.smallText, { marginTop: 4 }]}>{text2}</Text>
      </View>
    </View>
  ),
  // You can define more types like 'success', 'info', etc.
};

const styles = StyleSheet.create({
  authContainer: {
    // width: "80%",
    // maxWidth: 400,
    backgroundColor: "#fff",
    // padding: 16,
    borderRadius: 8,
    elevation: 3,
    flex: 1, // IMPORTMENT: MUST HAVE THIS IF NOT ITEMS WITHIN SCROLLVIEW IS NOT STRETCHED TO FILL SCREEN HEIGHT
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  toggleText: {
    color: "#3498db",
    textAlign: "center",
  },
  // bottomContainer: {
  //   marginTop: 20,
  //   position: "absolute", // Makes it fixed within the parent
  //   bottom: 0, // Positions it at the bottom
  //   width: "100%", // Spans the entire width of the parent
  //   marginHorizontal: 16,
  //   marginVertical: 48,
  //   // backgroundColor: 'rgba(255, 0, 0, 0.3)',
  // },
  emailText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
});
