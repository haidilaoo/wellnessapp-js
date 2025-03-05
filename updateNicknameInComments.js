// updateNicknameInComments.js
import { doc, getDocs, collection, query, where, writeBatch } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Adjust based on your Firebase config

const updateNicknameInComments = async (newNickname, userUid) => {
    const commentsRef = collection(db, "comments");
    const commentsQuery = query(commentsRef, where("authorId", "==", userUid)); // Assuming userUid is used to associate comments with the user
    const commentsSnapshot = await getDocs(commentsQuery);

    if (commentsSnapshot.empty) {
        console.log("No comments found for this user.");
        return;
    }

    // Use a batch to update all comments at once
    const batch = writeBatch(db);

    commentsSnapshot.forEach((docSnapshot) => {
        const commentRef = doc(db, "comments", docSnapshot.id);
        batch.update(commentRef, { author: newNickname }); // Update the nickname in each comment
    });

    // Commit the batch update
    await batch.commit();

    console.log("Comments updated with new nickname.");
};

export { updateNicknameInComments };
