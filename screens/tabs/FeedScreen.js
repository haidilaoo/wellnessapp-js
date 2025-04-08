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

// Helper function to format timestamps in a relative time style
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
  const [heart, setHeart] = useState({}); // Object to track liked posts
  const [likes, setLikes] = useState({}); // Store likes count separately
  // Get current user UID
  const userUid = getAuth().currentUser.uid;

  //OLD STRUCTURE
  // const toggleLike = async (postId, categoryName) => {
  //     try {
  //       setHeart((prevHeart) => {
  //         const newHeartState = !prevHeart[postId];

  //         // Optimistically update likes count without Firestore
  //         setLikes((prevLikes) => ({
  //           ...prevLikes,
  //           [postId]: newHeartState ? (prevLikes[postId] || 0) + 1 : (prevLikes[postId] || 0) - 1,
  //         }));

  //         return { ...prevHeart, [postId]: newHeartState };
  //       });

  //       const likeRef = doc(db, "posts", categoryName, "posts", postId, "likes", userUid);
  //       const likeDoc = await getDoc(likeRef);
  //       const isCurrentlyLiked = likeDoc.exists();

  //       if (isCurrentlyLiked) {
  //         await deleteDoc(likeRef);
  //       } else {
  //         await setDoc(likeRef, { liked: true, timestamp: serverTimestamp() });
  //       }

  //       // Update Firestore like count in the background
  //       const postRef = doc(db, "posts", categoryName, "posts", postId);
  //       await updateDoc(postRef, {
  //         likes: isCurrentlyLiked ? increment(-1) : increment(1),
  //         last_updated: serverTimestamp(),
  //       });

  //     } catch (error) {
  //       console.error("Error toggling like:", error);
  //     }
  //   };

  // Fetch user's likes when posts are loaded
  const toggleLike = async (postId) => {
    try {
      setHeart((prevHeart) => {
        const newHeartState = !prevHeart[postId];

        // Optimistically update likes count without Firestore
        setLikes((prevLikes) => ({
          ...prevLikes,
          [postId]: newHeartState
            ? (prevLikes[postId] || 0) + 1
            : (prevLikes[postId] || 0) - 1,
        }));

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

  useEffect(() => {
    const fetchUserLikes = async () => {
      if (posts.length === 0) return;

      try {
        const likedPosts = {};
        const likeCounts = {}; // Store likes count separately

        // Fetch likes for each post in parallel
        const likePromises = posts.map(async (post) => {
          const likeRef = doc(db, "posts", post.id, "likes", userUid);
          const likeDoc = await getDoc(likeRef);

          // Store whether the user liked this post
          likedPosts[post.id] = likeDoc.exists();

          // Fetch like count separately to avoid flickering
          const postRef = doc(db, "posts", post.id);
          const postDoc = await getDoc(postRef);
          likeCounts[post.id] = postDoc.exists()
            ? postDoc.data().likes || 0
            : 0;
        });

        await Promise.all(likePromises); // Wait for all like checks to complete

        setHeart(likedPosts);
        setLikes(likeCounts); // Set likes count separately if needed
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchUserLikes();
  }, [posts]); // Run when posts change

  //FETCH POSTS
  useEffect(() => {
    setLoading(true);
    setPosts([]);

    // Set up a real-time listener on the "posts" collection
    const postsRef = collection(db, "posts");
    const q = query(postsRef); // Modify if you want ordering (e.g., orderBy("timestamp", "desc"))

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

    // Cleanup the listener when component unmounts
    return () => {
      console.log("Cleaning up post listener");
      unsubscribe();
    };
  }, []);

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
                <View
                  style={{
                    alignItems: "center",
                    gap: 16,
                    paddingHorizontal: 16,
                    marginTop: 56,
                  }}
                >
                  <Image
                    source={require("../../assets/nopost.png")}
                    style={{ width: 183, height: 102 }}
                  />
                  <Text
                    style={[
                      globalStyles.smallText,
                      { textAlign: "center", opacity: 0.5 },
                    ]}
                  >
                    No posts yet...{"\n"}
                    Be the first to post!
                  </Text>
                </View>
              ) : (
                posts.map((post, index) => (
                  <View
                    key={`${post.categoryName}-${post.id}`}
                    style={[globalStyles.gap24, styles.postContainer]}
                  >
                    <View style={{ flexDirection: "row", gap: 12 }}>
                      <Image
                        source={
                          post.profileImageUri
                            ? { uri: post.profileImageUri }
                            : require("../../assets/Avatar.png")
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
