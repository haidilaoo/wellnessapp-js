import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { TextInput, Provider as PaperProvider } from "react-native-paper";
import { COLORS, globalStyles, theme } from "../../globalStyles";
import Button from "../../components/Button";
import Checkbox from "../../components/Checkbox";


export default function CreateName({
    nickname,
    setNickname,
    navigation,
 }) {


  return (
    <PaperProvider theme={theme}>
    <View style={[globalStyles.container, globalStyles.spaceBetween]}>
      <Image
        source={require("../../assets/topbanner-image.png")}
        style={styles.topbanner}
      />
      <View>
        <View style={[globalStyles.gap16, { marginTop: 250 }]}>
          <Text style={[globalStyles.h2, globalStyles.textCenter]}>
            What should I call you?
          </Text>
          <Text style={globalStyles.p}>
            This will be the name displayed to the community when you post or
            comment
          </Text>
        </View>
        <View style={[{ marginTop: 32 }, globalStyles.gap10]}>
            
          <TextInput
            label="Nickname (12 characters)"
            mode="outlined"
            style={globalStyles.textInput}
            theme={{
              roundness: 16,
            }}
            value={nickname}
            onChangeText={setNickname}
          ></TextInput>
         
        </View>
      </View>
      <Button title="Set nickname" style={{ alignItems: "flex-start" }} 
      onPress={() => navigation.navigate("FinishOnboarding")}/>
    </View>
    </PaperProvider>
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
