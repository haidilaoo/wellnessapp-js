import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { Button } from "react-native-elements";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { COLORS, globalStyles } from "../../globalStyles";
import { Chip, FAB } from "react-native-paper";
import Icon from "react-native-vector-icons/Feather";
import { db } from "../../firebaseConfig";
import { collection, getDoc, getDocs } from "firebase/firestore";

export default function CommunityScreen() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState();
  const [name, setName] = useState();
  const [timestamp, setTimestamp] = useState();

  // useEffect (() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const postRef = await getDocs(
  //         collection(db, 'posts', '🌎 Main Lobby', 'posts')
  //       );
  //       const postMessage = postRef.docs.map((doc)=> doc.data().message);
  //       setMessage(postMessage);
  //       console.log('Message: ', postMessage);
  //     } catch (error) {
  //       console.error("Error fetching posts: ", error);
  //     }
  //   };
  //   fetchPosts();
  // }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postRef = collection(db, 'posts', '🌎 Main Lobby', 'posts'); // Collection reference
        const postSnapshot = await getDocs(postRef); // Fetch all documents
        const postData = postSnapshot.docs.map((doc) => ({
          id: doc.id, // Include document ID if needed
          message: doc.data().message,
          name: doc.data().name,
          topicCategory: doc.data().topicCategory,
          timestamp: doc.data().timestamp
          ? new Date(doc.data().timestamp.seconds * 1000).toLocaleString() // Convert timestamp
          : "Unknown time", // Fallback if timestamp is missing, // Assuming timestamp is stored in Firestore
        }));
        setPosts(postData);
        console.log('Posts:', postData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
  
    fetchPosts();
  }, []);
  

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
              {/* <View style={[globalStyles.gap24, styles.postContainer]}>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <Image
                    source={require("../../assets/Avatar.png")}
                    style={{
                      width: 56,
                      height: 56,
                    }}
                  ></Image>
                  <View style={[{ flexDirection: "column" }]}>
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
              </View> */}
              {posts.map((post) => (
              <View key={post.id} style={[globalStyles.gap24, styles.postContainer]}>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <Image
                    source={require("../../assets/Avatar.png")}
                    style={{
                      width: 56,
                      height: 56,
                    }}
                  ></Image>
                  <View style={[{ flexDirection: "column" }]}>
                    <Text style={globalStyles.pBold}>{post.name}</Text>
                    <Text style={globalStyles.p}>{post.topicCategory}</Text>
                  </View>
                </View>
                <Text style={[globalStyles.p, { color: COLORS.black }]}>
                {post.message}
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
                  <Text style={globalStyles.p}>{post.timestamp}</Text>
                </View>
              </View>
              ))}
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
        onPress={() => {
          console.log("Pressed"), navigation.navigate("CreatePost");
        }}
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
