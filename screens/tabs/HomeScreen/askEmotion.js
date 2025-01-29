import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { TextInput, Provider as PaperProvider } from "react-native-paper";

import { COLORS, globalStyles, theme } from "../../../globalStyles";
import Button from "../../../components/Button";
import React, { useState, useRef } from "react";
// import Slider from "@react-native-community/slider";
import { Slider } from "@rneui/themed";
import { useSafeAreaFrame } from "react-native-safe-area-context";
export default function askEmotion() {

  const [sliderValue, setSliderValue] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  // const [scrollValue, setScrollValue] = useState(0);
  const scrollViewRef = useRef(null);
  const windowWidth = Dimensions.get('window').width;

   // Function to handle slider change
   const handleSliderChange = (value) => {
    setSliderValue(value);
    const offsetX = (value / 100) * (contentWidth - windowWidth - 32); // Adjust for paddingHorizontal
    // Scroll the ScrollView to the new position based on the slider value
    scrollViewRef.current.scrollTo({ x: offsetX, animated: false });
  };

  // Function to handle scrollview change
  const handleScrollChange = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newValue = Math.round((offsetX / (contentWidth -windowWidth - 32)) * 100);
    setSliderValue(newValue);
  }

  // Function to measure content width
  const handleContentSizeChange = (width) => {
    setContentWidth(width);
  };


  
  return (
    <PaperProvider theme={theme}>
      <View style={[globalStyles.container, globalStyles.spaceBetween]}>
        <Image
          source={require("../../../assets/topbanner-image.png")}
          style={globalStyles.topbanner}
          resizeMode="contain"
        />
        <View>
          <View style={[globalStyles.gap16, { marginTop: 250 }]}>
            <Text style={[globalStyles.h2, globalStyles.textCenter]}>
              How are you feeling today?
            </Text>
            <Text style={globalStyles.p}>
              Careot will give suggestions & insights {"\n"} based on your mood
            </Text>
          </View>
          <View style={[{ marginVertical: 48, marginHorizontal: -16 }]}>
            <ScrollView
              horizontal={true}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              onContentSizeChange={(w) => handleContentSizeChange(w)} // Capture content width
              showsHorizontalScrollIndicator={false}
              ref={scrollViewRef}
              onScroll={handleScrollChange}
            >
              <View style={[globalStyles.gap32, globalStyles.row]}>
                <Image
                  source={require("../../../assets/emotion-joyful.png")}
                  style={{
                    height: 127, // Fixed height
                    width: undefined, // Let the width adjust based on the aspect ratio
                    aspectRatio: 1, // Maintain a 1:1 ratio
                  }}
                  resizeMode="contain"
                />
                <Image
                  source={require("../../../assets/emotion-joyful.png")}
                  style={{
                    height: 127, // Fixed height
                    width: undefined, // Let the width adjust based on the aspect ratio
                    aspectRatio: 1, // Maintain a 1:1 ratio
                  }}
                  resizeMode="contain"
                />
                <Image
                  source={require("../../../assets/emotion-joyful.png")}
                  style={{
                    height: 127, // Fixed height
                    width: undefined, // Let the width adjust based on the aspect ratio
                    aspectRatio: 1, // Maintain a 1:1 ratio
                  }}
                  resizeMode="contain"
                />
                <Image
                  source={require("../../../assets/emotion-joyful.png")}
                  style={{
                    height: 127, // Fixed height
                    width: undefined, // Let the width adjust based on the aspect ratio
                    aspectRatio: 1, // Maintain a 1:1 ratio
                  }}
                  resizeMode="contain"
                />
              
              </View>
            </ScrollView>
          </View>
          <View style={{ alignSelf: "center", width: "100%" }}>
            <Slider
              // animateTransitions
              // animationType="timing"
              maximumTrackTintColor="#E6E6E6"
              maximumValue={100}
              minimumTrackTintColor="#E6E6E6"
              minimumValue={0}
              onSlidingComplete={() => console.log("onSlidingComplete()")}
              onSlidingStart={() => console.log("onSlidingStart()")}
              // onValueChange={(value) => console.log("onValueChange()", value)}
              orientation="horizontal"
              step={1}
              style={{ height: 40 }}
              thumbStyle={{ height: 24, width: 24 }}
              thumbTintColor="#FF702C"
              thumbTouchSize={{ width: 44, height: 44 }}
              trackStyle={{ height: 10, borderRadius: 20 }}
              value={sliderValue}
              onValueChange={handleSliderChange}
              
            />
          </View>
        </View>
        <Button
          title="Select mood"
          style={{ alignItems: "flex-start" }}
          onPress={() => navigation.navigate("FinishOnboarding")}
        />
      </View>
    </PaperProvider>
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
});
