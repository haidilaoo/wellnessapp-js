import { StyleSheet, Text } from "react-native";
import React, { useEffect, useState } from "react";
import Svg, { Rect, Text as SvgText } from "react-native-svg";
import { treemap, hierarchy } from "d3-hierarchy";
import { scaleOrdinal } from "d3-scale";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getAuth } from "firebase/auth";
// Manually define colors
const colors = [
  "#7c4dff",
  "#2979ff",
  "#3d5afe",
  "#6200ea",
  "#3f51b5",
  "#2962ff",
  "#2196f3",
  "#00838f",
  "#bcbd22",
  "#17becf",
];

const sampleData = {
  name: "root",
  children: 
[    { name: "People", value: 14 },
    { name: "Workplace", value: 4 },
    { name: "No Reason", value: 4 },
    // { name: "Sleep", value: 1 },
    { name: "Studying", value: 1 },
    { name: "Overtime", value: 1 },
    { name: "Payday", value: 1 },
  ]
  ,
};

const TreemapChart = ({ width = 300, height = 200 }) => {
  const userUid = getAuth().currentUser.uid;
  const [topReasons, setTopReasons] = useState([]);
//Data
const treeData = topReasons.map((reason) => {
 //account for if less than 6 reasons recorded
  if (reason.id === "N/A") {
    return {
      name: "",
      value: 0,
    };
  }

  return {  // Return the object properly
    name: reason.id,
    value: reason.count,
  };
});


const data = {
  name: "root",
  children: treeData,
}

useEffect(() => {
  const fetchTopReasons = async () => {
    try {
      const reasonRef = collection(db, "users", userUid, "reason_tally");
      const q = query(reasonRef, orderBy("count", "desc"), limit(6));
      const querySnapshot = await getDocs(q);

      let reasons = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        // ...doc.data(), //fetch all data
        count: doc.data().count,
      }));

      while (reasons.length < 5) {
        reasons.push({ id: "N/A", count: 0 });
      }

      setTopReasons(reasons);
      console.log("Top 6 reasons: ", reasons);
    } catch (error) {
      console.error("Error fetching top reasons:", error);
    }
  };

  if (userUid) {
    fetchTopReasons();
  }
}, [db, userUid]); // Runs when db or userUid changes
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
            // width={Math.max(leaf.x1 - leaf.x0, 50)}  // Ensure minimum width of 50
            height={leaf.y1 - leaf.y0}
            // height={Math.max(leaf.y1 - leaf.y0, 50)}
            fill={colorScale(index)}
            stroke="white"
            rx={8} // Horizontal radius for rounded corners
            ry={8} // Vertical radius for rounded corners
          />
          {/* Text Label */}
          <SvgText
            x={(leaf.x0 + leaf.x1) / 2} // Horizontal center
            y={(leaf.y0 + leaf.y1) / 2} // Vertical center
            fontSize="12"
            fill="white"
            // dy="8" // Add vertical padding
            // dx="8"// Add horizontal padding
            textAnchor="middle" // Horizontally center the text
            dominantBaseline="middle" // Vertically center the text
          >
            {leaf.data.name}
          </SvgText>
          <SvgText
            x={(leaf.x0 + leaf.x1) / 2} // Horizontal center
            y={((leaf.y0 + leaf.y1) / 2) + 16} // Vertical center
            fontSize="12"
            fill="white"
            // dy="8" // Add vertical padding
            // dx="8"// Add horizontal padding
            textAnchor="middle" // Horizontally center the text
            dominantBaseline="middle" // Vertically center the text
            opacity={0.65}
          >
            {leaf.data.value}
          </SvgText>
        </React.Fragment>
      ))}
    </Svg>
  );
};

export default TreemapChart;

const styles = StyleSheet.create({});
