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
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
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

export default function CommunityScreen() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [heart, setHeart] = useState({}); // Object to track liked posts
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
  useEffect(() => {
    const fetchUserLikes = async () => {
      if (posts.length === 0) return;

      try {
        const likedPosts = {};
        const likeCounts = {}; // Store likes count separately
  
        // Check each post to see if the current user has liked it
        for (const post of posts) {
          const likeRef = doc(
            db,
            "posts",
            post.categoryName,
            "posts",
            post.id,
            "likes",
            userUid
          );
          const likeDoc = await getDoc(likeRef);
          likedPosts[post.id] = likeDoc.exists();
        }

        setHeart(likedPosts);
        setLikes(likeCounts); // Set likes count in a separate state
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchUserLikes();
  }, [posts]); // Run when posts change

  // Initial data loading
  useEffect(() => {
    setLoading(true);
    setPosts([]);

    // Known category names
    const categoryNames = [
      "💭 Deep Talks & Feels",
      "🌎 Main Lobby",
      "😩 Vent & Rant",
      "🚩 Toxic or Nah?",
      "🤔 Need Advice?",
    ];

    setCategories(categoryNames);
    const listeners = [];

    // Set up listeners for each category
    categoryNames.forEach((categoryName) => {
      console.log(`Setting up listener for category: ${categoryName}`);

      const postsRef = collection(db, "posts", categoryName, "posts");
      const q = query(postsRef);

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const categoryPosts = snapshot.docs.map((doc) => ({
            id: doc.id,
            message: doc.data().message,
            name: doc.data().name,
            topicCategory: doc.data().topicCategory || categoryName,
            categoryName: categoryName, // Store the category name explicitly
            likes: doc.data().likes || 0,
            rawTimestamp: doc.data().timestamp,
            timestamp: doc.data().timestamp
              ? formatRelativeTime(doc.data().timestamp)
              : "Unknown time",
            createdAt: doc.data().timestamp
              ? new Date(doc.data().timestamp.seconds * 1000)
              : new Date(0),
          }));

          console.log(
            `Received ${categoryPosts.length} posts from ${categoryName}`
          );

          // Update posts state - merge with existing posts
          setPosts((currentPosts) => {
            // Remove any existing posts from this category
            const filteredPosts = currentPosts.filter(
              (post) => post.categoryName !== categoryName
            );

            // Add new posts from this category
            const newPosts = [...filteredPosts, ...categoryPosts];

            // Sort all posts by timestamp (newest first)
            return newPosts.sort((a, b) => b.createdAt - a.createdAt);
          });

          setLoading(false);
        },
        (error) => {
          console.error(`Error in ${categoryName} listener:`, error);
        }
      );

      listeners.push(unsubscribe);
    });

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

    // Clean up listeners when component unmounts
    return () => {
      console.log("Cleaning up listeners");
      listeners.forEach((unsubscribe) => unsubscribe());
      clearInterval(timerId);
    };
  }, []); // Empty dependency array to run only once

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[globalStyles.container, { flex: 1, paddingTop: 0 }]}>
          <View style={[globalStyles.gap24, {}]}>
            <View style={globalStyles.gap24}>
              {loading ? (
                <Text style={globalStyles.p}>Loading posts...</Text>
              ) : posts.length === 0 ? (
                <Text style={globalStyles.p}>
                  No posts yet. Be the first to post!
                </Text>
              ) : (
                posts.map((post, index) => (
                  <View
                    key={`${post.categoryName}-${post.id}`}
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
                              {post.likes || 0}
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
