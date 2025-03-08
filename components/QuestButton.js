import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Animated,
} from "react-native";
import React, { useState } from "react";
import { COLORS, globalStyles } from "../globalStyles";


const categoryImages = {
  Move: require("../assets/move.png"),
  Music: require("../assets/music.png"),
  Meditate: require("../assets/meditate.png"),
  Sleep: require('../assets/sleep.png'),
  // Add more categories as needed
};
const QuestButton = ({ title, imageSource, category, onPress }) => {
  return (
    <View style={styles.questContainer}>
      <View
        style={[
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
        ]}
      >
        <View style= {{flexDirection: 'row', gap: 16, alignItems: 'center'}}>
        <Image
          source={categoryImages[category]}
          style={{ width: 50, height: 50 }}
        />
        <View style={globalStyles.gap4}>
          <Text style={globalStyles.pBold}>{title}</Text>
          <Text style={globalStyles.p}>{category}</Text>
        </View>
        </View>
        <Pressable onPress={onPress}>
          <Image
            source={require("../assets/tick-btn.png")}
            style={{ width: 46, height: 40 }}
          ></Image>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  questContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 16,
    borderColor: COLORS.borderDefault,
    borderWidth: 1,
  },
});

export default QuestButton;
