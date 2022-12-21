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
import {
  collection,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../../../Firebase/firebase-config";
import Confirm from "../../../Components/Confirm";
import { SelectList } from "react-native-dropdown-select-list";

const Konfirmasi = ({ navigation, route }) => {
  const [bukuData, setBukuData] = useState(route.params.data);
  const [uid, setUid] = useState(bukuData.uid);
  const [isModalVisible, setModalVisible] = useState(false);
  const userID = bukuData.uid;
  const [selected, setSelected] = useState("");

  const data = [
    { key: "1", value: "Proses Pinjam" },
    { key: "2", value: "Dipinjam" },
    { key: "3", value: "Arsipkan" },
  ];

  async function deleteBuku() {
    const docRef = doc(db, "users", userID, "pinjamBuku", bukuData.id);
    deleteDoc(docRef);
    navigation.goBack();
  }

  function arsipBuku() {
    const docRef = collection(db, "arsipBuku");
    addDoc(docRef, {
      judul: bukuData.judul,
      pengarang: bukuData.pengarang,
      deskripsi: bukuData.deskripsi,
      gambar: bukuData.gambar,
      halaman: bukuData.halaman,
      isbn: bukuData.isbn,
      penerbit: bukuData.penerbit,
      status: bukuData.status,
      tglTerbit: bukuData.tglTerbit,
      tglPinjam: bukuData.tglPinjam,
      tglKembali: bukuData.tglKembali,
      peminjam: bukuData.peminjam,
      parentId: bukuData.id,
    });
    deleteBuku();
  }

  async function updateBuku() {
    const docRef = doc(db, "users", userID, "pinjamBuku", bukuData.id);
    updateDoc(docRef, {
      status: selected,
    });
    alert("Berhasil");
  }
  function handleDelete() {
    setModalVisible(true);
  }
  return (
    <View style={styles.mainView}>
      <View style={styles.imgView}>
        <Image style={styles.img} source={{ uri: bukuData.gambar }}></Image>
        <View>
          <Text style={styles.textjudul}>{bukuData.judul}</Text>
        </View>
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
            <Text style={styles.txtpengarang}>Peminjam:</Text>
          </View>
          <View style={{ width: "50%", alignItems: "flex-end" }}>
            <SelectList
              setSelected={setSelected}
              data={data}
              save="value"
              search={false}
              placeholder={bukuData.status}
              maxHeight={130}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate("cekUser", { data: uid })}
            >
              <Text style={{ color: "blue" }}>{bukuData.peminjam}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.hairline} />
        <View style={{ alignSelf: "flex-start" }}>
          <Text>Tanggal Pinjam: {bukuData.tglPinjam}</Text>
          <Text>Tanggal Kembali: {bukuData.tglKembali}</Text>
        </View>
        <TouchableOpacity style={styles.Button} onPress={handleDelete}>
          <Text style={styles.btnText}>Hapus</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnApprove} onPress={updateBuku}>
          <Text style={styles.btnText}>Approve</Text>
        </TouchableOpacity>
        {isModalVisible == true ? (
          <Confirm hideErrOverlay={setModalVisible} onPress={arsipBuku} />
        ) : null}
      </View>
    </View>
  );
};

export default Konfirmasi;

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
    alignItems: "center",
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
  btnApprove: {
    backgroundColor: "green",
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
