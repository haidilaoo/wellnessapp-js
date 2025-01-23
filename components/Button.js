import React from "react";
import { Text, View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { COLORS, globalStyles } from "../globalStyles";
import Icon from "react-native-vector-icons/FontAwesome";

const Button = ({
  title,
  onPress,
  variant = "primary",
  textColor,
  iconName,
  iconSize = 24,
  iconColor,
  imageSource,
  imageSize = 24,
  imageStyle,
}) => {
  const buttonStyles =
    variant === "primary" ? styles.primaryBtn : styles.secondaryBtn;
  const buttonTextColor =
    textColor || (variant === "primary" ? COLORS.white : COLORS.black);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.btn, buttonStyles]}>
        {iconName && <Icon name={iconName} size={iconSize} color={iconColor} />}
        {imageSource && (
          <Image
            source={imageSource}
            style={{
              width: imageSize,
              height: imageSize,
              ...imageStyle, // Allow extra custom styles for the image
            }}
          />
        )}
        <Text
          style={[
            styles.btnText,
            { color: buttonTextColor, marginLeft: iconName || imageSource ? 12 : 0 },
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    width: "100%",
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
  },
  secondaryBtn: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.borderDefault,
    borderWidth: 1,
  },
  btnText: {
    color: COLORS.white,
    fontFamily: "Inter-Medium",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Button;
