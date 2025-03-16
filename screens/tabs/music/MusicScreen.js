
import { Button, StyleSheet, Text, View, SafeAreaView} from 'react-native'
import React, { useState } from 'react'
import SpotifyMoodPlaylists from '../../../api/SpotifyMoodPlaylists';

export default function MusicScreen() {

    const [mood, setMood] = useState("calm");
  return (
    <SafeAreaView>
      <Text>MusicScreen</Text>
      <Button title="Show Mood Playlists" onPress={() => setMood("happy")} />
      <SpotifyMoodPlaylists mood={mood} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})
