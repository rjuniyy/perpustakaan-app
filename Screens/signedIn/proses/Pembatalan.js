import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  DocumentReference,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../Firebase/firebase-config";
import { firebase } from "../../../Firebase/firebase";
import moment from "moment/moment";

const Peminjaman = ({ navigation, route }) => {
  const [bukuData, setBukuData] = useState(route.params.data);
  const userID = firebase.auth().currentUser.uid;
  const [status, setStatus] = useState("Proses Pengembalian");

  async function delPinjamBuku() {
    const docRef = doc(db, "users", userID, "pinjamBuku", bukuData.id);
    deleteDoc(docRef);
    navigation.goBack();
  }

  return (
    <View style={styles.mainView}>
      <View style={styles.imgView}>
        <Image style={styles.img} source={{ uri: bukuData.gambar }}></Image>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "flex-start",
            padding: 10,
          }}
        >
          <View style={{ width: "50%" }}>
            <Text style={styles.txtpengarang}>{bukuData.pengarang}</Text>
          </View>
          <View style={{ width: "50%", alignItems: "flex-end" }}>
            <Text>Status: {bukuData.status}</Text>
          </View>
          <Text style={styles.textjudul}>{bukuData.judul}</Text>
        </View>
        <View style={styles.hairline} />
        <View style={{ alignSelf: "flex-start" }}>
          <Text>Tanggal Pinjam: {bukuData.tglPinjam}</Text>
          <Text>Tanggal Kembali: {bukuData.tglKembali}</Text>
        </View>
        {/* <TouchableOpacity style={styles.Button} onPress={delPinjamBuku}>
          <Text style={styles.btnText}>Kembalikan</Text>
        </TouchableOpacity> */}
        {bukuData.status == "Proses Pinjam" ? (
          <TouchableOpacity style={styles.Button} onPress={delPinjamBuku}>
            <Text style={styles.btnText}>Batalkan</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default Peminjaman;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imgView: {
    alignItems: "center",
    padding: 10,
  },
  img: {
    width: wp("95%"),
    height: hp("50%"),
    resizeMode: "contain",
  },
  hairline: {
    backgroundColor: "#A2A2A2",
    height: 2,
    width: wp("90%"),
    alignSelf: "center",
    borderRadius: 5,
  },
  textjudul: {
    fontSize: 18,
    fontWeight: "bold",
  },
  txtpengarang: {
    color: "grey",
  },
  TextInput: {
    marginLeft: 10,
    width: "80%",
    height: 40,
    borderColor: "#808080",
    borderRadius: 5,
    paddingLeft: 5,
    flex: 1,
  },
  FormView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: "#000",
    height: 40,
    borderRadius: 5,
    margin: 10,
    width: "85%",
  },
  Button: {
    backgroundColor: "#CD163F",
    marginTop: 30,
    width: "70%",
    padding: 7,
    borderRadius: 20,
    shadowOffset: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    alignSelf: "center",
  },
  btnText: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
  },
});
