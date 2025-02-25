import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getAuth, signOut } from "firebase/auth";
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

export default function TherapistScreen() {

const auth = getAuth();

const logout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error) {
    console.error("Error logging out:", error.message);
  }
};

const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>Community Screen</Text>
      <Button onPress={ () => {logout(); navigation.reset({
          index: 0,
          routes: [{ name: 'AuthFlow' }],
        });}} title={'log out'}></Button>
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
