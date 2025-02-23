import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { globalStyles } from '../globalStyles';

const CircleWithText = ({ text, size =100, style}) => {
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }, style]}>
      <Text style={[globalStyles.p, styles.text]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    // width: 100,           // Set the size of the circle
    // height: 100,          // Set the size of the circle
    // borderRadius: 50,     // Make the circle round
    backgroundColor: 'blue', // Circle color
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
    opacity: 0.7
  },
  text: {
    color: 'white',  // Text color
    fontSize: 16,     // Text size
  }
});

export default CircleWithText;
