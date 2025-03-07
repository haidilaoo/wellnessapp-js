// Component for user avatar and name
import { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { globalStyles } from "../globalStyles";

const UserHeader = ({ name, subtitle, size = 56, postId, collection }) => { 
  const [profileImageUri, setProfileImageUri] = useState(null);

  // Fetch profile picture of post's user
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const postDoc = await getDoc(doc(db, collection, postId));
  
        // Fetch profile image if available
        if (postDoc.exists() && postDoc.data().profileImageUri) {
          setProfileImageUri(postDoc.data().profileImageUri);
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    if (postId) fetchProfileImage();
  }, [postId]); // ✅ Add postid as a dependency

  return (
    <View style={styles.userHeaderContainer}>
      <Image
        source={profileImageUri ? { uri: profileImageUri } : require("../assets/Avatar.png")}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
      <View style={{ flexDirection: "column", marginLeft: 8 }}>
        <Text style={[globalStyles.pBold]}>{name}</Text>
        <Text style={[globalStyles.p, { marginTop: 2, fontSize: 14 }]}>
          {subtitle}
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
userHeaderContainer: {
    flexDirection: "row",
    gap: 12,
  },
});

export default UserHeader;
