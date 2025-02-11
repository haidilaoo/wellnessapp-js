import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { COLORS, globalStyles } from '../globalStyles';

const QuestButton = ({title, imageSource, category}) => {
  return (
     <View style={styles.questContainer}>
                <View
                  style={[
                    { flexDirection: "row", justifyContent: "space-between" },
                  ]}
                >
                  <View style={globalStyles.gap4}>
                    <Text style={globalStyles.pBold}>{title}</Text>
                    <Text style={globalStyles.p}>{category}</Text>
                  </View>
                  <Image
                    source={require("../assets/tick-btn.png")}
                    style={{ width: 46, aspectRatio: 1 }}
                  ></Image>
                </View>
              </View>
  )
}

const styles = StyleSheet.create({
  
    questContainer: {
      backgroundColor: COLORS.white,
      paddingHorizontal: 16,
      paddingVertical: 24,
      borderRadius: 16,
      borderColor: COLORS.borderDefault,
      borderWidth: 1,
    },
  });
  

export default QuestButton