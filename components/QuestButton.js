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
  Sleep: require("../assets/sleep.png"),
  // Add more categories as needed
};

const catorgoryColors = {
  Move: COLORS.pink,
  Music: COLORS.blue,
  Meditate: COLORS.orange,
  Sleep: COLORS.purple,
};
const catorgoryColorsBg = {
  Move: COLORS.lightpink,
  Music: COLORS.lightBlue,
  Meditate: COLORS.lightOrange,
  Sleep: COLORS.lightPurple,
};
const QuestButton = ({
  title,
  imageSource,
  description,
  category,
  onPress,
}) => {
  return (
    <View style={styles.questContainer}>
      <View
        style={[
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 16,
            alignItems: "flex-start",
            flex: 1,
          }}
        >
          <Image
            source={categoryImages[category]}
            style={{ width: 50, height: 50 }}
          />
          <View style={[globalStyles.gap4, { flex: 1 }]}>
            <Text style={globalStyles.pBold}>{title}</Text>
            <Text
              style={[
                globalStyles.p,
                { flexWrap: "wrap", overflow: "hidden", maxWidth: "100%", paddingRight: 4 },
              ]}
            >
              {description}
            </Text>
            <Text
              style={[
                globalStyles.smallText,
                styles.categoryChip,
                {
                  marginTop: 4,
                  color: catorgoryColors[category],
                  borderColor: catorgoryColors[category],
                  backgroundColor: catorgoryColorsBg[category],
                  opacity: 0.7,
                },
              ]}
            >
              {category}
            </Text>
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
  categoryChip: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 14,
  },
});

export default QuestButton;
