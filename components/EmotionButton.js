import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { globalStyles } from "../globalStyles";

const EmotionButton = ({state=false , title,emotion, onPress,style}) => {

    const emotionImages = {
        joyful: require("../assets/emotion-joyful.png"),
        love: require("../assets/emotion-love.png"),
        meh: require("../assets/emotion-meh.png"),
        bored: require("../assets/emotion-bored.png"),
        chill: require("../assets/emotion-chill.png"),
        silly: require("../assets/emotion-silly.png"),
        angry: require("../assets/emotion-angry.png"),
        cute: require("../assets/emotion-cute.png"),
        sad: require("../assets/emotion-sad.png"),
        tired: require("../assets/emotion-tired.png"),
        confused: require("../assets/emotion-confused.png"),
        overwhelmed: require("../assets/emotion-overwhelmed.png"),
        dead: require("../assets/emotion-dead.png"),
        motivated: require("../assets/emotion-motivated.png"),
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
