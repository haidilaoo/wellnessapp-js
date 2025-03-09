import React, { useState, useRef, useEffect } from "react";
import { Animated, View, TouchableOpacity, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";

import TabChip from "./TabChip";

function TabBar({ state, descriptors, navigation, position }) {
  const { colors } = useTheme();
  const scrollViewRef = useRef(null); // Reference for ScrollView
  const [selectedTab, setSelectedTab] = useState(state.index); // Track selected tab
  const tabRefs = useRef([]); // Refs for each tab item
  if (!state || !state.routes) return null;
  
  useEffect(() => {
    if (scrollViewRef.current && tabRefs.current[state.index]) {
      tabRefs.current[state.index].measureLayout(
        scrollViewRef.current,
        (x) => {
      // Get the width of the focused tab and scroll it into view
      scrollViewRef.current.scrollTo({
        x: x - 50, // Adjust to center the selected tab (tweak if needed)
        animated: true,
      });
    }
  );
}
  }, [state.index]); // Scroll whenever selectedTab changes

  return (
    <View style={{ flexDirection: "row", backgroundColor: "#F5F6F6" }}>
      <ScrollView
       ref={scrollViewRef} 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1, // Allow it to expand with items
          marginHorizontal: 8
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key] || {};
          const label = options?.tabBarLabel || options?.title || route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            setSelectedTab(index); // Update selected tab when pressed
            console.log("Navigating to", route.name); // Debug to ensure correct route name
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              console.log("Navigating to", route.name); // Ensure navigation to correct screen
              navigation.navigate(route.name);
            }
          };

          const opacity = position
            ? position.interpolate({
                inputRange: state.routes.map((_, i) => i),
                outputRange: state.routes.map((i) => (i === index ? 1 : 0.5)),
              })
            : 1;

          return (
            <TouchableOpacity
              key={route.key}
              ref={(el) => (tabRefs.current[index] = el)} // Store ref for each tab
              onPress={onPress}
              style={{ flex: 1, alignItems: "center", paddingBottom: 16, marginHorizontal: 8 }}
            >
              <TabChip label={label} isFocused={isFocused} onPress={onPress} />
              {/* <Animated.Text style={{ opacity, color: isFocused ? colors.primary : colors.text }}>
              {label}
            </Animated.Text> */}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default TabBar;
