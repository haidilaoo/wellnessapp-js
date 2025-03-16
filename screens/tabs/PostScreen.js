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
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { COLORS, globalStyles } from "../../globalStyles";
import { useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Modal, PaperProvider, Portal } from "react-native-paper";
import Button from "../../components/Button";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
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
import { color } from "react-native-elements/dist/helpers";
import UserHeader from "../../components/UserHeader";

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

// Component for like/comment actions
const ActionButton = ({
  icon,
  count,
  onPress,
  isActive,
  activeColor = "#EC221F",
  style,
  size,
}) => (
  <Pressable onPress={onPress}>
    <View style={styles.actionButtonContainer}>
      <Icon
        name={isActive ? icon.replace("-outline", "") : icon}
        color={isActive ? activeColor : "#b3b3b3"}
        size={size}
      />
      <Text style={[globalStyles.pMedium, { color: "#b3b3b3" }, style]}>
        {count || 0}
      </Text>
    </View>
  </Pressable>
);

// Component for comment replies
const CommentReply = ({
  reply,
  parentAuthor,
  onLike,
  onReply,
  likedState,
  profileImage,
  isNested = false,
  expandedReplies,
  setExpandedReplies,
}) => {
  // Get the expanded state for this comment's replies
  const isExpanded = expandedReplies.includes(reply.id);

  // Toggle expanded state for this comment
  const toggleExpanded = () => {
    if (isExpanded) {
      setExpandedReplies(expandedReplies.filter((id) => id !== reply.id));
    } else {
      setExpandedReplies([...expandedReplies, reply.id]);
    }
  };

  return (
    <View style={[isNested ? styles.replySubContainer : styles.replyContainer]}>
      <View style={styles.replyHeaderContainer}>
        {isNested && (
          <Icon name="arrow-right-bottom" size={16} color="#b3b3b3" />
        )}
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require("../../assets/Avatar.png")
          }
          style={{ width: 24, height: 24, borderRadius: 24 / 2 }}
        />
        <Text style={[globalStyles.pBold, { color: COLORS.black }]}>
          {reply.name}
        </Text>
        {!isNested && (
          <>
            <Icon name="arrow-right" size={16} color="#b3b3b3" />
            <Text style={{ color: COLORS.blackSecondary }}>
              {" "}
              {parentAuthor}
            </Text>
          </>
        )}
      </View>

      <Text style={[globalStyles.p, { color: COLORS.black }]}>
        {reply.comment}
      </Text>

      <View style={styles.replyActionsContainer}>
        <Text style={globalStyles.p}>{reply.timestamp}</Text>
        <View style={styles.actionsRow}>
          <ActionButton
            icon="heart-outline"
            count={reply.likes}
            onPress={() => onLike(reply.id)}
            isActive={likedState[reply.id]}
            size={16}
          />
          <ActionButton
            icon="reply-outline"
            count={reply.replyCount}
            onPress={() => onReply(reply.id)}
            isActive={false}
            size={16}
          />
        </View>
      </View>

      {/* View More Replies Button */}
      {reply.replies && reply.replies.length > 0 && (
        <Pressable onPress={toggleExpanded}>
          <Text
            style={[
              globalStyles.smallText,
              { color: COLORS.blackSecondary, marginTop: 8 },
            ]}
          >
            {!isExpanded
              ? `View more replies (${reply.replies.length})`
              : "Hide replies"}
          </Text>
        </Pressable>
      )}

      {/* Render Replies */}
      {isExpanded &&
        reply.replies.map((nestedReply) => (
          <CommentReply
            key={nestedReply.id}
            reply={nestedReply}
            parentAuthor={reply.name}
            profileImage={nestedReply.profileImageUri}
            onLike={onLike}
            onReply={onReply}
            likedState={likedState}
            isNested={true}
            expandedReplies={expandedReplies}
            setExpandedReplies={setExpandedReplies}
          />
        ))}
    </View>
  );
};

export default function PostScreen() {
  const route = useRoute();
  const { post } = route.params;
  const userUid = getAuth().currentUser.uid;
  const screenWidth = useWindowDimensions().width;

  // State variables
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [buttonState, setButtonState] = useState(false);
  const [visible, setVisible] = useState(false);
  const [likedState, setLikedState] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [likedStateComment, setLikedStateComment] = useState({});
  const [commentsCount, setCommentsCount] = useState(post.replyCount || 0);
  const [replyTarget, setReplyTarget] = useState({
    type: null,
    id: null,
    author: null,
  });

  // State to track expanded replies - store IDs of expanded comments
  const [expandedReplies, setExpandedReplies] = useState([]);

  // Ref to maintain scroll position
  const scrollViewRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Modal functions
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  // Handle button state change
  const handleButtonChange = useCallback((text) => {
    setButtonState(text.length > 0);
  }, []);

  // Toggle post like
  const toggleLike = async (postId) => {
    try {
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

  // Toggle comment like
  const toggleLikeComment = async (commentId) => {
    if (!commentId || !userUid) {
      console.error("Missing commentId or userId");
      return;
    }

    try {
      const likeRef = doc(db, "likes", `${commentId}_${userUid}`);
      const likeDoc = await getDoc(likeRef);
      const isCurrentlyLiked = likeDoc.exists();

      if (isCurrentlyLiked) {
        await deleteDoc(likeRef); // Remove like
      } else {
        await setDoc(likeRef, {
          commentId: commentId,
          userId: userUid,
          timestamp: serverTimestamp(),
        });
      }

      // Update the comment's like count
      const commentRef = doc(db, "comments", commentId);
      await updateDoc(commentRef, {
        likes: isCurrentlyLiked ? increment(-1) : increment(1),
      });
    } catch (error) {
      console.error("Error toggling comment like:", error);
    }
  };

  // Insert comment to database
  const insertCommentToDatabase = async () => {
    try {
      // Save scroll position before adding comment
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: scrollPosition, animated: false });
      }

      const userDocRef = doc(db, "users", userUid);
      const userDocSnap = await getDoc(userDocRef);

      // Determine the parent ID based on reply target
      const parentId = replyTarget.type === "comment" ? replyTarget.id : null;

      const commentRef = collection(db, "comments");
      await addDoc(commentRef, {
        postId: post.id,
        parentId: parentId,
        authorId: userUid,
        author: userDocSnap.data().nickname,
        comment: comment,
        profileImageUri: userDocSnap.data().profileImageUri,
        timestamp: serverTimestamp(),
        likes: 0,
        replyCount: 0,
      });

      // Update commentsCount on MAIN post
      const postCommentRef = doc(db, "posts", post.id);
      await updateDoc(postCommentRef, {
        replyCount: increment(1),
      });

      if (parentId) {
        // Update replyCount on the parent comment
        const parentCommentRef = doc(db, "comments", parentId);
        await updateDoc(parentCommentRef, {
          replyCount: increment(1),
        });

        // If replying to a comment that isn't yet expanded, expand it
        if (!expandedReplies.includes(parentId)) {
          setExpandedReplies((prev) => [...prev, parentId]);
        }
      }

      // Reset after submission
      setComment("");
      hideModal();
    } catch (error) {
      console.error("Error inserting new comment:", error);
    }
  };

  // Reply functions
  const openReplyToPost = useCallback(() => {
    setReplyTarget({ type: "post", id: null });
    showModal();
  }, []);

  const openReplyToComment = useCallback(async (commentId) => {
    try {
      const commentRef = doc(db, "comments", commentId);
      const commentSnap = await getDoc(commentRef);
      setReplyTarget({
        type: "comment",
        id: commentId,
        author: commentSnap.data().author,
      });
      showModal();
    } catch (error) {
      console.error("Error opening reply to comment:", error);
    }
  }, []);

  // Organize comments hierarchically
  const organizeComments = useCallback((comments) => {
    const commentMap = new Map();
    const topLevelComments = [];

    // Create a map of all comments with replies
    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Organize replies
    comments.forEach((comment) => {
      if (comment.parentId) {
        const parentComment = commentMap.get(comment.parentId);
        if (parentComment) {
          parentComment.replies.push(commentMap.get(comment.id));
        }
      } else {
        topLevelComments.push(commentMap.get(comment.id));
      }
    });

    // Sort top-level comments by timestamp, newest first
    topLevelComments.sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    // Sort replies within each comment, newest first
    topLevelComments.forEach((comment) => {
      if (comment.replies && comment.replies.length > 0) {
        comment.replies.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
      }
    });

    return topLevelComments;
  }, []);

  // Effects

  // Fetch post likes count
  useEffect(() => {
    if (!post?.id) return;

    const postRef = doc(db, "posts", post.id);
    const unsubscribe = onSnapshot(postRef, (postDoc) => {
      if (postDoc.exists()) {
        setLikeCounts((prevState) => ({
          ...prevState,
          [post.id]: postDoc.data().likes || 0,
        }));
      }
    });

    return () => unsubscribe();
  }, [post]);

  // Fetch post comment count
  useEffect(() => {
    if (!post?.id) return;

    const postRef = doc(db, "posts", post.id);
    const unsubscribe = onSnapshot(postRef, (postDoc) => {
      if (postDoc.exists()) {
        setCommentsCount(postDoc.data().replyCount || 0);
      }
    });

    return () => unsubscribe();
  }, [post?.id]);

  // Fetch post like state
  useEffect(() => {
    if (!post?.id || !userUid) return;

    const likeRef = doc(db, "posts", post.id, "likes", userUid);
    const unsubscribe = onSnapshot(likeRef, (docSnap) => {
      setLikedState((prev) => ({
        ...prev,
        [post.id]: docSnap.exists(),
      }));
    });

    return () => unsubscribe();
  }, [post?.id, userUid]);

  // Fetch comments
  useEffect(() => {
    if (!post?.id) return;

    const q = query(
      collection(db, "comments"),
      where("postId", "==", post.id),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().author,
        comment: doc.data().comment,
        parentId: doc.data().parentId,
        likes: doc.data().likes || 0,
        replyCount: doc.data().replyCount || 0,
        profileImageUri: doc.data().profileImageUri,
        rawTimestamp: doc.data().timestamp,
        timestamp: doc.data().timestamp
          ? formatRelativeTime(doc.data().timestamp)
          : "Unknown time",
        createdAt: doc.data().timestamp
          ? new Date(doc.data().timestamp.seconds * 1000)
          : new Date(0),
      }));

      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [post]);

  // Fetch comment like states
  useEffect(() => {
    if (!comments.length || !userUid) return;

    const unsubscribers = comments.map((comment) => {
      const likeRef = doc(db, "likes", `${comment.id}_${userUid}`);

      return onSnapshot(likeRef, (docSnap) => {
        setLikedStateComment((prev) => ({
          ...prev,
          [comment.id]: docSnap.exists(),
        }));
      });
    });

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [comments, userUid]);

  // Render functions
  const RepliesContainer = ({ comment, children }) => {
    // Get the expanded state for this comment
    const isExpanded = expandedReplies.includes(comment.id);

    // Toggle expanded state for this comment
    const toggleExpanded = () => {
      if (isExpanded) {
        setExpandedReplies(expandedReplies.filter((id) => id !== comment.id));
      } else {
        setExpandedReplies([...expandedReplies, comment.id]);
      }
    };

    return (
      <View style={{ marginLeft: 16 }}>
        {!isExpanded ? (
          <Pressable onPress={toggleExpanded}>
            <Text
              style={[
                globalStyles.smallText,
                { color: COLORS.blackSecondary, marginLeft: -16 },
              ]}
            >
              View replies ({comment.replies.length})
            </Text>
          </Pressable>
        ) : (
          <>
            <Pressable onPress={toggleExpanded}>
              <Text
                style={[
                  globalStyles.smallText,
                  { color: COLORS.blackSecondary, marginLeft: -16 },
                ]}
              >
                Hide replies
              </Text>
            </Pressable>
            <View>{children}</View>
          </>
        )}
      </View>
    );
  };

  // Render main replies
  const renderMainReplies = (comment) => {
    if (!comment.replies || comment.replies.length === 0) return null;

    return (
      <RepliesContainer comment={comment}>
        {comment.replies.map((reply, index) => (
          <CommentReply
            key={reply.id || index}
            reply={reply}
            parentAuthor={comment.name}
            profileImage={reply.profileImageUri}
            onLike={toggleLikeComment}
            onReply={openReplyToComment}
            likedState={likedStateComment}
            isNested={true}
            expandedReplies={expandedReplies}
            setExpandedReplies={setExpandedReplies}
          />
        ))}
      </RepliesContainer>
    );
  };

  const organizedComments = organizeComments(comments);

  // Track scroll position
  const handleScroll = (event) => {
    const { y } = event.nativeEvent.contentOffset;
    setScrollPosition(y);
  };

  return (
    <PaperProvider>
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View
          style={[
            globalStyles.container,
            { backgroundColor: "#FFFFFF", paddingTop: 0 },
          ]}
        >
          {/* Post content */}
          <View style={[globalStyles.gap24, styles.postContainer]}>
            <UserHeader
              name={post.name}
              subtitle={post.topicCategory}
              postId={post.id}
              collection={"posts"}
            />

            <Text style={[globalStyles.p, { color: COLORS.black }]}>
              {post.message}
            </Text>

            <View style={styles.postActionsContainer}>
              <View style={styles.actionButtonsGroup}>
                <ActionButton
                  icon="heart-outline"
                  count={likeCounts[post.id] || 0}
                  onPress={() => toggleLike(post.id)}
                  isActive={likedState[post.id]}
                  size={24}
                  style={[globalStyles.pBold, { color: "#b3b3b3" }]}
                />
                <ActionButton
                  icon="comment-outline"
                  count={commentsCount}
                  onPress={openReplyToPost}
                  isActive={false}
                  size={24}
                  style={[globalStyles.pBold, { color: "#b3b3b3" }]}
                />
              </View>
              <Text style={[globalStyles.p, { color: "#b3b3b3" }]}>
                {post.timestamp}
              </Text>
            </View>
          </View>

          {/* Replies section header */}
          <View style={[styles.divider, { width: screenWidth }]}>
            <Text style={[globalStyles.smallTextBold, styles.repliesHeader]}>
              Replies
            </Text>
          </View>

          {/* Comments list */}
          {organizedComments.length !== 0 ? (
            organizedComments.map((comment, index) => (
              <View
                key={index}
                style={[
                  globalStyles.gap16,
                  styles.postContainer,
                  { borderTopWidth: 1, borderColor: "#E8E8E8" },
                ]}
              >
                <UserHeader
                  name={comment.name}
                  subtitle={comment.timestamp}
                  postId={comment.id}
                  collection={"comments"}
                />

                <Text style={[globalStyles.p, { color: COLORS.black }]}>
                  {comment.comment}
                </Text>

                <View style={styles.commentActionsContainer}>
                  <View style={styles.actionsRow}>
                    <ActionButton
                      icon="heart-outline"
                      count={comment.likes}
                      onPress={() => toggleLikeComment(comment.id)}
                      isActive={likedStateComment[comment.id]}
                      size={16}
                    />
                    <ActionButton
                      icon="reply-outline"
                      count={comment.replyCount}
                      onPress={() => openReplyToComment(comment.id)}
                      isActive={false}
                      size={16}
                    />
                  </View>
                </View>

                {renderMainReplies(comment)}
              </View>
            ))
          ) : (
            <View
              style={{
                alignItems: "center",
                gap: 16,
                paddingHorizontal: 16,
                marginTop: 24,
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
                No replies yet...{"\n"}
                Be the first to comment!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Reply Modal */}
      <Portal>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "height" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 180}
        >
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <Text style={[globalStyles.p, { marginBottom: 16 }]}>
                {replyTarget.type === "comment"
                  ? `Reply to @${replyTarget.author}`
                  : `Reply to @${post.name}`}
              </Text>

              <TextInput
                placeholder="Write your reply"
                multiline={true}
                autoFocus={true}
                numberOfLines={4}
                maxLength={250}
                value={comment}
                style={styles.replyInput}
                onChangeText={(text) => {
                  setComment(text);
                  handleButtonChange(text);
                }}
              />

              <Button
                style={styles.replyButton}
                title="Reply"
                state={buttonState}
                onPress={insertCommentToDatabase}
              />
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </Portal>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 16,
  },
  divider: {
    position: "relative",
    left: -16,
  },
  repliesHeader: {
    marginVertical: 8,
    color: COLORS.blackSecondary,
    borderTopWidth: 8,
    borderColor: COLORS.background,
    paddingTop: 16,
    paddingLeft: 16,
  },
  replyContainer: {
    marginTop: 8,
    paddingVertical: 4,
    borderLeftWidth: 2,
    borderColor: "#E8E8E8",
    paddingLeft: 8,
  },
  replySubContainer: {
    marginTop: 8,
    paddingVertical: 4,
    borderLeftWidth: 2,
    borderColor: "#E8E8E8",
    paddingLeft: 8,
  },
  userHeaderContainer: {
    flexDirection: "row",
    gap: 12,
  },
  actionButtonContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 16,
    alignSelf: "flex-start",
  },
  postActionsContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commentActionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  actionButtonsGroup: {
    flexDirection: "row",
    gap: 16,
    backgroundColor: "#F4F6F8",
    borderRadius: 16,
    padding: 16,
    alignSelf: "flex-start",
  },
  replyHeaderContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  replyActionsContainer: {
    marginTop: 8,
    justifyContent: "space-between",
    alignContent: "center",
    flexDirection: "row",
  },
  modalContainer: {
    position: "absolute",
    bottom: -32,
    width: "100%",
  },
  modalContent: {
    backgroundColor: COLORS.background,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  replyInput: {
    color: COLORS.black,
    fontSize: 16,
  },
  replyButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignSelf: "flex-end",
    marginTop: 24,
  },
});
