import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
// import { TextInput } from "react-native-gesture-handler";
import { TextInput, Provider as PaperProvider } from "react-native-paper"; //using this instead of native TextInput as this has built in support for floating labels
import { COLORS, globalStyles, theme } from "../../globalStyles";
import Button from "../../components/Button";
import { useNavigation, CommonActions } from "@react-navigation/native"; // Import navigation hook

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

//FOR DATABASE FIRESTORE
import { db } from "../../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

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
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage),
// });

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

          <Text style={[{ margin: 32, alignSelf: "center" }]}>or</Text>
          <Button
            title="Continue with Google"
            onPress={handleAuthentication}
            variant="secondary"
            textColor={COLORS.black}
            // iconName="google"
            // iconColor="COLORS.primary"
            imageSource={require("../../assets/google-icon.png")} // Local image source
            imageSize={24} // Adjust size of the image
          />
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
      </View>
    </PaperProvider>
  );
};

const AuthenticatedScreen = ({ user, handleAuthentication }) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.emailText}>{user.email}</Text>
      <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
    </View>
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

  const validateConfirmPassword = () => {
    if (confirmPassword === "") {
      console.error("Error: Confirm password cannot be empty.");
      return false;
    }
    if (confirmPassword !== password) {
      console.error("Error: Passwords do not match.");
      return false;
    }
    return true;
  };
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
          console.log("User signed in successfully!");
        } else {
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
          });
          console.log("User registered and added to Firestore:", user.uid);
        }
      }
    } catch (error) {
      console.error("Authentication error:", error.message);
    }
  };

  //Move navigation stuff inside useEffect so that it runs after the component renders.if not have error
  useEffect(() => {
    if (user) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: "OnboardingFlow",
              state: {
                routes: [
                  { name: "FirstTimer", params: { user, handleAuthentication } },
                ],
              },
            },
          ],
        })
      );
    }
  }, [user, navigation, handleAuthentication]); // Run effect when user changes
  return (
    <ScrollView contentContainerStyle={styles.authContainer}>
      {user ? (
        // Show user's email if user is authenticated
        // <AuthenticatedScreen
        //   user={user}
        //   handleAuthentication={handleAuthentication}
        // />
     
      null
      ) : (
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
        />
      )}
    </ScrollView>
  );
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
