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

// Helper function to format timestamps in a Reddit-like style
const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "Unknown time";
  
  // Convert Firestore timestamp to JavaScript Date
  const postDate = new Date(timestamp.seconds * 1000);
  const now = new Date();
  
  // Calculate the difference in milliseconds
  const diffMs = now - postDate;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  // Format based on how old the post is
  if (diffMinutes < 1) {
    return "just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  } else if (diffHours < 24) {
    return `${diffHours}h`;
  } else if (diffDays < 7) {
    return `${diffDays}d`;
  } else {
    // For posts older than a week, use date format: 26 Feb
    return postDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    });
  }
};

export default function CommunityScreen() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState();
  const [name, setName] = useState();
  const [timestamp, setTimestamp] = useState();

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
          rawTimestamp: doc.data().timestamp, // Store raw timestamp for sorting and updates
          timestamp: doc.data().timestamp 
            ? formatRelativeTime(doc.data().timestamp) // Format with our helper function
            : "Unknown time", // Fallback if timestamp is missing
          createdAt: doc.data().timestamp 
            ? new Date(doc.data().timestamp.seconds * 1000) // Convert to Date for sorting
            : new Date(0), // Default to epoch start for unknown dates
        }));
        
        // Sort posts by timestamp (newest first)
        const sortedPosts = postData.sort((a, b) => b.createdAt - a.createdAt);
        
        setPosts(sortedPosts);
        console.log('Sorted Posts:', sortedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
  
    fetchPosts();
    
    // Optional: Update relative timestamps periodically
    const timerId = setInterval(() => {
      setPosts(currentPosts => 
        currentPosts.map(post => ({
          ...post,
          timestamp: post.rawTimestamp 
            ? formatRelativeTime(post.rawTimestamp)
            : "Unknown time"
        }))
        // Maintain sorting when updating timestamps
        .sort((a, b) => b.createdAt - a.createdAt)
      );
    }, 60000); // Update every minute
    
    return () => clearInterval(timerId); // Clean up on unmount
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