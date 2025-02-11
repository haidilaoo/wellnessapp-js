import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFonts } from "expo-font";

// Context
import { UserProvider } from "./screens/onboarding/UserContext.js";

// Onboarding Screens
import StartScreen from "./screens/onboarding/StartScreen";
// import LoginScreen from "./screens/onboarding/LoginScreen";
import AuthScreen from "./screens/onboarding/AuthScreen.js";
import FirstTimer from "./screens/onboarding/FirstTimer";
import CreateName from "./screens/onboarding/CreateName";
import FinishOnboarding from "./screens/onboarding/FinishOnboarding";

// Logged-In Screens
import HomeScreen from "./screens/tabs/HomeScreen";
import TherapistScreen from "./screens/tabs/TherapistScreen";
import askEmotion from "./screens/tabs/HomeScreen/askEmotion.js";
import askReason from "./screens/tabs/HomeScreen/askReason.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./firebaseConfig";
import { useUser } from "./screens/onboarding/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";

// Navigation Stacks
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Authentication Flow
const AuthFlow = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          elevation: 0, // For Android
          shadowOpacity: 0, // For iOS
        },
      }}
    >
      <Stack.Screen
        name="Back"
        component={StartScreen}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="Login"
        component={LoginScreen}
        // options={{ headerTitle: "Login" }}
      /> */}
      <Stack.Screen
        name="AuthScreen"
        component={AuthScreen}
        // options={{ headerTitle: "Create an account" }}
      />
    </Stack.Navigator>
  );
};

// Onboarding Flow (Post-Login First-Time User)
const OnboardingFlow = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FirstTimer"
        component={FirstTimer}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateName"
        component={CreateName}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FinishOnboarding"
        component={FinishOnboarding}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const HomeScreenFlow = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={MainAppFlow} // Wrap HomeScreen inside the Stack
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="askEmotion"
        component={askEmotion}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="askReason"
        component={askReason}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Main App Tabs (Logged-In)
const MainAppFlow = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Therapist"
        component={TherapistScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const checkOnboardingState = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
     
      console.log('onboarding state: ', userDoc.data().isOnboardingCompleted);
      return userDoc.data().isOnboardingCompleted || false;  // Return true if completed, otherwise false
    } else {
      console.log("No such document!");
      return false; // If no user document, assume onboarding is not completed
    }
  }
  return false;
};
// Root Navigation
const RootNavigator = () => {
  const [userUid, setUserUid] = useState(null);
  const auth = getAuth();
  // const userUid = getAuth().currentUser.uid;

  //Get onboarding state
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserUid(user.uid);
        try {
          const onboardingStatus = await checkOnboardingState();
          setIsOnboardingCompleted(onboardingStatus);
        } catch (error) {
          console.error("Error checking onboarding state:", error);
          setIsOnboardingCompleted(false); // Default to false on error
        }
      } else {
        setUserUid(null);
        setIsOnboardingCompleted(false);
      }
    });
  
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
  
    <NavigationContainer>
        {console.log('onboarding state: ', isOnboardingCompleted)}
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            elevation: 0, // For Android
            shadowOpacity: 0, // For iOS
          },
        }}
      >
        {/* Authentication Flow */}
        {/* {userUid ? ( */}
        {/* <Stack.Screen
            name="MainAppFlow"
            component={MainAppFlow}
            options={{ headerShown: false }}
          /> */}
        {/* ) : ( */}
        {/* <Stack.Screen
          name="AuthFlow"
          component={AuthFlow}
          options={{ headerShown: false }}
        /> */}
        {/* )} */}
        {userUid ? (
          isOnboardingCompleted ? (
            <Stack.Screen
              name="MainAppFlow"
              component={MainAppFlow}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen
              name="OnboardingFlow"
              component={OnboardingFlow}
              options={{ headerShown: false }}
            />
          )
        ) : (
          <Stack.Screen
            name="AuthFlow"
            component={AuthFlow}
            options={{ headerShown: false }}
          />
        )}
        {/* Onboarding Flow */}
        {/* <Stack.Screen
          name="OnboardingFlow"
          component={OnboardingFlow}
          options={{ headerShown: false }}
        /> */}
        {/* Main App: Recording emotion */}
        <Stack.Screen
          name="HomeScreenFlow"
          component={HomeScreenFlow}
          options={{ headerShown: false }}
        />

        {/* <Stack.Screen
        //   name="MainAppFlow"
        //   component={MainAppFlow}
        //   options={{ headerShown: false }}
        // /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Main App Component
export default function App() {
  const [loaded] = useFonts({
    InterRegular: require("./assets/fonts/Inter-Regular.ttf"),
    InterBold: require("./assets/fonts/Inter-Bold.ttf"),
    PlaywriteVNRegular: require("./assets/fonts/PlaywriteVN Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }
  return (
    <UserProvider>
      <RootNavigator />
    </UserProvider>
  );
}
