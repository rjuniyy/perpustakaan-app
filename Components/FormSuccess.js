import { Text, StyleSheet, ActivityIndicator } from "react-native";
import React from "react";
import { Overlay } from "@rneui/themed";
import { FontAwesome5 } from "@expo/vector-icons";

const FormSuccess = (props) => {
  return props.successMessage ? (
    <Overlay
      overlayStyle={styles.Overlay}
      isVisible={true}
      onBackdropPress={() => props.close("")}
    >
      <FontAwesome5 name="check-circle" size={72} color="green" />
      <Text style={styles.Text}>{props.successMessage}</Text>
    </Overlay>
  ) : (
    <Overlay overlayStyle={styles.Overlay} isVisible={true}>
      <ActivityIndicator size={"large"} color={"green"} />
    </Overlay>
  );
};

export default FormSuccess;

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

// <Overlay
//   isVisible={true}
//   onBackdropPress={() => props.hideErrOverlay(false)}
//   overlayStyle={styles.Overlay}
// >
//   <FontAwesome name="check-circle" size={72} color="green" />
//   <Text style={styles.Text}>{props.err}</Text>
//   <TouchableOpacity
//     style={styles.Button}
//     onPress={() => props.hideErrOverlay(false)}
//   >
//     <Text style={styles.BtnText}>Kembali</Text>
//   </TouchableOpacity>
// </Overlay>
