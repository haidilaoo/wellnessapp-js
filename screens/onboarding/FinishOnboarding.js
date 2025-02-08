import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { COLORS, globalStyles, theme } from "../../globalStyles";
import Button from "../../components/Button";
import { CommonActions } from "@react-navigation/native";

export default function CreateName({ nickname, setNickname, navigation }) {
  const { width: screenWidth } = Dimensions.get("window");
  const screenHeight = Dimensions.get("window").height;
  const bannerWidth = Math.min(screenWidth);

  const navigateToHomeScreen = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "HomeScreenFlow",
            state: {
              routes: [{ name: "askEmotion" }],
            },
          },
        ],
      })
    );
  };

  return (
    <View style={[globalStyles.container, globalStyles.spaceBetween]}>
      <Image
        source={require("../../assets/topbanner-image.png")}
        style={[
          styles.topbanner,
          { width: bannerWidth, height: screenHeight * 0.5, },
        ]}
        // resizeMode="contain"
      />
      <Image
        source={require("../../assets/bottombanner-image.png")}
        style={[styles.bottombanner, { width: bannerWidth, height: bannerWidth/1.72, }]}
        resizeMode="contain"
      />

      <View
        style={[
          {
            position: "absolute",
            bottom: 56 + 228 + 48 + 48,
            width: bannerWidth,
            paddingHorizontal: 16,
          },
        ]}
      >
        <View style={globalStyles.gap16}>
          <Text style={[globalStyles.h2, globalStyles.textCenter]}>
            All set!
          </Text>
          <Text style={[globalStyles.p, {textAlign: "center",}]}>
            Your journey to a happier, healthier life starts now.
          </Text>
        </View>
      </View>
      <Button
        title="Explore Careot"
        style={{
          width: bannerWidth,
          position: "absolute",
          bottom: 56 + 228,
          paddingHorizontal: 16,
        }}
        onPress={navigateToHomeScreen}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emailText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },

  topbanner: {
    position: "absolute",
    top: 0,
    // height: '60%',
  },
  bottombanner: {
    position: "absolute",
    bottom: 0,
    // width: bannerWidth,
    alignSelf: 'flex-end',
    // aspectRatio: 1,
  },
});
