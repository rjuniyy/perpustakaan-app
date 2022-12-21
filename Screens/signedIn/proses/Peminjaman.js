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
import DateTimePickerAndroid from "@react-native-community/datetimepicker";
import { FontAwesome5 } from "@expo/vector-icons";
import { collection, doc, addDoc } from "firebase/firestore";
import { db } from "../../../Firebase/firebase-config";
import { firebase } from "../../../Firebase/firebase";
import moment from "moment/moment";

function useInput() {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };
  const showDatepicker = () => {
    showMode("date");
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };
  return {
    date,
    showDatepicker,
    show,
    mode,
    onChange,
  };
}

const Peminjaman = ({ navigation, route }) => {
  const [bukuData, setBukuData] = useState(route.params.data);
  const input = useInput(new Date());
  const input2 = useInput(new Date());
  const userID = firebase.auth().currentUser.uid;
  const name = firebase.auth().currentUser.displayName;
  const [status, setStatus] = useState("Proses Pinjam");

  async function addPinjamBuku() {
    const docRef = doc(db, "users", userID);
    const colRef = collection(docRef, "pinjamBuku");
    addDoc(colRef, {
      judul: bukuData.judul,
      pengarang: bukuData.pengarang,
      deskripsi: bukuData.deskripsi,
      gambar: bukuData.gambar,
      halaman: bukuData.halaman,
      isbn: bukuData.isbn,
      penerbit: bukuData.penerbit,
      status: status,
      tglTerbit: bukuData.tglTerbit,
      tglPinjam: moment(input.date).format("DD-MM-YYYY"),
      tglKembali: moment(input2.date).format("DD-MM-YYYY"),
      uid: userID,
      peminjam: name,
      parentId: bukuData.id,
    });
    navigation.navigate("prosesTab");
  }

  return (
    <View style={styles.mainView}>
      <View style={styles.imgView}>
        <Image style={styles.img} source={{ uri: bukuData.gambar }} />
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
        <Text>Tanggal Pinjam</Text>
        <TouchableOpacity
          onPress={input.showDatepicker}
          style={styles.FormView}
        >
          {input.show && (
            <DateTimePickerAndroid
              testID="dateTimePicker1"
              value={input.date}
              mode={input.mode}
              is24Hour={true}
              display="default"
              onChange={input.onChange}
            />
          )}

          <TextInput
            style={styles.TextInput}
            editable={false}
            placeholder="Tanggal Pinjam"
            value={moment(input.date).format("DD-MM-YYYY")}
          />
          <View>
            <FontAwesome5
              name="calendar-alt"
              size={24}
              color="black"
              style={{ marginRight: 20 }}
            />
          </View>
        </TouchableOpacity>
        <Text>Tanggal Kembali</Text>
        <TouchableOpacity
          onPress={input2.showDatepicker}
          style={styles.FormView}
        >
          {input2.show && (
            <DateTimePickerAndroid
              testID="dateTimePicker2"
              value={input2.date}
              mode={input2.mode}
              is24Hour={true}
              display="default"
              onChange={input2.onChange}
            />
          )}
          <TextInput
            style={styles.TextInput}
            editable={false}
            placeholder="Tanggal Kembali"
            value={moment(input2.date).format("DD-MM-YYYY")}
            // value={input.date2}
          />
          <View>
            <FontAwesome5
              name="calendar-alt"
              size={24}
              color="black"
              style={{ marginRight: 20 }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Button} onPress={addPinjamBuku}>
          <Text style={styles.btnText}>Pinjam</Text>
        </TouchableOpacity>
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
    backgroundColor: "#808080",
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
