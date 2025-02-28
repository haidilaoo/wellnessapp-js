import React, { useState } from "react";
import { Chip } from "react-native-paper";
import { COLORS, globalStyles } from "../globalStyles";

const TabChip = ({ label, onPress, isFocused,selected }) => {
    // const [selected, setSelected] = useState(false); //remove local state change as this will allow multistate select
    
    // If isFocused is true, force `selected` to be true to match the UI behavior
    const chipSelected = selected || isFocused;

    return (
        <Chip
        //   icon="information"
        selectedColor={chipSelected? COLORS.white : COLORS.primary }
        showSelectedOverlay={true}
        mode="outlined"
        selected={chipSelected}
        onPress={() =>{onPress();}}
        style={{
          backgroundColor: chipSelected ? COLORS.primary : "transparent", // ✅ Change fill color             
        //   borderWidth: selected ? 0 : 1, // Hide border when selected
          borderColor: chipSelected ? COLORS.primary: COLORS.secondary,
          borderRadius: 16,     
        }}
      >
        {label}
      </Chip>
    );
  };

  export default TabChip;