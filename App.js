import { useFonts } from "expo-font";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//ONBOARDING SCREENS
import StartScreen from "./screens/onboarding/StartScreen";
import LoginScreen from "./screens/onboarding/LoginScreen";
import CreateAccountScreen from "./screens/onboarding/CreateAccountScreen";

//LOGGED IN SCREENS
import HomeScreen from "./screens/tabs/HomeScreen";
import TherapistScreen from "./screens/tabs/TherapistScreen";



const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main Tab Navigator (For after login)
const MainApp = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Therapist" component={TherapistScreen} />
    </Tab.Navigator>
  );
};

// Root Stack Navigator (Includes onboarding and main app)
export default function App() {
  const [loaded] = useFonts({
    InterRegular: require("./assets/fonts/Inter-Regular.ttf"),
    // InterMedium: require('./assets/fonts/Inter-Medium.ttf'),
    InterBold: require("./assets/fonts/Inter-Bold.ttf"),
    PlaywriteVNRegular: require("./assets/fonts/PlaywriteVN Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
      headerStyle: {
        elevation: 0, // For Android
        shadowOpacity: 0, // For iOS

      },
    }}>
        {/* Onboarding/Login Flow */}
        <Stack.Screen
          name="Start"
          component={StartScreen}
          options={{ headerShown: false,
             headerTitle: "Back" 
           }}
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

        {/* Main App Flow */}
        <Stack.Screen name="MainApp" component={MainApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
