import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import FeedScreen from "../FeedScreen";
import ExploreScreen from "../ExploreScreen";
import TabBar from "../../../components/TabBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, globalStyles } from "../../../globalStyles";
import { FAB } from "react-native-paper";
import PostScreen from "../PostScreen";
import DeepTalkTab from "../Community tabs/DeepTalkTab";
import AdviceTab from "../Community tabs/AdviceTab";
import VentTab from "../Community tabs/VentTab";
import ToxicTab from "../Community tabs/ToxicTab";

export default function TabScreen() {
  const Tab = createMaterialTopTabNavigator();
  const Stack = createStackNavigator();
  const navigation = useNavigation();


  const CommunityTabNavigator = () => {
    return (
      <Tab.Navigator
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            width: "100%", // Ensure tabBar takes full width
          },
        }}
      >
        <Tab.Screen name="All" component={FeedScreen} />
        <Tab.Screen name="Main Lobby" component={ExploreScreen} />
        <Tab.Screen name="Deep Talks & Feels" component={DeepTalkTab} />
        <Tab.Screen name="Need Advice" component={AdviceTab} />
        <Tab.Screen name="Vent & Rant" component={VentTab} />
        <Tab.Screen name="Toxic or Nah" component={ToxicTab} />
      </Tab.Navigator>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F6F6" }}>
      {/* <ScrollView
        contentContainerStyle={{ flexGrow: 1, width: '100%' }}
        keyboardShouldPersistTaps="handled"
      > */}
      <View style={[{ flex: 1, width: "100%", }]}>
        {/* <Image
            source={require("../../../assets/topbanner-community.png")}
            style={[globalStyles.topbanner, { marginTop: -100 }]}
            resizeMode="contain"
          /> */}
        <View
          style={[globalStyles.gap24, { marginTop: 0, flex: 1, width: "100%" }]}
        >
          <Text style={[globalStyles.h3, { marginTop: 56, marginLeft: 16 }]}>
            Community
          </Text>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="CommunityTabs"
              component={CommunityTabNavigator}
            />
            <Stack.Screen name="PostScreen" component={PostScreen} />
          </Stack.Navigator>
        </View>
      </View>
      {/* </ScrollView> */}
      <FAB
        icon="plus"
        color="white" // Sets icon color
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: COLORS.primary, // FAB background color
        }}
        onPress={() => {
          console.log("Pressed"), navigation.navigate("CreatePost");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
