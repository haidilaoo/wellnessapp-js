import { StyleSheet } from "react-native";
import { color } from "react-native-elements/dist/helpers";

const COLORS = {
  primary: "#5E7638", // Brand/green
  secondary: "#F2F5ED", // Brand/light green
  orange: "#FF702C", // Brand/orange
  white: "#FFFFFF", // Used for secondary buttons

  background: "#F5F6F6",

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
    paddingVertical: 24, // Vertical padding (top and bottom)
  },

  //SPACING
marginBottomSmall: {
    marginBottom: 8,
},

  marginBottomBase: {
    marginBottom: 16,
  },
  marginBottomMedium: {
    marginBottom: 24,
  },
  marginBottomLarge: {
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
  subheading: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: COLORS.blackSecondary,
    textAlign: "center",
    lineHeight: 16 * 1.4, // 140% of the font size
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
