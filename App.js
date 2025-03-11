import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFonts } from "expo-font";
import { LogBox } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
// Context
import { UserProvider } from "./screens/onboarding/UserContext.js";
import { addQuestsToFirestore } from './database/addQuests';
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
import Profile from "./screens/tabs/Profile.js";
import CommunityScreen from "./screens/tabs/CommunityScreen.js";
import CreatePost from "./screens/CreatePost.js";
import ExploreScreen from "./screens/tabs/ExploreScreen.js";
import TabScreen from "./screens/tabs/Community/TabScreen.js";
import PostScreen from "./screens/tabs/PostScreen.js";



// Navigation Stacks
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
// Create a Stack Navigator specifically for the Community tab
const CommunityStack = createStackNavigator();

//suppress some warnings that does not affect functionality of app
LogBox.ignoreLogs([
  "Text strings must be rendered within a <Text> component",
  "Slider: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.",
  "The action 'RESET' with payload {\"index\":0,\"routes\":[{\"name\":\"AuthFlow\"}]} was not handled by any navigator."
]);

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
      <Stack.Screen
        name="CreatePost"
        component={CreatePost}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const CommunityFlow = () => {
  return (
    <CommunityStack.Navigator>
      <CommunityStack.Screen
        name="CommunityMain"
        component={CommunityScreen}
        options={{ headerShown: false }}
      />
      <CommunityStack.Screen
        name="Explore"
        component={ExploreScreen} // Nested screen within Community tab
        options={{ headerShown: false }}
      />
    </CommunityStack.Navigator>
  );
};

// Main App Tabs (Logged-In)
const MainAppFlow = () => {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        
        let iconName;

        if (route.name === "Home") {
          iconName = "home-outline"; // Home icon
        } else if (route.name === "Community") {
          iconName = "people-outline"; // Community icon
        } else if (route.name === "Profile") {
          iconName = "person-outline"; // Profile icon
        }

        return <Icon name={iconName} size={24} color={color} />;
      },
      tabBarActiveTintColor: "green", // Active tab color
      tabBarInactiveTintColor: "gray", // Inactive tab color
    })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Community"
        component={TabScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
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
      console.log("onboarding state: ", userDoc.data().isOnboardingCompleted);
      return userDoc.data().isOnboardingCompleted || false; // Return true if completed, otherwise false
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
      {console.log("onboarding state: ", isOnboardingCompleted)}
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            elevation: 0, // For Android
            shadowOpacity: 0, // For iOS
          },
        }}
      >
        {userUid ? (
          isOnboardingCompleted ? (
            <Stack.Screen
              name="MainAppFlow"
              component={HomeScreenFlow} //IMPT NOTE: In order to be able to navigate to another screen it has to be within SAME NAVIGATOR
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

        {/* Main App: Recording emotion */}
        <Stack.Screen
          name="HomeScreenFlow"
          component={HomeScreenFlow}
          options={{ headerShown: false }}
        />
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

  
  //Populate quests collection in Firestore database
  // useEffect(() => {
  //   // Call the function to add quests to Firestore on app load
  //   addQuestsToFirestore();
  // }, []);

  return (
    <UserProvider>
      <RootNavigator />
    </UserProvider>
  );
}
