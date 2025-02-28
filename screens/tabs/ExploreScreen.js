import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { Button } from "react-native-elements";
import {
  CommonActions,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { COLORS, globalStyles } from "../../globalStyles";
import { Chip, FAB } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { db } from "../../firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";

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
    return postDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  }
};

export default function ExploreScreen() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heart, setHeart] = useState({}); // Use an object instead of an array
  const [likes, setLikes] = useState({}); // Store likes count separately

  // Get current user UID
  const userUid = getAuth().currentUser.uid;

  const toggleLike = async (postId, categoryName) => {
    try {
      setHeart((prevHeart) => {
        const newHeartState = !prevHeart[postId];
  
        // Optimistically update likes count without Firestore
        setLikes((prevLikes) => ({
          ...prevLikes,
          [postId]: newHeartState ? (prevLikes[postId] || 0) + 1 : (prevLikes[postId] || 0) - 1,
        }));
  
        return { ...prevHeart, [postId]: newHeartState };
      });
  
      const likeRef = doc(db, "posts", categoryName, "posts", postId, "likes", userUid);
      const likeDoc = await getDoc(likeRef);
      const isCurrentlyLiked = likeDoc.exists();
  
      if (isCurrentlyLiked) {
        await deleteDoc(likeRef);
      } else {
        await setDoc(likeRef, { liked: true, timestamp: serverTimestamp() });
      }
  
      // Update Firestore like count in the background
      const postRef = doc(db, "posts", categoryName, "posts", postId);
      await updateDoc(postRef, {
        likes: isCurrentlyLiked ? increment(-1) : increment(1),
        last_updated: serverTimestamp(),
      });
  
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };
  

  // Fetch user's likes when posts are loaded
  const fetchUserLikes = async () => {
    if (posts.length === 0) return;
  
    try {
      const likedPosts = {};
      const likeCounts = {}; // Store likes count separately
  
      for (const post of posts) {
        const likeRef = doc(db, "posts", post.categoryName || "🌎 Main Lobby", "posts", post.id, "likes", userUid);
        const likeDoc = await getDoc(likeRef);
        likedPosts[post.id] = likeDoc.exists();
  
        // Fetch likes count separately to avoid flickering
        const postRef = doc(db, "posts", post.categoryName, "posts", post.id);
        const postDoc = await getDoc(postRef);
        likeCounts[post.id] = postDoc.exists() ? postDoc.data().likes || 0 : 0;
      }
  
      setHeart(likedPosts);
      setLikes(likeCounts); // Set likes count in a separate state
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };
  
  // Fetch likes only when posts are loaded
  useEffect(() => {
    fetchUserLikes();
  }, [posts]);
  

  // Use a real-time listener for posts
  useEffect(() => {
    setLoading(true);

    // Category we're displaying in this screen
    const categoryName = "🌎 Main Lobby";

    // Create a query to the posts collection
    const postsRef = collection(db, "posts", categoryName, "posts");
    const q = query(postsRef);

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const postData = snapshot.docs.map((doc) => ({
          id: doc.id,
          message: doc.data().message,
          name: doc.data().name,
          topicCategory: doc.data().topicCategory || categoryName,
          categoryName: categoryName, // Add explicit categoryName to each post
          // likes: doc.data().likes || 0,
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
        console.log("Real-time posts update:", sortedPosts);
      },
      (error) => {
        console.error("Error in real-time posts listener:", error);
        setLoading(false);
      }
    );

    // Also listen for when the screen comes into focus
    const onFocus = navigation.addListener("focus", () => {
      console.log("Explore screen is focused");
      // Refresh likes when screen is focused
      if (posts.length > 0) {
        fetchUserLikes();
      }
    });

    // Helper function for fetching likes
    const fetchUserLikes = async () => {
      if (posts.length === 0) return;

      try {
        const likedPosts = {};
        for (const post of posts) {
          const likeRef = doc(
            db,
            "posts",
            categoryName,
            "posts",
            post.id,
            "likes",
            userUid
          );
          const likeDoc = await getDoc(likeRef);
          likedPosts[post.id] = likeDoc.exists();
        }
        setHeart(likedPosts);
      } catch (error) {
        console.error("Error fetching likes on focus:", error);
      }
    };

    // Set up interval to update relative timestamps
    const timerId = setInterval(() => {
      setPosts((currentPosts) =>
        currentPosts.map((post) => ({
          ...post,
          timestamp: post.rawTimestamp
            ? formatRelativeTime(post.rawTimestamp)
            : "Unknown time",
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
        <View style={[globalStyles.container, { flex: 1, paddingTop: 0 }]}>
          <View style={[globalStyles.gap24, { marginTop: 0 }]}>
            <View style={globalStyles.gap24}>
              {loading ? (
                <Text style={globalStyles.p}>Loading posts...</Text>
              ) : posts.length === 0 ? (
                <Text style={globalStyles.p}>
                  No posts yet. Be the first to post!
                </Text>
              ) : (
                posts.map((post) => (
                  <View
                    key={post.id}
                    style={[globalStyles.gap24, styles.postContainer]}
                  >
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
                        <Pressable
                          onPress={() => toggleLike(post.id, post.categoryName)}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              gap: 8,
                              alignItems: "center",
                            }}
                          >
                            <Icon
                              name={heart[post.id] ? "heart" : "heart-outline"}
                              color={heart[post.id] ? "#EC221F" : "#b3b3b3"}
                              size={24}
                            />
                            <Text
                              style={[globalStyles.pBold, { color: "#b3b3b3" }]}
                            >
                              {likes[post.id] || 0}
                            </Text>
                          </View>
                        </Pressable>
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 8,
                            alignItems: "center",
                          }}
                        >
                          <Icon
                            name="comment-outline"
                            size={24}
                            color={"#b3b3b3"}
                          />
                          <Text
                            style={[globalStyles.pBold, { color: "#b3b3b3" }]}
                          >
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
