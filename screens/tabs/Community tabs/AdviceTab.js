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

import { Chip, FAB } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

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
  where,
  orderBy,
} from "firebase/firestore";
import { COLORS, globalStyles } from "../../../globalStyles";
import { db } from "../../../firebaseConfig";

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

export default function AdviceTab() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heart, setHeart] = useState({}); // Use an object instead of an array

  // Get current user UID
  const userUid = getAuth().currentUser.uid;

  const toggleLike = async (postId) => {
    try {
      setHeart((prevHeart) => {
        const newHeartState = !prevHeart[postId];
        return { ...prevHeart, [postId]: newHeartState };
      });

      const likeRef = doc(db, "posts", postId, "likes", userUid);
      const likeDoc = await getDoc(likeRef);
      const isCurrentlyLiked = likeDoc.exists();

      if (isCurrentlyLiked) {
        await deleteDoc(likeRef);
      } else {
        await setDoc(likeRef, { liked: true, timestamp: serverTimestamp() });
      }

      // Update the like count in Firestore
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        likes: isCurrentlyLiked ? increment(-1) : increment(1),
        last_updated: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };
  const fetchUserLikes = async () => {
    if (posts.length === 0) return;

    try {
      const likedPosts = {};

      // Fetch likes for each post in parallel
      const likePromises = posts.map(async (post) => {
        const likeRef = doc(db, "posts", post.id, "likes", userUid);
        const likeDoc = await getDoc(likeRef);

        // Store whether the user liked this post
        likedPosts[post.id] = likeDoc.exists();
      });

      await Promise.all(likePromises); // Wait for all like checks to complete
      setHeart(likedPosts);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };
  // Fetch likes only when posts are loaded
  useEffect(() => {
    fetchUserLikes();
  }, [posts]); // Run when posts change

  // Use a real-time listener for posts
  useEffect(() => {
    setLoading(true);

    const postsRef = collection(db, "posts");
    const q = query(
      postsRef,
      where("topicCategory", "==", "🤔 Need Advice?"),
      orderBy("timestamp", "desc")
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const allPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          message: doc.data().message,
          name: doc.data().name,
          topicCategory: doc.data().topicCategory, // Now stored as a field
          likes: doc.data().likes || 0,
          replyCount: doc.data().replyCount || 0,
          rawTimestamp: doc.data().timestamp,
          profileImageUri: doc.data().profileImageUri,
          timestamp: doc.data().timestamp
            ? formatRelativeTime(doc.data().timestamp)
            : "Unknown time",
          createdAt: doc.data().timestamp
            ? new Date(doc.data().timestamp.seconds * 1000)
            : new Date(0),
        }));

        console.log(`Received ${allPosts.length} posts`);

        // Sort all posts by timestamp (newest first)
        setPosts(allPosts.sort((a, b) => b.createdAt - a.createdAt));
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching posts:", error);
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
          const likeRef = doc(db, "posts", post.id, "likes", userUid);
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
                <View
                  style={{
                    alignItems: "center",
                    gap: 16,
                    paddingHorizontal: 16,
                    marginTop: 56,
                  }}
                >
                  <Image
                    source={require("../../../assets/nopost.png")}
                    style={{ width: 183, height: 102 }}
                  />
                  <Text
                    style={[
                      globalStyles.smallText,
                      { textAlign: "center", opacity: 0.5 },
                    ]}
                  >
                    No posts in this topic yet...{"\n"}
                    Be the first to post!
                  </Text>
                </View>
              ) : (
                posts.map((post) => (
                  <View
                    key={post.id}
                    style={[globalStyles.gap24, styles.postContainer]}
                  >
                    <View style={{ flexDirection: "row", gap: 12 }}>
                      <Image
                        source={
                          post.profileImageUri
                            ? { uri: post.profileImageUri }
                            : require("../../../assets/Avatar.png")
                        }
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 56 / 2,
                        }}
                      ></Image>
                      <View style={[{ flexDirection: "column" }]}>
                        <Text style={globalStyles.pBold}>{post.name}</Text>
                        <Text
                          style={[
                            globalStyles.p,
                            { marginTop: 2, fontSize: 14 },
                          ]}
                        >
                          {post.topicCategory}
                        </Text>
                      </View>
                    </View>
                    <Text style={[globalStyles.p, { color: COLORS.black }]}>
                      {post.message}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row-reverse",
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
                        <Pressable onPress={() => toggleLike(post.id)}>
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
                        <Pressable
                          onPress={() =>
                            navigation.navigate("PostScreen", { post, heart })
                          }
                        >
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
                              {post.replyCount || 0}
                            </Text>
                          </View>
                        </Pressable>
                      </View>
                      <Text style={[globalStyles.p, { color: "#b3b3b3" }]}>
                        {post.timestamp}
                      </Text>
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
