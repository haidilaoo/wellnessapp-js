import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { COLORS, globalStyles } from "../../globalStyles";
import Button from "../../components/Button";
import Checkbox from "../../components/Checkbox";

export default function FirstTimer({ route }) {
  const { user, handleAuthentication } = route.params; // Extract parameters

  return (
    // <View style={styles.container}>
    //   <Text style={styles.title}>Welcome</Text>
    //   <Text style={styles.emailText}>{user.email}</Text>
    //   <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
    // </View>
    <View style={[globalStyles.container, globalStyles.spaceBetween]}>
      <Image
        source={require("../../assets/topbanner-image.png")}
        style={styles.topbanner}
      />
      <View>
        <View style={[globalStyles.gap16, { marginTop: 250 }]}>
          <Text style={[globalStyles.h2, globalStyles.textCenter]}>
            What’s on your mind?
          </Text>
          <Text style={globalStyles.p}>I want to...</Text>
        </View>
        <View style={[{ marginTop: 32 }, globalStyles.gap10]}>
          <ScrollView style={[{ height: 350 }]}>
            <View style={{ flex: 1, gap: 10 }}>
              <Checkbox title="Manage my emotions better" />
              <Checkbox title="Manage my emotions better" />
              <Checkbox title="Manage my emotions better" />
              <Checkbox title="Manage my emotions better" />
            </View>
          </ScrollView>
        </View>
      </View>
      <Button title="Continue" style={{ alignItems: "flex-start" }} />
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
  },
});
