import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import ReadMore from "@fawazahmed/react-native-read-more";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Formik } from "formik";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from "uuid";
import * as ImagePicker from "expo-image-picker";
import { SelectList } from "react-native-dropdown-select-list";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../Firebase/firebase-config";

const DetailBukuAdmin = ({ navigation, route }) => {
  const [bukuData, setBukuData] = useState(route.params.data);
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(bukuData.gambar);
  const [selected, setSelected] = useState(bukuData.status);

  const data = [
    { key: "1", value: "Tersedia" },
    { key: "2", value: "Dipinjam" },
    { key: "3", value: "Proses Pinjam" },
  ];
  // const data = [
  //   { value: "Tersedia" },
  //   { value: "Dipinjanm" },
  //   { value: "Proses Pinjam" },
  // ];

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

      if (!pickerResult.cancelled) {
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

  // async function updateBuku() {
  //   const ref = collection(db, "buku");
  //   await updateDoc(ref, {
  //     judul: values.judul,
  //     pengarang: values.pengarang,
  //     penerbit: values.penerbit,
  //     gambar: values.gambar,
  //     halaman: values.halaman,
  //     isbn: values.isbn,
  //     tglTerbit: values.tglTerbit,
  //     deskripsi: values.deskripsi,
  //     // status: values.status,
  //     stok: values.stok,
  //     date: serverTimestamp(),
  //   });
  // }

  return (
    <ScrollView>
      <Formik
        enableReinitialize={true}
        initialValues={{
          judul: "",
          pengarang: "",
          penerbit: "",
          gambar: "",
          halaman: "",
          isbn: "",
          tglTerbit: "",
          deskripsi: "",
          stok: "",
        }}
        onSubmit={async (values, actions) => {
          const ref = collection(db, "buku");
          await updateDoc(ref, {
            judul: values.judul,
            pengarang: values.pengarang,
            penerbit: values.penerbit,
            gambar: values.gambar,
            halaman: values.halaman,
            isbn: values.isbn,
            tglTerbit: values.tglTerbit,
            deskripsi: values.deskripsi,
            status: values.status,
            stok: values.stok,
            date: serverTimestamp(),
          });
          alert("Buku berhasil di perbarui");
        }}
      >
        {({ handleChange, handleSubmit, values, errors, isValid }) => (
          <View style={styles.mainView}>
            <View style={styles.imgView}>
              <TouchableOpacity onPress={_pickImage}>
                <Image style={styles.img} source={{ uri: image }}></Image>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.textjudul}
              value={values.judul}
              defaultValue={bukuData.judul}
              onChangeText={handleChange("judul")}
            />

            <View style={styles.detailView}>
              <View style={{ width: "50%" }}>
                <TextInput
                  defaultValue={bukuData.pengarang}
                  // value={values.pengarang}
                  onChangeText={handleChange("pengarang")}
                ></TextInput>
                <Text style={styles.txtsubDetail}>Stok</Text>
                <TextInput defaultValue={bukuData.stok} />
              </View>
              <View style={{ width: "50%", alignItems: "flex-end" }}>
                <SelectList
                  setSelected={setSelected}
                  data={data}
                  save=""
                  search={false}
                  placeholder={bukuData.status}
                  maxHeight={130}
                />
              </View>
            </View>
            <View style={styles.hairline} />
            <View style={styles.subView}>
              <Text style={styles.txtsubTitle}>Deskripsi Buku</Text>
              <TextInput
                defaultValue={bukuData.detail}
                multiline
                // value={values.detail}
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
              <TouchableOpacity
                style={styles.Button}
                key={bukuData}
                onPress={() => {
                  handleSubmit;
                  {
                    data: bukuData;
                  }
                }}
              >
                <Text style={styles.btnText}>Ubah Buku</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnHapus}>
                <Text style={styles.btnText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
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
