import React, { useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { TextInput, Provider as PaperProvider, Chip } from "react-native-paper";
import { COLORS, globalStyles, theme } from "../../../globalStyles";
import Button from "../../../components/Button";
import CustomChip from "../../../components/CustomChip";

export default function askReason({ memo, setMemo, navigation }) {
  const [selected, setSelected] = useState(false);

  return (
    <PaperProvider theme={theme}>
      <View style={[globalStyles.container, globalStyles.spaceBetween]}>
        <Image
          source={require("../../../assets/topbanner-image.png")}
          style={globalStyles.topbanner}
          resizeMode="contain"
        />
        <View>
          <View style={[globalStyles.gap16, { marginTop: 250 }]}>
            <Text style={[globalStyles.h2, globalStyles.textCenter]}>
              What’s making you feel {"\n"}
              this way?
            </Text>
            {/* <Text style={[globalStyles.p, { textAlign: "left" }]}>
              Selected:
            </Text> */}
          </View>
          <View
            style={[
              { marginTop: 32, flexWrap: "wrap" },
              globalStyles.gap10,
              globalStyles.row,
            ]}
          >
            <CustomChip label="Chip 1" />
            <CustomChip label="Chip 2" />
            <CustomChip label="longggggggggg" />
            <CustomChip label="Chip 2" />
            <CustomChip label="Chip 2" />
            <CustomChip label="Chip 1" />
            <CustomChip label="Chip 2" />
            <CustomChip label="testtttttt" />
            <CustomChip label="Chip 2" />
          
          </View>
          <View style={{ marginTop: 24 }}>
            <TextInput
              label="Memo (280 characters)"
              mode="outlined"
              style={globalStyles.textInput}
              theme={{
                roundness: 16,
              }}
              value={memo}
              onChangeText={setMemo}
            ></TextInput>
          </View>
        </View>
        <Button
          title="Done"
          style={{ alignItems: "flex-start" }}
          onPress={() => navigation.navigate("FinishOnboarding")}
        />
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
