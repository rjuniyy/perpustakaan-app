import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Overlay } from "@rneui/themed";
import { FontAwesome } from "@expo/vector-icons";

const FormError = (props) => {
  return (
    <Overlay
      isVisible={true}
      onBackdropPress={() => props.hideErrOverlay(false)}
      overlayStyle={styles.Overlay}
    >
      <FontAwesome name="exclamation-circle" size={72} color="red" />
      <Text style={styles.Text}>{props.err}</Text>
      <TouchableOpacity
        style={styles.Button}
        onPress={() => props.hideErrOverlay(false)}
      >
        <Text style={styles.BtnText}>Kembali</Text>
      </TouchableOpacity>
    </Overlay>
  );
};

export default FormError;

const styles = StyleSheet.create({
  Overlay: {
    width: "80%",
    height: 320,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  Text: {
    fontSize: 18,
    color: "red",
  },
  Button: {
    width: 280,
    color: "#808080",
    height: 50,
    borderRadius: 10,
    display: "flex",
    marginTop: 70,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#808080",
  },
  BtnText: {
    color: "#fff",
    fontSize: 18,
  },
});
