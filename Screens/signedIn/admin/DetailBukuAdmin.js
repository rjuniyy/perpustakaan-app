import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../Firebase/firebase-config";
import uuid from "uuid";
import { SelectList } from "react-native-dropdown-select-list";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Confirm from "../../../Components/Confirm";

const DetailBukuAdmin = ({ navigation, route }) => {
  // *Declare variabel
  const [bukuData, setBukuData] = useState(route?.params?.data || {});
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  //* Declare variabel untuk form input
  const [image, setImage] = useState(bukuData.gambar);
  const [selected, setSelected] = useState(bukuData.status);
  const [judul, setJudul] = useState(bukuData.judul);
  const [pengarang, setPengarang] = useState(bukuData.pengarang);
  const [penerbit, setPenerbit] = useState(bukuData.penerbit);
  const [stok, setStok] = useState(bukuData.stok);
  const [tglTerbit, setTglTerbit] = useState(bukuData.tglTerbit);
  const [isbn, setIsbn] = useState(bukuData.isbn);
  const [halaman, setHalaman] = useState(bukuData.halaman);
  const [deskripsi, setDeskripsi] = useState(bukuData.deskripsi);

  function handleDeleteBuku() {
    setModalVisible(true);
  }
  const deleteBuku = () => {
    const ref = doc(db, "buku", bukuData.id);
    deleteDoc(ref);
    navigation.goBack();
  };

  async function updateBuku() {
    const ref = doc(db, "buku", bukuData.id);
    await updateDoc(ref, {
      judul: judul,
      pengarang: pengarang,
      penerbit: penerbit,
      gambar: image,
      halaman: halaman,
      isbn: isbn,
      tglTerbit: tglTerbit,
      deskripsi: deskripsi,
      status: selected,
      stok: stok,
      date: serverTimestamp(),
    });
    alert("Buku berhasil diubah.");
  }

  const data = [
    { key: "1", value: "Tersedia" },
    { key: "2", value: "Dipinjam" },
    // { key: "3", value: "Proses Pinjam" },
  ];

  const _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });

    console.log({ pickerResult });

    _handleImagePicked(pickerResult);
  };
  const _handleImagePicked = async (pickerResult) => {
    try {
      setUploading(true);

      if (!pickerResult.canceled) {
        const uploadUrl = await uploadImageAsync(pickerResult.uri);
        setImage(uploadUrl);
      }
    } catch (e) {
      console.log(e);
      alert("Upload gagal! :(");
    } finally {
      setUploading(false);
    }
  };

  async function uploadImageAsync(uri) {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    const storage = getStorage();
    const docRef = ref(storage, "imageCover");

    const fileRef = ref(docRef, uuid.v4());
    const result = await uploadBytes(fileRef, blob);

    // We're done with the blob, close and release it
    blob.close();

    return await getDownloadURL(fileRef);
  }

  return (
    <ScrollView>
      <View style={styles.mainView}>
        <View style={styles.imgView}>
          <TouchableOpacity onPress={_pickImage}>
            <Image style={styles.img} source={{ uri: image }}></Image>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.textjudul}
          value={judul}
          defaultValue={bukuData.judul}
          onChangeText={(val) => setJudul(val)}
        />

        <View style={styles.detailView}>
          <View style={{ width: "50%" }}>
            <TextInput
              defaultValue={bukuData.pengarang}
              onChangeText={(val) => setPengarang(val)}
            ></TextInput>
            <Text style={styles.txtsubDetail}>Stok</Text>
            <TextInput
              defaultValue={bukuData.stok}
              onChangeText={(val) => setStok(val)}
            />
          </View>
          <View style={{ width: "50%", alignItems: "flex-end" }}>
            <SelectList
              setSelected={setSelected}
              data={data}
              save="value"
              search={false}
              placeholder={bukuData.status}
              maxHeight={100}
            />
          </View>
        </View>
        <View style={styles.hairline} />
        <View style={styles.subView}>
          <Text style={styles.txtsubTitle}>Deskripsi Buku</Text>
          <TextInput
            defaultValue={bukuData.deskripsi}
            multiline
            value={deskripsi}
          />
        </View>
        <View style={styles.hairline} />
        <View style={styles.subView}>
          <Text style={styles.txtsubTitle}>Detail Buku</Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap",
            padding: 10,
          }}
        >
          <View style={{ width: "50%" }}>
            <Text style={styles.txtsubDetail}>Jumlah Halaman</Text>
            <TextInput
              defaultValue={bukuData.halaman}
              // value={values.halaman}
            />
            <Text style={styles.txtsubDetail}>Tanggal Terbit</Text>
            <TextInput
              defaultValue={bukuData.tglTerbit}
              // value={values.tglTerbit}
            />
          </View>
          <View style={{ width: "50%" }}>
            <Text style={styles.txtsubDetail}>Penerbit</Text>
            <TextInput
              defaultValue={bukuData.penerbit}
              // value={values.penerbit}
            />
            <Text style={styles.txtsubDetail}>ISBN</Text>
            <TextInput
              defaultValue={bukuData.isbn}
              // value={values.isbn}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.Button}
          key={bukuData}
          onPress={updateBuku}
        >
          <Text style={styles.btnText}>Ubah Buku</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnHapus} onPress={handleDeleteBuku}>
          <Text style={styles.btnText}>Hapus</Text>
        </TouchableOpacity>
        {modalVisible == true ? (
          <Confirm hideErrOverlay={setModalVisible} onPress={deleteBuku} />
        ) : null}
      </View>
    </ScrollView>
  );
};

export default DetailBukuAdmin;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: "#F9F9F9",
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
    alignSelf: "center",
  },
  txtpengarang: {
    color: "grey",
  },
  txtsubTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  subView: {
    padding: 10,
  },
  txtsubDetail: {
    color: "grey",
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
    marginBottom: 10,
  },
  btnHapus: {
    backgroundColor: "red",
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
    marginBottom: 10,
  },
  btnText: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
  },
  detailView: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    padding: 10,
  },
});
