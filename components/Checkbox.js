import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { COLORS, globalStyles } from "../globalStyles";
import Icon from "react-native-vector-icons/FontAwesome";

const Checkbox = ({
  title,
  onPress,
  variant = "default",
  textColor,
  // iconName,
  iconSize = 20,
  // iconColor,
  imageSource,
  imageSize = 24,
  imageStyle,
 
}) => {
  const [checked, setChecked] = useState(false);
  const [iconName, setIconName] = useState("square-o"); // default unchecked icon
  const [iconColor, setIconColor] = useState(COLORS.borderDefault); // default color

  const toggleCheckbox = () => {
    if (checked === false) {
      setChecked(true);
      setIconName("check-square"); // set checked icon
      setIconColor(COLORS.primary); // set color when checked
      onPress(true); //set state of component to be passed to parent component when used
    } else {
      setChecked(false);
      setIconName("square-o"); // set unchecked icon (FontAwesome v4)
      setIconColor(COLORS.borderDefault); // set color when unchecked
      onPress(false); //set state of component to be passed to parent component when used
    }
  };

  const buttonStyles =
    checked === false ? styles.defaultBtn : styles.selectedBtn;
  const buttonTextColor =
    textColor || (checked === false ? COLORS.black : COLORS.primary);

  return (
    <TouchableOpacity onPress={toggleCheckbox}>
      <View style={[styles.btn, buttonStyles]}>
        <Text style={[styles.btnText, { color: buttonTextColor }]}>
          {title}
        </Text>
        {iconName && (
          <Icon
            style={{ alignSelf: "center" }}
            name={iconName}
            size={iconSize}
            color={iconColor}
          />
        )}
        {checked && imageSource && (
          <Image
            source={imageSource}
            style={{
              width: imageSize,
              height: imageSize,
              ...imageStyle, // Allow extra custom styles for the image
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderColor: COLORS.borderDefault,
    borderWidth: 1,
    width: "100%",
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  defaultBtn: {
    backgroundColor: COLORS.white,
  },
  selectedBtn: {
    backgroundColor: COLORS.tertiary,
    borderColor: COLORS.primary,
    borderWidth: 1,
  },

  btnText: {
    color: COLORS.white,
    fontFamily: "Inter-Medium",
    fontSize: 16,
    lineHeight: 16 * 1.4, // 140% of the font size
  },
});

export default Checkbox;
