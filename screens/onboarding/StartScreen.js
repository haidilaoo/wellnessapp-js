//TO DO: 
// 1. fix scaling issue of imageui on different devices: ios & android
// 2. fix bottom padding of buttons difference on ios and android

import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { COLORS, globalStyles } from "../../globalStyles";
import Button from "../../components/Button";
const StartScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/startscreen-image.png")}
        style={styles.image}
      />
      <View style={[styles.overlay, {gap: 8,}]}>
        <Text style={globalStyles.titleText}>Welcome to Careot</Text>
        <Text style={globalStyles.p}>
          Rooted in care, growing brighter days.{"\n"}Wellness is just a care-ot
          away🥕
        </Text>
        <View style={[{ marginBottom: 48 }]}></View>
        <Button
          title="Create an Account"
          onPress={() => navigation.navigate("CreateAccount")}
          variant="primary"
        />
        <View style={globalStyles.marginBottomBase}></View>
        <Button
          title="Login"
          onPress={() => navigation.navigate("Login")}
          variant="secondary"
          textColor={COLORS.black}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    // height: 693,
    height: "100%",
    position: "absolute", // Makes the image act as a background
    bottom: "20%",
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F6F6",
    width: "100%",
  },
  overlay: {
    justifyContent: "center",
    alignItems: "stretch",
    position: "absolute", // Overlay content on top of the image
    bottom: 0,
    width: "100%",
    paddingHorizontal: 16, // Horizontal padding (left and right)
    paddingVertical: 24, // Vertical padding (top and bottom)
  },
});

export default StartScreen;
