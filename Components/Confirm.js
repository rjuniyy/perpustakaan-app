import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Overlay } from "@rneui/themed";
import { FontAwesome5 } from "@expo/vector-icons";

const Confirm = (props) => {
  return (
    <Overlay
      overlayStyle={styles.Overlay}
      isVisible={true}
      onBackdropPress={() => props.hideErrOverlay(false)}
    >
      <View style={{ alignItems: "center", padding: 20 }}>
        <FontAwesome5 name="question" size={72} color="red" />
      </View>
      <View style={{ marginTop: 20 }}>
        <Text>Apakah anda yakin ingin menghapus?</Text>
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: "row",
        }}
      >
        <View
          style={{ width: "50%", alignItems: "center", alignSelf: "center" }}
        >
          <TouchableOpacity
            style={styles.ButtonNo}
            onPress={() => props.hideErrOverlay(false)}
          >
            <Text style={styles.BtnText}>Tidak, Kembali.</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{ width: "50%", alignItems: "center", alignSelf: "center" }}
        >
          <TouchableOpacity
            style={styles.ButtonYes}
            onPress={() => props.onPress()}
          >
            <Text style={styles.BtnText}>Ya.</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Overlay>
  );
};

export default Confirm;

const styles = StyleSheet.create({
  Overlay: {
    display: "flex",
    width: "80%",
    height: 320,
    alignItems: "center",
  },
  Text: {
    fontSize: 18,
  },
  ButtonNo: {
    width: 100,
    color: "#808080",
    height: 50,
    borderRadius: 10,
    display: "flex",
    marginTop: 70,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#808080",
  },
  ButtonYes: {
    width: 100,
    color: "#808080",
    height: 50,
    borderRadius: 10,
    display: "flex",
    marginTop: 70,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
  },
  BtnText: {
    color: "#fff",
    fontSize: 18,
  },
});
