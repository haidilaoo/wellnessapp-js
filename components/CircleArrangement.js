import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { COLORS } from '../globalStyles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CircleArrangement = ({ circles }) => {
  const animations = useRef(
    circles.map(() => ({
      translateY: new Animated.Value(0),
      scale: new Animated.Value(1)
    }))
  ).current;

  useEffect(() => {
    const floatingAnimations = animations.map((anim, index) => {
      const duration = 2000 + (index * 200);
      
      return Animated.parallel([
        Animated.sequence([
          Animated.timing(anim.translateY, {
            toValue: -15,
            duration: duration,
            useNativeDriver: true
          }),
          Animated.timing(anim.translateY, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true
          })
        ]),
        Animated.sequence([
          Animated.timing(anim.scale, {
            toValue: 1.05,
            duration: duration * 0.5,
            useNativeDriver: true
          }),
          Animated.timing(anim.scale, {
            toValue: 1,
            duration: duration * 0.5,
            useNativeDriver: true
          })
        ])
      ]);
    });

    const loopedAnimation = Animated.loop(
      Animated.stagger(200, floatingAnimations)
    );

    loopedAnimation.start();

    return () => loopedAnimation.stop();
  }, []);

  const arrangeCircles = (circleData) => {
    const padding = 8;
    let positions = [];
    let currentX = 0;
    let currentY = 0;
    let rowHeight = 0;
    let containerWidth = 0;
    
    const sortedCircles = [...circleData].sort((a, b) => b.size - a.size);
    
    sortedCircles.forEach((circle, index) => {
        const diameter = circle.size;
        
        if (index > 0 && currentX + diameter > SCREEN_WIDTH - 32) {
          currentX = 0;
          currentY += rowHeight + padding;
          rowHeight = 0;
        }
        
        positions.push({
          ...circle,
          x: currentX,
          y: currentY
        });
        
      currentX += diameter + padding;
      rowHeight = Math.max(rowHeight, diameter);
      containerWidth = Math.max(containerWidth, currentX);
    });
    return {
        positions,
        containerHeight: currentY + rowHeight,
        containerWidth
    };
  };

  const { positions, containerHeight, containerWidth } = arrangeCircles(circles);
  
  // Get the sizes of the two smallest circles
  const sortedSizes = [...positions].sort((a, b) => a.size - b.size);
  const smallestSizes = new Set([sortedSizes[0].size, sortedSizes[1].size]);

  return (
    <View style={[styles.container, { height: containerHeight, width: containerWidth }]}>
      {positions.map((circle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.circle,
            {
              width: circle.size,
              height: circle.size,
              backgroundColor: circle.color || COLORS.tertiary2,
              transform: [
                { translateX: circle.x },
                { translateY: Animated.add(circle.y, animations[index].translateY) },
                { scale: animations[index].scale }
              ],
            }
          ]}
        >
          <Text 
            style={[
              styles.text,
              smallestSizes.has(circle.size) && styles.smallText
            ]}
          >
            {circle.text}
          </Text>
          {circle.value && (
            <Text 
              style={[
                styles.value,
                smallestSizes.has(circle.size) && styles.smallText
              ]}
            >
              {circle.value}
            </Text>
          )}
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginHorizontal: 16,
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: COLORS.primary,
    fontWeight: '500',
    fontFamily: "Inter-Regular",
    fontSize: 16,
    lineHeight: 16 * 1.4,
  },
  value: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 16 * 1.4,
  },
  smallText: {
    fontSize: 14,
    lineHeight: 14 * 1.4,
  },
});

export default CircleArrangement;