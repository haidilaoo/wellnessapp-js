import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import FeedScreen from "../FeedScreen";
import ExploreScreen from "../ExploreScreen";
import TabBar from "../../../components/TabBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, globalStyles } from "../../../globalStyles";
import { FAB } from "react-native-paper";

export default function TabScreen() {
  const Tab = createMaterialTopTabNavigator();
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
      </Tab.Navigator>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F6F6" }}>
      {/* <ScrollView
        contentContainerStyle={{ flexGrow: 1, width: '100%' }}
        keyboardShouldPersistTaps="handled"
      > */}
      <View style={[{ flex: 1, width: "100%" }]}>
        {/* <Image
            source={require("../../../assets/topbanner-community.png")}
            style={[globalStyles.topbanner, { marginTop: -100 }]}
            resizeMode="contain"
          /> */}
        <View
          style={[
            globalStyles.gap24,
            { marginTop: 0, flex: 1, width: "100%" },
          ]}
        >
          <Text style={[globalStyles.h3, { marginTop: 56, marginLeft: 16 }]}>
            Community
          </Text>
          <CommunityTabNavigator />
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
