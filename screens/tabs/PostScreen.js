import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TextInput,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, globalStyles } from "../../globalStyles";
import { useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Modal, PaperProvider, Portal } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Button from "../../components/Button";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
// import { ScrollView } from "react-native-gesture-handler";

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
export default function PostScreen() {
  const route = useRoute();
  const { post, heart } = route.params; // Get the post data
  const [comment, setCommment] = useState();
  const [postheart, setHeart] = useState({ heart });
  const [likes, setLikes] = useState({}); // Store likes count separately

  const [comments, setComments] = useState([]);
  const [commentId, setCommmentId] = useState(); // to get which comment is the one changing

  const [buttonState, setButtonState] = useState(false);
  const handleButtonChange = (comment) => {
    if (comment.length > 0) {
      setButtonState(true);
    } else {
      setButtonState(false);
    }
  };
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const screenWidth = useWindowDimensions().width;

  const userUid = getAuth().currentUser.uid;

  //UPDATES FIRESTORE BACKEND LIKES COUNT
  const toggleLike = async (postId) => {
    try {
      // // Optimistically update the UI //no need also can as is handled by useEffects
      // setLikedState((prev) => ({
      //   ...prev,
      //   [postId]: !prev[postId], // Toggle state immediately
      // }));

      // setLikeCounts((prev) => ({
      //   ...prev,
      //   [postId]: prev[postId] + (likedState[postId] ? -1 : 1), // Adjust count
      // }));
      const likeRef = doc(db, "posts", postId, "likes", userUid);
      const likeDoc = await getDoc(likeRef);
      const postRef = doc(db, "posts", postId);

      if (likeDoc.exists()) {
        // Unlike: Remove like document and decrement count
        await deleteDoc(likeRef);
        await updateDoc(postRef, {
          likes: increment(-1),
          last_updated: serverTimestamp(),
        });
      } else {
        // Like: Add like document and increment count
        await setDoc(likeRef, { liked: true, timestamp: serverTimestamp() });
        await updateDoc(postRef, {
          likes: increment(1),
          last_updated: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const [likedState, setLikedState] = useState({});
  const [likeCounts, setLikeCounts] = useState({});

  //FETCH INITIAL LIKE COUNT INFORMATION FROM DATABASE
  useEffect(() => {
    if (!post?.id) return;

    // Reference to the post document
    const postRef = doc(db, "posts", post.id);

    // Listen for changes in Firestore in real-time
    const unsubscribe = onSnapshot(postRef, (postDoc) => {
      if (postDoc.exists()) {
        setLikeCounts((prevState) => ({
          ...prevState,
          [post.id]: postDoc.data().likes || 0,
        }));
      }
    });

    return () => unsubscribe(); // Cleanup when component unmounts
  }, [post, userUid]);

  //FETCH INITIAL LIKE STATE INFORMATION FROM DATABASE FOR HEART UI FILLED OR NOT
  useEffect(() => {
    if (!post?.id || !userUid) return;

    const likeRef = doc(db, "posts", post.id, "likes", userUid);

    const unsubscribe = onSnapshot(likeRef, (docSnap) => {
      setLikedState((prev) => ({
        ...prev,
        [post.id]: docSnap.exists(), // If the document exists, it's liked
      }));
    });

    return () => unsubscribe(); // Cleanup listener
  }, [post?.id, userUid]);

  const [likedStateComment, setLikedStateComment] = useState({});

  const insertCommentToDatabase = async (postId, categoryName, ) => {
    const userDocRef = doc(db, "users", userUid);
    const userDocSnap = await getDoc(userDocRef);
 // Determine the parent ID based on reply target
 const parentId = replyTarget.type === 'comment' ? replyTarget.id : null;
    try {
      const commentRef = collection(db, "comments");
      await addDoc(commentRef, {
        postId: postId,
        parentId: parentId,
        authorId: userUid,
        author: userDocSnap.data().nickname,
        comment: comment,
        timestamp: serverTimestamp(),
        likes: 0,
      });
      console.log("New comment inserted into database.");
       // Reset after submission
    setCommment('');
    hideModal();
    } catch (error) {
      console.error("Error inserting new comment into database.", error);
    }
  };

  const fetchComments = async (postId) => {
    const q = query(
      collection(db, "comments"),
      where("postId", "==", post.id),
      orderBy("timestamp", "asc")
    );
    const snapshot = await getDocs(q);
    const comments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return comments;
  };
  //FETCH COMMENTS FOR THIS POST
  useEffect(() => {
    // if (!post?.id || !post?.topicCategory) return; // Ensure post exists
    // const postRef = doc(db, "posts", post.topicCategory, "posts", post.id);
    // const commentsRef = collection(postRef, "comments");
    // const q = query(commentsRef);
    const q = query(
      collection(db, "comments"),
      where("postId", "==", post.id),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const comments = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().author,
        comment: doc.data().comment,
        likes: doc.data().likes || 0,
        rawTimestamp: doc.data().timestamp,
        timestamp: doc.data().timestamp
          ? formatRelativeTime(doc.data().timestamp)
          : "Unknown time",
        createdAt: doc.data().timestamp
          ? new Date(doc.data().timestamp.seconds * 1000)
          : new Date(0),
      }));
      setComments(comments);
      // console.log("Comments: ", comments);
    });
    return () => unsubscribe(); // Cleanup listener on unmount
  }, [post]); // Re-run when post changes

  const toggleLikeComment = async (commentId, userId) => {
    if (!commentId || !userId) {
      console.error("Missing commentId or userId");
      return;
    }

    try {
      const likeRef = doc(db, "likes", `${commentId}_${userId}`);
      const likeDoc = await getDoc(likeRef);
      const isCurrentlyLiked = likeDoc.exists();
    
    //NO NEED THIS ALSO CAN AS THIS DOES NOT UPDATE HEART UI BASED ON USERUID AND ONLY LOCALLY 
      // // Update the state as an object with commentId as key
      // setLikedStateComment((prev) => ({
      //   ...prev,
      //   [commentId]: !isCurrentlyLiked,
      // }));

      if (isCurrentlyLiked) {
        await deleteDoc(likeRef); // Remove like
      } else {
        await setDoc(likeRef, {
          commentId: commentId, // Reference to the comment
          userId: userId, // User who liked it
          timestamp: serverTimestamp(),
        });
      }

      // Update the comment's like count
      const commentRef = doc(db, "comments", commentId);
      await updateDoc(commentRef, {
        likes: isCurrentlyLiked ? increment(-1) : increment(1),
      });
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  //comment like update (TO MAKE SURE HEART UI STATE IS TAKEN FROM FIREBASE AND NOT JUS UPDATED LOCALLY)
  useEffect(() => {
    if (!comments.length || !userUid) return;
    
    // Set up listeners for each comment's like status
    const unsubscribers = comments.map(comment => {
      const likeRef = doc(db, "likes", `${comment.id}_${userUid}`);
      
      return onSnapshot(likeRef, (docSnap) => {
        setLikedStateComment(prev => ({
          ...prev,
          [comment.id]: docSnap.exists()
        }));
      });
    });
    
    // Cleanup all listeners on unmount
    return () => unsubscribers.forEach(unsubscribe => unsubscribe());
  }, [comments, userUid]);

// Add a state to track what you're replying to
const [replyTarget, setReplyTarget] = useState({
  type: null, // 'post' or 'comment'
  id: null    // ID of what you're replying to (null for post)
});
// When opening the modal for post reply
const openReplyToPost = () => {
  setReplyTarget({ type: 'post', id: null });
  showModal();
};
// When opening the modal for comment reply
const openReplyToComment = (commentId) => {
  setReplyTarget({ type: 'comment', id: commentId });
  showModal();
};
  return (
    <PaperProvider>
      <View
        style={[
          globalStyles.container,
          { backgroundColor: "#FFFFFF", paddingTop: 0 },
        ]}
      >
        <ScrollView>
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
              <Pressable onPress={() => toggleLike(post.id, post.categoryName)}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <Icon
                    name={likedState[post.id] ? "heart" : "heart-outline"}
                    color={likedState[post.id] ? "#EC221F" : "#b3b3b3"}
                    size={24}
                  />
                  <Text style={[globalStyles.pBold, { color: "#b3b3b3" }]}>
                    {likeCounts[post.id] || 0}
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => {
                  console.log("Pressed.");
                  // showModal();
                  openReplyToPost();
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <Icon name="comment-outline" size={24} color={"#b3b3b3"} />
                  <Text style={[globalStyles.pBold, { color: "#b3b3b3" }]}>
                    20
                  </Text>
                </View>
              </Pressable>
              <Portal>
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "height" : "height"}
                  style={{ flex: 1 }}
                  keyboardVerticalOffset={100}
                >
                  <Modal
                    visible={visible}
                    onDismiss={hideModal}
                    contentContainerStyle={{
                      position: "absolute",
                      bottom: -32,
                      width: screenWidth,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: COLORS.background,
                        padding: 20,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                      }}
                    >
                      <Text style={[globalStyles.p, { marginBottom: 16 }]}>
                        Reply to @[post's name]
                      </Text>
                      {/* <KeyboardAwareScrollView extraScrollHeight={100}> */}
                      <TextInput
                        placeholder="Write your reply"
                        multiline={true}
                        autoFocus={true}
                        numberOfLines={4}
                        maxLength={250}
                        value={comment}
                        style={{
                          color: COLORS.black,
                          fontSize: 16,
                        }}
                        onChangeText={(comment) => {
                          setCommment(comment);
                          handleButtonChange(comment);
                        }}
                      ></TextInput>
                      {/* </KeyboardAwareScrollView> */}
                      <Button
                        style={{
                          paddingVertical: 8,
                          paddingHorizontal: 20,
                          borderRadius: 24,
                          alignSelf: "flex-end",
                          marginTop: 24,
                        }}
                        title="Reply"
                        state={buttonState}
                        onPress={() => {
                          insertCommentToDatabase(post.id, post.topicCategory,);
                          
                        }}
                      ></Button>
                    </View>
                  </Modal>
                </KeyboardAvoidingView>
              </Portal>
            </View>
            <Text style={globalStyles.p}>{post.timestamp}</Text>
          </View>
        </View>
        <View
          style={[
            styles.divider,
            {
              width: screenWidth,
            },
          ]}
        ></View>
        {comments.map((comment, index) => (
          <View key={index} style={[globalStyles.gap24, styles.postContainer]}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Image
                source={require("../../assets/Avatar.png")}
                style={{
                  width: 56,
                  height: 56,
                }}
              ></Image>
              <View style={[{ flexDirection: "column" }]}>
                <Text style={globalStyles.pBold}>{comment.name}</Text>
                <Text style={globalStyles.p}>{comment.topicCategory}</Text>
              </View>
            </View>
            <Text style={[globalStyles.p, { color: COLORS.black }]}>
              {comment.comment}
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
                  onPress={() => {
                    toggleLikeComment(comment.id, userUid);
                    setCommmentId(comment.id);
                    console.log("likedState: ", likedStateComment[comment.id]);
                    console.log("commentId liked: ", commentId);
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <Icon
                      name={
                        likedStateComment[comment.id]
                          ? "heart"
                          : "heart-outline"
                      }
                      color={
                        likedStateComment[comment.id] ? "#EC221F" : "#b3b3b3"
                      }
                      size={24}
                    />
                    <Text style={[globalStyles.pBold, { color: "#b3b3b3" }]}>
                      {comment.likes || 0}
                    </Text>
                  </View>
                </Pressable>

                <Pressable
                  onPress={() => {
                    console.log("Pressed.");
                    openReplyToComment(comment.id);
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <Icon name="comment-outline" size={24} color={"#b3b3b3"} />
                    <Text style={[globalStyles.pBold, { color: "#b3b3b3" }]}>
                      20
                    </Text>
                  </View>
                </Pressable>
                <Portal>
                  <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "height" : "height"}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={100}
                  >
                    <Modal
                      visible={visible}
                      onDismiss={hideModal}
                      contentContainerStyle={{
                        position: "absolute",
                        bottom: -32,
                        width: screenWidth,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: COLORS.background,
                          padding: 20,
                          borderTopLeftRadius: 20,
                          borderTopRightRadius: 20,
                        }}
                      >
                        <Text style={[globalStyles.p, { marginBottom: 16 }]}>
                          Reply to @[post's name]
                        </Text>
                        {/* <KeyboardAwareScrollView extraScrollHeight={100}> */}
                        <TextInput
                          placeholder="Write your reply"
                          multiline={true}
                          autoFocus={true}
                          numberOfLines={4}
                          maxLength={250}
                          value={comment}
                          style={{
                            color: COLORS.black,
                            fontSize: 16,
                          }}
                          onChangeText={(comment) => {
                            setCommment(comment);
                            handleButtonChange(comment);
                          }}
                        ></TextInput>
                        {/* </KeyboardAwareScrollView> */}
                        <Button
                          style={{
                            paddingVertical: 8,
                            paddingHorizontal: 20,
                            borderRadius: 24,
                            alignSelf: "flex-end",
                            marginTop: 24,
                          }}
                          title="Reply"
                          state={buttonState}
                          onPress={() => {
                            insertCommentToDatabase(
                              post.id,
                              post.topicCategory,
                            );
                          }}
                        ></Button>
                      </View>
                    </Modal>
                  </KeyboardAvoidingView>
                </Portal>
              </View>
              <Text style={globalStyles.p}>{comment.timestamp}</Text>
            </View>
          </View>
        ))}
        </ScrollView>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: COLORS.white,

    paddingVertical: 16,
    // paddingVertical: 24,
    // borderRadius: 16,
    // borderWidth: 1,
    // borderColor: COLORS.borderDefault,
  },
  divider: {
    backgroundColor: COLORS.background,
    height: 8,
    position: "relative",
    left: -16,
  },
});
