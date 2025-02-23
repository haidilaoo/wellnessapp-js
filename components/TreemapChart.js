import { StyleSheet, Text } from 'react-native'
import React from 'react'
import Svg, { Rect, Text as SvgText } from "react-native-svg";
import { treemap, hierarchy } from "d3-hierarchy";
import { scaleOrdinal } from "d3-scale";
// Manually define colors
const colors = [
  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
  "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"
];
// Sample data
const data = {
    name: "root",
    children: [
      { name: "People", value: 14 },
      { name: "Workplace", value: 4 },
      { name: "No Reason", value: 4 },
      { name: "Sleep", value: 3 },
      { name: "Studying", value: 3 },
      { name: "Overtime", value: 1 },
      { name: "Payday", value: 1 },
    ],
  };

  const TreemapChart = ({ width = 300, height = 200 }) => {
    // Convert data into a hierarchical structure
    const root = hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);
  
    // Generate treemap layout
    treemap().size([width, height]).padding(2)(root);
  
    // Color scale for categories
    const colorScale = scaleOrdinal(colors);
  return (
    <Svg width={width} height={height}>
    {root.leaves().map((leaf, index) => (
      <React.Fragment key={index}>
        {/* Rectangle */}
        <Rect
          x={leaf.x0}
          y={leaf.y0}
          width={leaf.x1 - leaf.x0}
          height={leaf.y1 - leaf.y0}
          fill={colorScale(index)}
          stroke="white"
        />
        {/* Text Label */}
        <SvgText
          x={leaf.x0 + 5}
          y={leaf.y0 + 15}
          fontSize="10"
          fill="white"
        >
          {leaf.data.name}
        </SvgText>
      </React.Fragment>
    ))}
  </Svg>
  )
}

export default TreemapChart

const styles = StyleSheet.create({})