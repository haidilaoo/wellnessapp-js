import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from "react-native";
import { WebView } from "react-native-webview";

const CLIENT_ID = "d8438524bdf04551856b11a71a268074";
const CLIENT_SECRET = "345e6e31195e40bda52f5a6cfa71cfbf";

const SpotifyMoodPlaylists = ({ mood }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Basic ${btoa(CLIENT_ID + ":" + CLIENT_SECRET)}` },
          body: "grant_type=client_credentials",
        });

        const data = await response.json();
        setAccessToken(data.access_token);
      } catch (error) {
        console.error("Error fetching Spotify token:", error);
      }
    };

    fetchAccessToken();
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const moodCategories = { calm: "lofi", happy: "happy", sad: "sad", focus: "focus" };
    const category = moodCategories[mood] || "chill";

    const fetchPlaylists = async () => {
      try {
        const response = await fetch("https://api.spotify.com/v1/browse/categories", {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("Full Categories Data:", data); // Debugging full response
          
              if (data.categories && data.categories.items) {
                const categoryIds = data.categories.items.map((category) => category.id);
                console.log("Available Category IDs:", categoryIds);
              } else {
                console.error("No categories found:", data);
              }
            })
            .catch((err) => console.error("Error fetching categories:", err));
            fetch("https://api.spotify.com/v1/browse/categories/chill/playlists", {
                headers: { Authorization: `Bearer ${accessToken}` },
              })
                .then((res) => res.json())
                .then((data) => console.log("Playlists:", data))
                .catch((err) => console.error("Error fetching playlists:", err));
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };

    fetchPlaylists();
  }, [accessToken, mood]);

  return (
    <View style={styles.container}>
      {!selectedPlaylist ? (
        <>
          <Text style={styles.title}>Playlists for {mood} Mood</Text>
          <FlatList
            data={playlists}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setSelectedPlaylist(item.id)} style={styles.playlistItem}>
                <Image source={{ uri: item.images[0].url }} style={styles.playlistImage} />
                <Text style={styles.playlistText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      ) : (
        <WebView source={{ uri: `https://open.spotify.com/embed/playlist/${selectedPlaylist}` }} style={{ height: 400, width: "100%" }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 10 },
  title: { color: "white", fontSize: 24, marginBottom: 10, textAlign: "center" },
  playlistItem: { flexDirection: "row", alignItems: "center", padding: 10, borderBottomColor: "#333", borderBottomWidth: 1 },
  playlistImage: { width: 50, height: 50, borderRadius: 5, marginRight: 10 },
  playlistText: { color: "white", fontSize: 16 },
});

export default SpotifyMoodPlaylists;
