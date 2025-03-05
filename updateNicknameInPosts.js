// updateNicknameInPosts.js
import { doc, updateDoc, getDocs, collection, query, where, writeBatch } from "firebase/firestore";
import { db } from "./firebaseConfig";

const updateNicknameInPosts = async (newNickname, userUid) => {
    const postsRef = collection(db, "posts");
    const postsQuery = query(postsRef, where("user", "==", userUid)); // Assuming userUid is used to associate posts with the user
    const postsSnapshot = await getDocs(postsQuery);

    if (postsSnapshot.empty) {
        console.log("No posts found for this user.");
        return;
    }

    // Use a batch to update all posts at once
    const batch = writeBatch(db);

    postsSnapshot.forEach((docSnapshot) => {
        const postRef = doc(db, "posts", docSnapshot.id);
        batch.update(postRef, { name: newNickname }); // Update the nickname in each post
    });

    // Commit the batch update
    await batch.commit();

    console.log("Posts updated with new nickname.");
};

export { updateNicknameInPosts };
