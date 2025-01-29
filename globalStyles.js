import { StyleSheet, Dimensions } from "react-native";
import { color } from "react-native-elements/dist/helpers";

const COLORS = {
  primary: "#5E7638", // Brand/green
  secondary: "#F2F5ED", // Brand/light green
  orange: "#FF702C", // Brand/orange
  white: "#FFFFFF", // Used for secondary buttons

  background: "#F5F6F6",
  backgroundSecondary: "#E6E6E6",

  // TEXT COLORS
  black: "#303030", // Used for headings, secondary button text
  blackSecondary: "#757575", // Used for secondary headings, textboxes sample text

  // BORDER COLORS
  borderDefault: "#D9D9D9",
};

const SIZES = {
  s: 8, // Fixed: Converted to numbers
  m: 16,
  l: 24,
  xl: 32,
};

//styling for text input
export const theme = {
  colors: {
    primary: COLORS.black,
    outline: COLORS.borderDefault,
    background: COLORS.white,
    text: COLORS.primary,
    placeholder: COLORS.blackSecondary,
  },
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // position: 'relative',
    backgroundColor: "#F5F6F6",
    width: "100%",
    // backgroundColor: 'rgba(255, 0, 0, 0.3)', //for debugging
    paddingHorizontal: 16, // Horizontal padding (left and right)
    paddingTop: 24, // Vertical padding (top and bottom)
    paddingBottom: 48,
  },

  topbanner: {
    position: "absolute",
    top: 0,
    marginTop: -24,
    height: undefined, // Fixed height
    width: Dimensions.get("window").width, // Let the width adjust based on the aspect ratio
    aspectRatio: 1, // Maintain a 1:1 ratio
  },

  row: {
    flexDirection: "row",
  },

  spaceBetween: {
    justifyContent: "space-between", // Align children to the ends of the main axis
  },

  //SPACING
  gap8: {
    gap: 8,
  },

  gap10: {
    gap: 10,
  },

  gap16: {
    gap: 16,
  },

  gap24: {
    gap: 24,
  },

  gap32: {
    gap: 32,
  },

  gap40: {
    gap: 40,
  },

  gap48: {
    gap: 48,
  },

  marginBottom8: {
    marginBottom: 8,
  },

  marginBottom16: {
    marginBottom: 16,
  },
  marginBottom24: {
    marginBottom: 24,
  },
  marginBottom32: {
    marginBottom: 32,
  },

  //TEXT
  titleText: {
    fontFamily: "Inter-Bold",
    fontSize: 32,
    color: COLORS.black,
    textAlign: "center",
    marginBottom: 16,
  },
  p: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: COLORS.blackSecondary,
    textAlign: "center",
    lineHeight: 16 * 1.4, // 140% of the font size
  },

  btnText: {
    color: COLORS.white,
    fontFamily: "Inter-Medium",
    fontSize: 16,
    lineHeight: 16 * 1.4, // 140% of the font size
  },

  h2: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: COLORS.black,
  },

  textCenter: {
    textAlign: "center",
  },

  //TEXTBOX
  textInput: {
    // padding: 16,
    // borderRadius: 16,
    // backgroundColor: COLORS.white,
    width: "100%",
    alignSelf: "stretch",
    // borderColor: COLORS.borderDefault,
    // borderWidth: 1,
  },
});

export { COLORS, SIZES };
