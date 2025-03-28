import { StyleSheet, Dimensions } from "react-native";
import { color } from "react-native-elements/dist/helpers";

const COLORS = {
  primary: "#5E7638", // Brand/green
  secondary: "#C0CFAD", // Brand/lighter green
  secondary2: '#99DB45',
  secondary3: '#D5EAC5',
  tertiary: "#F2F5ED", //Brand/light green
  tertiary2: "#F0FCF2", //Brand/light green
  orange: "#FF702C", // Brand/orange
  lightOrange: '#FFF5F0',
  darkOrange: '#F26522',
  blue: '#5176BA',
  lightBlue: '#F0F6FF',
  green: '#0C8852',
  pink: '#C84975',
  lightpink: '#FFF0FA',

  white: "#FFFFFF", // Used for secondary buttons
  purple: '#570BF9',
  lightPurple: '#F6F0FF',

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
  gap4: {
    gap: 4,
  },
  gap8: {
    gap: 8,
  },

  gap10: {
    gap: 10,
  },
  gap12: {
    gap: 12,
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
    // textAlign: "center",
    lineHeight: 16 * 1.4, // 140% of the font size
  },
  pMedium: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: COLORS.black,
    // textAlign: "center",
    lineHeight: 16 * 1.4, // 140% of the font size
  },

  pBold: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: COLORS.black,
    // textAlign: "center",
    lineHeight: 16 * 1.4, // 140% of the font size
  },

  smallText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 14 * 1.4, // 140% of the font size
  },
  smallTextMedium: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 14 * 1.4, // 140% of the font size
  },
  smallTextBold: {
    fontFamily: "Inter-Bold",
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 14 * 1.4, // 140% of the font size
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
    lineHeight: 24 * 1.2, 
  },

  h3: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: COLORS.black,
    lineHeight: 20 * 1.4, 
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

  disabled: {
    opacity: 0.5,
  },
});

export { COLORS, SIZES };
