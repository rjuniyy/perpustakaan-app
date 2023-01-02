import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { Component } from "react";
import { Formik } from "formik";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from "uuid";
import * as Yup from "yup";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../Firebase/firebase-config";
import { TextInput, HelperText } from "react-native-paper";

const uploadBookSchema = Yup.object().shape({
  judul: Yup.string().required("Judul belum diisi"),
  pengarang: Yup.string().required("Pengarang belum diisi"),
  penerbit: Yup.string().required("Penerbit belum diisi"),
  halaman: Yup.string().required("Halaman belum diisi"),
  isbn: Yup.string().required("ISBN belum diisi"),
  tglTerbit: Yup.string().required("Tanggal Terbit belum diisi"),
  deskripsi: Yup.string().required("Deskripsi belum diisi"),
  stok: Yup.string().required("Stok belum diisi"),
  gambar: Yup.string().required("Gambar belum diupload"),
});

const PLACEHOLDER_IMG =
  "https://firebasestorage.googleapis.com/v0/b/perpus-ea96f.appspot.com/o/imageCover%2F27002.jpg?alt=media&token=8e70ce4a-6a79-4587-804a-b7819a01bfbc";
export default class AddBuku extends Component {
  state = {
    image: null,
    uploading: false,
  };

  render() {
    let { image } = this.state;

    return (
      <ScrollView style={styles.mainView}>
        <View style={styles.formContainer}>
          <Formik
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
            validationSchema={uploadBookSchema}
            onSubmit={async (values, actions) => {
              actions.resetForm();
              const ref = collection(db, "buku");
              await addDoc(ref, {
                judul: values.judul,
                pengarang: values.pengarang,
                penerbit: values.penerbit,
                gambar: values.gambar,
                halaman: values.halaman,
                isbn: values.isbn,
                tglTerbit: values.tglTerbit,
                deskripsi: values.deskripsi,
                status: "Tersedia",
                date: serverTimestamp(),
                stok: values.stok,
              });
              alert("Buku berhasil ditambahkan");
              image = PLACEHOLDER_IMG;
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              isValid,
              touched,
            }) => (
              <View style={styles.card}>
                <TouchableOpacity onPress={this._pickImage}>
                  <Image
                    style={{ height: 100, width: 100, alignSelf: "center" }}
                    source={{ uri: image ? image : PLACEHOLDER_IMG }}
                  />
                  {errors.gambar && touched.gambar && (
                    <HelperText type="error">{errors.gambar}</HelperText>
                  )}
                </TouchableOpacity>
                <TextInput
                  mode="outlined"
                  label="Judul"
                  activeOutlineColor="green"
                  onChangeText={handleChange("judul")}
                  value={values.judul}
                />
                {errors.judul && touched.judul && (
                  <HelperText type="error">{errors.judul}</HelperText>
                )}
                <TextInput
                  mode="outlined"
                  label="Penerbit"
                  activeOutlineColor="green"
                  onChangeText={handleChange("penerbit")}
                  value={values.penerbit}
                />
                {errors.penerbit && touched.penerbit && (
                  <HelperText type="error">{errors.penerbit}</HelperText>
                )}
                <TextInput
                  mode="outlined"
                  label="Pengarang"
                  activeOutlineColor="green"
                  onChangeText={handleChange("pengarang")}
                  value={values.pengarang}
                />

                {errors.pengarang && touched.pengarang && (
                  <HelperText type="error">{errors.pengarang}</HelperText>
                )}

                <TextInput
                  mode="outlined"
                  label="Halaman"
                  activeOutlineColor="green"
                  onChangeText={handleChange("halaman")}
                  value={values.halaman}
                />

                {errors.halaman && touched.halaman && (
                  <HelperText type="error">{errors.halaman}</HelperText>
                )}
                <TextInput
                  mode="outlined"
                  label="ISBN"
                  activeOutlineColor="green"
                  onChangeText={handleChange("isbn")}
                  value={values.isbn}
                />

                {errors.isbn && touched.isbn && (
                  <HelperText type="error">{errors.isbn}</HelperText>
                )}
                <TextInput
                  mode="outlined"
                  label="Tanggal Terbit"
                  activeOutlineColor="green"
                  onChangeText={handleChange("tglTerbit")}
                  value={values.tglTerbit}
                />

                {errors.tglTerbit && touched.tglTerbit && (
                  <HelperText type="error">{errors.tglTerbit}</HelperText>
                )}
                <TextInput
                  mode="outlined"
                  label="Stok"
                  activeOutlineColor="green"
                  onChangeText={handleChange("stok")}
                  value={values.stok}
                />

                {errors.stok && touched.stok && (
                  <HelperText type="error">{errors.stok}</HelperText>
                )}
                <TextInput
                  mode="outlined"
                  label="Deskripsi"
                  activeOutlineColor="green"
                  onChangeText={handleChange("deskripsi")}
                  value={values.deskripsi}
                />

                {errors.deskripsi && touched.deskripsi && (
                  <HelperText type="error">{errors.deskripsi}</HelperText>
                )}
                <View style={{ width: 0, height: 0 }}>
                  <TextInput
                    name="gambar"
                    style={styles.hideInput}
                    onChangeText={handleChange("gambar")}
                    value={(values.gambar = image)}
                    onChange={(e) => gambar(e.nativeEvent.text)}
                  />
                </View>
                {/* <TextInput
                  name="halaman"
                  placeholder="Jumlah Halaman"
                  style={styles.textInput}
                  onChangeText={handleChange("halaman")}
                  onBlur={handleBlur("halaman")}
                  value={values.halaman}
                />
                <TextInput
                  name="tglterbit"
                  placeholder="Tanggal Terbit"
                  style={styles.textInput}
                  onChangeText={handleChange("tglterbit")}
                  onBlur={handleBlur("tglterbit")}
                  value={values.tglterbit}
                />
                <TextInput
                  name="stok"
                  placeholder="Stok"
                  style={styles.textInput}
                  onChangeText={handleChange("stok")}
                  onBlur={handleBlur("stok")}
                  value={values.stok}
                />
                <TextInput
                  name="penerbit"
                  placeholder="Penerbit"
                  style={styles.textInput}
                  onChangeText={handleChange("penerbit")}
                  onBlur={handleBlur("penerbit")}
                  value={values.penerbit}
                /> */}

                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                  <Text style={styles.buttonText}>Tambahkan</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    );
  }
  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });

    console.log({ pickerResult });

    this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async (pickerResult) => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        const uploadUrl = await uploadImageAsync(pickerResult.uri);
        this.setState({ image: uploadUrl });
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    } finally {
      this.setState({ uploading: false });
    }
  };
}

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

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    width: wp("100%"),
    height: hp("100%"),
    backgroundColor: "white",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
    width: "80%",
  },
  textInput: {
    height: 40,
    margin: 10,
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
  },
  hideInput: {
    width: 0,
    height: 0,
  },
  bodyContent: {
    borderBottomWidth: 1.5,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 30,
    shadowColor: "#c0c0c0",
    shadowOpacity: 0.9,
    shadowOffset: {
      height: 2,
      width: 2,
    },
    shadowRadius: 8,
    elevation: 6,
  },
  button: {
    backgroundColor: "#6a1b9a",
    alignItems: "center",
    paddingVertical: 13,
    borderRadius: 20,
    marginTop: 20,
    shadowColor: "#6a1b9a",
    shadowOpacity: 0.7,
    shadowOffset: {
      height: 4,
      width: 4,
    },
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    fontSize: 16,
    height: 20,
  },
});
