import React, { useEffect, useRef } from "react";
import {
  useWindowDimensions,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Pressable,
} from "react-native";
import Svg, { G, Circle, Text as SvgText } from "react-native-svg";
import { hierarchy, pack } from "d3-hierarchy";
import { scaleSqrt, scaleOrdinal } from "d3-scale";
import { COLORS } from "../globalStyles";
const colors = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
];

const BubbleChart = ({ data, onSelect, selectedBubble }) => {
  const { width: windowWidth } = useWindowDimensions();
  const size = windowWidth - 80;

  // 1. Define min/max radius in pixels
  const minRadius = 80;
  const maxRadius = 160;

  // 2. Create scale to convert value to radius
  const valueExtent = [
    Math.min(...data.map((d) => d.value)),
    Math.max(...data.map((d) => d.value)),
  ];

  const radiusScale = scaleSqrt()
    .domain(valueExtent)
    .range([minRadius, maxRadius]);

  // 3. Fake area based on radius so d3.pack() honors your desired sizes
  const transformedData = data.map((d) => ({
    ...d,
    fakeArea: Math.PI * Math.pow(radiusScale(d.value), 2),
  }));

  // 4. Create hierarchy with fake area as the .sum() value
  const root = hierarchy({ children: transformedData })
    .sum((d) => d.fakeArea)
    .sort((a, b) => b.value - a.value);

  const layout = pack().size([size, size]).padding(12)(root);

  const nodes = layout.leaves();
  // Sort to get the 2 smallest radii
  const sortedBySize = [...nodes].sort((a, b) => a.r - b.r);
  const smallestNodes = new Set(sortedBySize.slice(0, 2));

  let translateX = 0;
  let translateY = 0;
  let scale = 1;

  if (nodes.length === 1) {
    // Manually center the single bubble
    translateX = size / 2 - nodes[0].r;
    translateY = size / 2 - nodes[0].r;
  } else {
    // Multi-bubble: compute bounding box & scaling
    const minX = Math.min(...nodes.map((n) => n.x - n.r));
    const maxX = Math.max(...nodes.map((n) => n.x + n.r));
    const minY = Math.min(...nodes.map((n) => n.y - n.r));
    const maxY = Math.max(...nodes.map((n) => n.y + n.r));

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    const scaleX = size / contentWidth;
    const scaleY = size / contentHeight;
    scale = Math.min(scaleX, scaleY);

    const offsetX = -minX;
    const offsetY = -minY;

    translateX = (size - contentWidth * scale) / 2;
    translateY = (size - contentHeight * scale) / 2;

    // apply offset and scaling to each node
    nodes.forEach((node) => {
      node.x = (node.x + offsetX) * scale;
      node.y = (node.y + offsetY) * scale;
      node.r = node.r * scale;
    });
  }
  //   const colorScale = scaleOrdinal(colors);

  // Floating animations
  const animations = useRef(
    nodes.map(() => ({
      translateY: new Animated.Value(0),
      scale: new Animated.Value(1),
    }))
  ).current;

  useEffect(() => {
    const anims = animations.map((anim, i) => {
      const duration = 2000 + i * 200;

      return Animated.parallel([
        Animated.sequence([
          Animated.timing(anim.translateY, {
            toValue: -10,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(anim.translateY, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(anim.scale, {
            toValue: 1.05,
            duration: duration * 0.5,
            useNativeDriver: true,
          }),
          Animated.timing(anim.scale, {
            toValue: 1,
            duration: duration * 0.5,
            useNativeDriver: true,
          }),
        ]),
      ]);
    });

    Animated.loop(Animated.stagger(200, anims)).start();
  }, []);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {nodes.map((node, index) => {
        const isSelected =
          selectedBubble && selectedBubble.name === node.data.name;

        return (
          <Animated.View
            key={index}
            style={[
              styles.circle,
              {
                width: node.r * 2,
                height: node.r * 2,
                backgroundColor: isSelected ? COLORS.primary : COLORS.tertiary2,
                transform: [
                  {
                    translateX: new Animated.Value(
                      node.x - node.r + translateX
                    ),
                  },
                  {
                    translateY: Animated.add(
                      new Animated.Value(node.y - node.r + translateY),
                      animations[index].translateY
                    ),
                  },
                  { scale: animations[index].scale },
                ],
              },
            ]}
          >
            <Pressable
              onPress={() => onSelect(node.data)}
              style={[styles.circle, { width: "100%", height: "100%" }]}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.text,
                  node.data.name.length * 8 > node.r * 2 ? {fontSize: node.r /3 } :  smallestNodes.has(node)
                  ?  styles.smallText 
                  : null,
                  { color: isSelected ? COLORS.white : COLORS.primary, paddingHorizontal: 6, },
                ]}
              >
                {node.data.name}
              </Text>
              <Text
                style={[
                  styles.value,
                  smallestNodes.has(node) && styles.smallText,
                  { color: isSelected ? COLORS.white : COLORS.primary },
                ]}
              >
                {node.data.value}
              </Text>
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginHorizontal: 16,
  },
  circle: {
    position: "absolute",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: COLORS.primary,
    fontWeight: "500",
    fontFamily: "Inter-Regular",
    fontSize: 16,
    lineHeight: 16 * 1.4,
  },
  value: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 16 * 1.4,
  },
  smallText: {
    fontSize: 14,
    lineHeight: 14 * 1.4,
  },
});

export default BubbleChart;

//   return (
//     <Svg width={size} height={size}>
//       <G
//         transform={`
//           translate(${translateX}, ${translateY})
//           scale(${scale})
//           translate(${offsetX}, ${offsetY})
//         `}
//       >
//         {nodes.map((node, i) => (
//           <React.Fragment key={i}>
//             <Circle cx={node.x} cy={node.y} r={node.r} fill={colorScale(i)} />
//             <SvgText
//               x={node.x}
//               y={node.y - 3 }
//               textAnchor="middle"
//                fontSize={smallestRadii.has(node.r) ? 14 : 16}
//               fill="#fff"
//             >
//               {node.data.name}
//             </SvgText>
//             <SvgText
//               x={node.x}
//               y={smallestRadii.has(node.r) ? node.y + 16 : node.y + 20}
//               textAnchor="middle"
//                fontSize={smallestRadii.has(node.r) ? 14 : 16}
//               fill="#fff"
//             >
//               {node.data.value}
//             </SvgText>
//           </React.Fragment>
//         ))}
//       </G>
//     </Svg>
//   );
// };

// export default BubbleChart;
