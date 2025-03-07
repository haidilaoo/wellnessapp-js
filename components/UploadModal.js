import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { COLORS, globalStyles } from "../globalStyles";
import { Modal, Portal } from "react-native-paper";
import Button from "./Button";
import Icon from "react-native-vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";

export default function UploadModal({
  visible,
  hideModal,
  onCameraPress,
  onGalleryPress,
  onRemovePress,
}) {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={{
          alignSelf: "center",
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.background,
            paddingHorizontal: 48,
            paddingVertical: 36,
            borderRadius: 16,
            width: 340,
            gap: 24,
          }}
        >
          <Text style={[globalStyles.h3, { textAlign: "center" }]}>
            Change Profile photo
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              justifyContent: "space-between",
              flexGrow: 1,
            }}
          >
            <Pressable
              style={{
                padding: 16,
                backgroundColor: COLORS.white,
                borderRadius: 16,
                alignSelf: "flex-start",
                alignItems: "center",
                flex: 1,
                gap: 8,
              }}
              onPress={onCameraPress}
            >
              <Icon name="camera" size={24} color={COLORS.orange}></Icon>
              <Text>Camera</Text>
            </Pressable>
            <Pressable
              style={{
                padding: 16,
                backgroundColor: COLORS.white,
                borderRadius: 16,
                alignSelf: "flex-start",
                alignItems: "center",
                flex: 1,
                gap: 8,
              }}
              onPress={onGalleryPress}
            >
              <Icon name="image" size={24} color={COLORS.orange}></Icon>
              <Text>Gallery</Text>
            </Pressable>
          </View>
          <Pressable onPress={onRemovePress}>
            <Text style={[globalStyles.pMedium, { color: COLORS.orange, textAlign: 'center' }]}>
              Use default image
            </Text>
          </Pressable>
          <View>
            <Button title="Cancel" variant="secondary" onPress={hideModal} />
          </View>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({});
