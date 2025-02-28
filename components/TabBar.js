import React, { useState } from 'react';
import { Animated, View, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';

import TabChip from './TabChip';

function TabBar({ state, descriptors, navigation, position }) {
  const { colors } = useTheme();
  const [selectedTab, setSelectedTab] = useState(state.index); // Track selected tab
  if (!state || !state.routes) return null;

  return (
    <View style={{ flexDirection: 'row', }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key] || {};
        const label = options?.tabBarLabel || options?.title || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          setSelectedTab(index); // Update selected tab when pressed
          console.log('Navigating to', route.name); // Debug to ensure correct route name
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            console.log('Navigating to', route.name); // Ensure navigation to correct screen
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
            onPress={onPress}
            style={{ flex: 1, alignItems: 'center', paddingBottom: 16 }}
          >
            <TabChip  label={label} isFocused={isFocused} onPress={onPress} />
            {/* <Animated.Text style={{ opacity, color: isFocused ? colors.primary : colors.text }}>
              {label}
            </Animated.Text> */}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default TabBar;
