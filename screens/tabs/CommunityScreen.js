import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { Button } from "react-native-elements";
import { CommonActions, useNavigation, useFocusEffect } from "@react-navigation/native";
import { COLORS, globalStyles } from "../../globalStyles";
import { Chip, FAB } from "react-native-paper";
import Icon from "react-native-vector-icons/Feather";
import { db } from "../../firebaseConfig";
import { collection, getDoc, getDocs, onSnapshot, query } from "firebase/firestore";

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
  const [loading, setLoading] = useState(true);

  // Use a real-time listener for posts
  useEffect(() => {
    setLoading(true);
    
    // Create a query to the posts collection
    const postsRef = collection(db, 'posts', '🌎 Main Lobby', 'posts');
    const q = query(postsRef);
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postData = snapshot.docs.map((doc) => ({
        id: doc.id,
        message: doc.data().message,
        name: doc.data().name,
        topicCategory: doc.data().topicCategory,
        rawTimestamp: doc.data().timestamp,
        timestamp: doc.data().timestamp 
          ? formatRelativeTime(doc.data().timestamp)
          : "Unknown time",
        createdAt: doc.data().timestamp 
          ? new Date(doc.data().timestamp.seconds * 1000)
          : new Date(0),
      }));
      
      // Sort posts by timestamp (newest first)
      const sortedPosts = postData.sort((a, b) => b.createdAt - a.createdAt);
      
      setPosts(sortedPosts);
      setLoading(false);
      console.log('Real-time posts update:', sortedPosts);
    }, (error) => {
      console.error('Error in real-time posts listener:', error);
      setLoading(false);
    });
    
    // Also listen for when the screen comes into focus
    const onFocus = navigation.addListener('focus', () => {
      console.log('Community screen is focused');
      // The listener will automatically update when data changes
    });
    
    // Set up interval to update relative timestamps
    const timerId = setInterval(() => {
      setPosts(currentPosts => 
        currentPosts.map(post => ({
          ...post,
          timestamp: post.rawTimestamp 
            ? formatRelativeTime(post.rawTimestamp)
            : "Unknown time"
        }))
      );
    }, 60000); // Update every minute
    
    // Clean up listeners when unmounting
    return () => {
      unsubscribe();
      onFocus();
      clearInterval(timerId);
    };
  }, [navigation]);
  
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
              {loading ? (
                <Text style={globalStyles.p}>Loading posts...</Text>
              ) : posts.length === 0 ? (
                <Text style={globalStyles.p}>No posts yet. Be the first to post!</Text>
              ) : (
                posts.map((post) => (
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
                ))
              )}
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