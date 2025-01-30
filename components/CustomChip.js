import React, { useState } from "react";
import { Chip } from "react-native-paper";
import { COLORS, globalStyles } from "../globalStyles";

const CustomChip = ({ label }) => {
    const [selected, setSelected] = useState(false);
  
    return (
        <Chip
        //   icon="information"
        selectedColor={selected? COLORS.white : COLORS.primary }
        showSelectedOverlay={true}
        mode="outlined"
        selected={selected}
        onPress={() => setSelected(!selected)}
        style={{
          backgroundColor: selected ? COLORS.primary : "transparent", // ✅ Change fill color             
        //   borderWidth: selected ? 0 : 1, // Hide border when selected
          borderColor: selected ? COLORS.primary: COLORS.secondary,
          borderRadius: 16,     
        }}
      >
        {label}
      </Chip>
    );
  };

  export default CustomChip;