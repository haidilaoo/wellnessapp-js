import {
  StyleSheet,
  Text,
  View,
  Image,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { COLORS, globalStyles } from "../../globalStyles";
import { getAuth } from "firebase/auth";
import { db } from "../../firebaseConfig";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import CircleWithText from "../../components/CircleWithText";
import CircleArrangement from "../../components/CircleArrangement";
import TreemapChart from "../../components/TreemapChart";
import { Chip } from "react-native-paper";

export default function Profile() {
  const { width } = useWindowDimensions();
  const [nickname, setNickname] = useState(null);
  const [memo, setMemo] = useState(null);
  const [meditate, setMeditate] = useState(null);
  const [move, setMove] = useState(null);
  const [sleep, setSleep] = useState(null);
  const [music, setMusic] = useState(null);
  const userUid = getAuth().currentUser.uid;
  const [selectedCircle, setSelectedCircle] = useState(null);
  const handleSelect = (circle) => {
    setSelectedCircle(circle); // Update selected circle
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log("User UID:", userUid);

      try {
        const userDoc = await getDoc(doc(db, "users", userUid));
        //FETCH NICKNAME
        const nickname = userDoc.data().nickname;
        console.log("Nickname: ", nickname);
        setNickname(nickname);
        //FETCH MEMO
        const memo = userDoc.data().memo;
        console.log("Memo: ", memo);
        if (!memo) {
          setMemo("no memo, write one now!");
        } else {
          setMemo(memo);
        }

        //FETCH QUEST COUNTS
        const meditateRef = doc(
          db,
          "users",
          userUid,
          "quest_tally",
          "Meditate"
        );

        const moveRef = doc(db, "users", userUid, "quest_tally", "Move");

        const musicRef = doc(db, "users", userUid, "quest_tally", "Music");

        const sleepRef = doc(db, "users", userUid, "quest_tally", "Sleep");

        // Setup Firestore real-time listener
        const unsubscribeMeditate = onSnapshot(meditateRef, (meditateDoc) => {
          if (meditateDoc.exists()) {
            const meditate = meditateDoc.data().count;
            console.log("Meditate total updated: ", meditate);
            setMeditate(meditate);
          } else {
            console.warn("Meditate document does not exist!");
            setMeditate(0);
          }
        });

        const unsubscribeMove = onSnapshot(moveRef, (moveDoc) => {
          if (moveDoc.exists()) {
            const move = moveDoc.data().count;
            console.log("Move total updated: ", move);
            setMove(move);
          } else {
            console.warn("Move document does not exist!");
            setMove(0);
          }
        });

        const unsubscribeMusic = onSnapshot(musicRef, (musicDoc) => {
          if (musicDoc.exists()) {
            const music = musicDoc.data().count;
            console.log("Music total updated: ", music);
            setMusic(music);
          } else {
            console.warn("Music document does not exist!");
            setMusic(0);
          }
        });

        const unsubscribeSleep = onSnapshot(sleepRef, (sleepDoc) => {
          if (sleepDoc.exists()) {
            const sleep = sleepDoc.data().count;
            console.log("Sleep total updated: ", sleep);
            setSleep(sleep);
          } else {
            console.warn("Sleep document does not exist!");
            setSleep(0);
          }
        });

        // Cleanup the listener when the component unmounts
        return () => unsubscribeMeditate();
        unsubscribeMove();
        unsubscribeMusic();
        unsubscribeSleep();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const circles = [
    { text: "happy", size: 160, value: 5 },
    { text: "calm", size: 140, value: 4 },
    { text: "anxious", size: 120, value: 3 },
    { text: "tired", size: 100, value: 2 },
    { text: "excited", size: 80, value: 1 },
  ];
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            globalStyles.container,
            globalStyles.spaceBetween,
            { flex: 1 },
          ]}
        >
          <Image
            source={require("../../assets/profile-topbanner.png")}
            style={[globalStyles.topbanner, { marginTop: -115 }]}
            resizeMode="contain"
          />
          <Image
            source={require("../../assets/Avatar.png")}
            style={{
              width: 120,
              height: 120,
              position: "absolute",
              top: 84,
              left: width / 2 - 60,
            }}
          ></Image>
          <View>
            <View
              style={[
                globalStyles.gap12,
                { marginTop: 200, alignItems: "center" },
              ]}
            >
              <Text style={globalStyles.h2}>{nickname}</Text>
              <Text style={globalStyles.p}>{memo}</Text>
            </View>
            <View style={styles.whiteContainer}>
              <View style={globalStyles.gap4}>
                <Text style={globalStyles.h3}>Quest completed</Text>
                <Text style={globalStyles.p}>All the quest you completed</Text>
              </View>
              <View
                style={{
                  marginTop: 24,
                  gap: 8,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={[styles.questContainer]}>
                  <Text style={[globalStyles.p]}>Mediate</Text>
                  <Text style={[globalStyles.h2, { color: COLORS.darkOrange }]}>
                    {meditate}
                  </Text>
                </View>

                <View style={[styles.questContainer]}>
                  <Text style={globalStyles.p}>Move</Text>
                  <Text style={[globalStyles.h2, { color: COLORS.blue }]}>
                    {move}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  marginTop: 8,
                  gap: 8,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={[styles.questContainer]}>
                  <Text style={globalStyles.p}>Music</Text>
                  <Text style={[globalStyles.h2, { color: COLORS.pink }]}>
                    {music}
                  </Text>
                </View>

                <View style={[styles.questContainer]}>
                  <Text style={globalStyles.p}>Sleep</Text>
                  <Text style={[globalStyles.h2, { color: COLORS.green }]}>
                    {sleep}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.whiteContainer}>
              <View style={globalStyles.gap24}>
                <Text style={globalStyles.h3}>Top emotions</Text>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%", // Make sure parent has full width
                  }}
                >
                  <CircleArrangement
                    circles={circles}
                    selectedCircle={selectedCircle}
                    onSelect={handleSelect}
                  />
                </View>
                <View
                  style={{
                    backgroundColor: "#F7F8FA",
                    padding: 16,
                    borderRadius: 16,
                  }}
                >
                  <Text style={[globalStyles.pBold, {marginBottom: 16}]}>
                    Keywords recorded with  <Text style={{color: COLORS.green}}>______</Text>
                  </Text>
                  <Chip style={{backgroundColor: COLORS.white,alignSelf: "flex-start"}} textStyle={{ color: COLORS.blackSecondary }} >Tap on an emotion!</Chip>
                </View>
              </View>
            </View>
            <View style={styles.whiteContainer}>
              <View style={globalStyles.gap24}>
                <View style={globalStyles.gap4}>
                  <Text style={globalStyles.h3}>Recorded keywords</Text>
                  <Text style={globalStyles.p}>
                    See how each keyword affected you
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    // alignItems: "center",
                    width: "100%", // Make sure parent has full width
                  }}
                >
                  {" "}
                  <TreemapChart width={330} height={250} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  whiteContainer: {
    marginTop: 24,
    backgroundColor: COLORS.white,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  questContainer: {
    alignItems: "center",
    flex: 1, // Each child takes up equal width
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
  },
});
