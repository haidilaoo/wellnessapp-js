import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { COLORS, globalStyles } from "../../globalStyles";
import { FAB } from "react-native-paper";
import Icon from "react-native-vector-icons/Feather";

export default function CommunityScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[globalStyles.container, { flex: 1 }]}>
          <Image
            source={require("../../assets/topbanner-community.png")}
            style={[globalStyles.topbanner, { marginTop: -100 }]}
            resizeMode="contain"
          />

          <View style={[globalStyles.gap24, { marginTop: 185 }]}>
            <Text style={globalStyles.h3}>Community</Text>
            <View style={globalStyles.gap24}>
              <View style={[globalStyles.gap24, styles.postContainer]}>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <Image
                    source={require("../../assets/Avatar.png")}
                    style={{
                      width: 56,
                      height: 56,
                    }}
                  ></Image>
                  <View style={[{ flexDirection: "column" }]}>
                    {" "}
                    <Text style={globalStyles.pBold}>Nick tan</Text>
                    <Text style={globalStyles.p}>topic category</Text>
                  </View>
                </View>
                <Text style={[globalStyles.p, { color: COLORS.black }]}>
                  Lorem ipsum dolor sit amet consectetur. Aliquet quam in
                  pulvinar lacus a quis suscipit viverra. Sed et aliquam blandit
                  urna vitae. Diam id ultricies nisl id nunc ultricies gravida
                  elit. Venenatis ultrices mollis euismod orci turpis fames
                  mauris cras purus. Aliquam ut lorem nunc est ut id. Vitae urna
                  faucibus purus rhoncus. Vulputate enim nisi turpis ornare
                  eget.
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 16,
                      backgroundColor: "#F4F6F8",
                      borderRadius: 16,
                      padding: 16,
                      alignSelf: "flex-start",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <Icon name="heart" size={24} color={"#b3b3b3"} />
                      <Text style={[globalStyles.pBold, { color: "#b3b3b3" }]}>
                        20
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <Icon name="message-square" size={24} color={"#b3b3b3"} />
                      <Text style={[globalStyles.pBold, { color: "#b3b3b3" }]}>
                        20
                      </Text>
                    </View>
                  </View>
                  <Text style={globalStyles.p}>21h</Text>
                </View>
              </View>
              <View style={[globalStyles.gap24, styles.postContainer]}>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <Image
                    source={require("../../assets/Avatar.png")}
                    style={{
                      width: 56,
                      height: 56,
                    }}
                  ></Image>
                  <View style={[{ flexDirection: "column" }]}>
                    {" "}
                    <Text style={globalStyles.pBold}>Nick tan</Text>
                    <Text style={globalStyles.p}>topic category</Text>
                  </View>
                </View>
                <Text style={[globalStyles.p, { color: COLORS.black }]}>
                  Lorem ipsum dolor sit amet consectetur. Aliquet quam in
                  pulvinar lacus a quis suscipit viverra. Sed et aliquam blandit
                  eget.
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 16,
                      backgroundColor: "#F4F6F8",
                      borderRadius: 16,
                      padding: 16,
                      alignSelf: "flex-start",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <Icon name="heart" size={24} color={"#b3b3b3"} />
                      <Text style={[globalStyles.pBold, { color: "#b3b3b3" }]}>
                        20
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <Icon name="message-square" size={24} color={"#b3b3b3"} />
                      <Text style={[globalStyles.pBold, { color: "#b3b3b3" }]}>
                        20
                      </Text>
                    </View>
                  </View>
                  <Text style={globalStyles.p}>21h</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <FAB
        icon="plus"
        color="white" // Sets icon color
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: COLORS.primary, // FAB background color
        }}
        onPress={() => console.log("Pressed")}
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

  postContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
  },
});
