import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFonts } from "expo-font";

// Context
import { UserProvider } from "./screens/onboarding/UserContext.js";

// Onboarding Screens
import StartScreen from "./screens/onboarding/StartScreen";
import LoginScreen from "./screens/onboarding/LoginScreen";
import CreateAccountScreen from "./screens/onboarding/CreateAccountScreen";
import FirstTimer from "./screens/onboarding/FirstTimer";

// Logged-In Screens
import HomeScreen from "./screens/tabs/HomeScreen";
import TherapistScreen from "./screens/tabs/TherapistScreen";

// Navigation Stacks
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main App Tabs (Logged-In)
const MainApp = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Therapist" component={TherapistScreen} />
    </Tab.Navigator>
  );
};

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
        name="Start"
        component={StartScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerTitle: "Login" }}
      />
      <Stack.Screen
        name="CreateAccount"
        component={CreateAccountScreen}
        options={{ headerTitle: "Create an account" }}
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
    </Stack.Navigator>
  );
};

// Root Navigation
const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            elevation: 0, // For Android
            shadowOpacity: 0, // For iOS
          },
        }}
      >
        {/* Authentication Flow */}
        <Stack.Screen
          name="AuthFlow"
          component={AuthFlow}
          options={{ headerShown: false }}
        />
        {/* Onboarding Flow */}
        <Stack.Screen
          name="OnboardingFlow"
          component={OnboardingFlow}
          options={{ headerShown: false }}
        />
        {/* Main App */}
        <Stack.Screen
          name="MainApp"
          component={MainApp}
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

  return (
    <UserProvider>
      <RootNavigator />
    </UserProvider>
  );
}
