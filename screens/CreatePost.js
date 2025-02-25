import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useRef } from "react";
import { COLORS, globalStyles } from "../globalStyles";
// import { TextInput } from "react-native-paper";
import ActionSheet from "react-native-actionsheet";
import { useNavigation } from "@react-navigation/native";
export default function CreatePost() {
  const navigation = useNavigation();
  const actionSheetRef = useRef(null);

  const handlePress = (index) => {
    if (index === 0) {
      Alert.alert("Draft Saved", "Your draft has been saved!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(), // Go back to the previous screen after pressing OK
        },
      ]);
    } else if (index === 1) {
      Alert.alert("Deleted", "Your post has been deleted.", [
        {
          text: "OK",
          onPress: () => navigation.goBack(), // Go back to the previous screen after pressing OK
        },
      ]);
    }
  };
  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => actionSheetRef.current.show()}>
            <Text style={[globalStyles.p, { color: COLORS.black }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <ActionSheet
            ref={actionSheetRef}
            title="Are you sure?"
            options={["Save Draft", "Delete", "Cancel"]}
            cancelButtonIndex={2} // Clicking this closes the sheet
            destructiveButtonIndex={1} // Makes "Delete" red (for emphasis)
            onPress={handlePress} // Handles button clicks
          />
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Posted!",
                "Your post has been posted in Community!",
                [
                  {
                    text: "OK",
                    onPress: () => navigation.goBack(), // Go back to the previous screen after pressing OK
                  },
                ]
              );
            }}
          >
            <View
              style={{
                backgroundColor: COLORS.primary,
                paddingVertical: 8,
                paddingHorizontal: 20,
                borderRadius: 24,
                alignSelf: "flex-start",
              }}
            >
              <Text style={[globalStyles.p, { color: COLORS.white }]}>
                Post
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            alignItems: "center",
          }}
        >
          <Image
            source={require("../assets/Avatar.png")}
            style={{
              width: 56,
              height: 56,
              marginTop: 16,
            }}
          />
          <TextInput
            placeholder="What's on your mind?"
            multiline={true}
            autoFocus={true}
            numberOfLines={4}
            maxLength={250}
            style={{ color: COLORS.black, fontSize: 16, width: 300 }}
          ></TextInput>
        </View>
      </View>
    </SafeAreaView>
  );
}
