import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { COLORS, globalStyles } from "../../globalStyles";
import Button from "../../components/Button";
import Checkbox from "../../components/Checkbox";

export default function FirstTimer({ route, navigation }) {
  // const { user, handleAuthentication } = route.params; // Extract parameters
  const screenHeight = Dimensions.get("window").height;
  return (
    // <View style={styles.container}>
    //   <Text style={styles.title}>Welcome</Text>
    //   <Text style={styles.emailText}>{user.email}</Text>
    //   <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
    // </View>
    <View style={[globalStyles.container, globalStyles.spaceBetween]}>
      <Image
        source={require("../../assets/topbanner-image.png")}
        style={globalStyles.topbanner}
        resizeMode="contain"
      />
      <View>
        <View style={[globalStyles.gap16, { marginTop: 250 }]}>
          <Text style={[globalStyles.h2, globalStyles.textCenter]}>
            What’s on your mind?
          </Text>
          <Text style={globalStyles.p}>I want to...</Text>
        </View>
        <View style={[{ marginTop: 32 }, globalStyles.gap10]}>
          <ScrollView style={[{ height: screenHeight * 0.4 }]}>
            <View style={{ flex: 1, gap: 10 }}>
              <Checkbox title="Manage my emotions better" />
              <Checkbox title="Manage my emotions better" />
              <Checkbox title="Manage my emotions better" />
              <Checkbox title="Manage my emotions better" />
              <Checkbox title="Manage my emotions better" />
            </View>
          </ScrollView>
        </View>
      </View>
      <Button
        title="Continue"
        style={{ alignItems: "flex-start" }}
        onPress={() => navigation.navigate("CreateName")}
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
    marginTop: -24,
    height: undefined, // Fixed height
    width: Dimensions.get("window").width, // Let the width adjust based on the aspect ratio
    aspectRatio: 1, // Maintain a 1:1 ratio
  },
});
