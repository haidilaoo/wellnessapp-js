import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { globalStyles } from "../globalStyles";

const EmotionButton = ({state=false , title,emotion, onPress,style}) => {

    const emotionImages = {
        joyful: require("../assets/emotion-joyful.png"),
        meh: require("../assets/emotion-meh.png"),
        silly: require("../assets/emotion-silly.png"),
        // Add other emotions as needed
      };

     const buttonStyles = state === false ? globalStyles.disabled : null


  return (
    <TouchableOpacity onPress={(onPress)} style={[buttonStyles,style]}>
      <Image
        source={emotionImages[emotion]}
        style={{
          height: 127, // Fixed height
          width: undefined, // Let the width adjust based on the aspect ratio
          aspectRatio: 1, // Maintain a 1:1 ratio
        }}
        resizeMode="contain"
      />
      <Text style={{alignSelf: "center", marginTop: 10}}>{title}</Text>
    </TouchableOpacity>
  );
};

export default EmotionButton;
