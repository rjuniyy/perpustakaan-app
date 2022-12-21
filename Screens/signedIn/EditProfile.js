import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { getAuth, updateEmail, updateProfile } from "firebase/auth";
import uuid from "uuid";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { firebase } from "../../Firebase/firebase";
import moment from "moment";
import DateTimePickerAndroid from "@react-native-community/datetimepicker";

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

const EditProfile = ({ navigation, route }) => {
  const PLACEHOLDER_IMG =
    "https://firebasestorage.googleapis.com/v0/b/perpus-ea96f.appspot.com/o/imageCover%2F27002.jpg?alt=media&token=8e70ce4a-6a79-4587-804a-b7819a01bfbc";
  const [data, setData] = useState(route.params.data);
  const [nama, setNama] = useState(data.namaLengkap);
  const [avatar, setAvatar] = useState(data.avatarUrl);
  const [kelas, setKelas] = useState(data.kelas);
  const [noAnggota, setNoAnggota] = useState(data.noAnggota);
  const [email, setEmail] = useState(data.email);
  const [uploading, setUploading] = useState(false);
  const input = useInput(new Date());

  function update() {
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      displayName: nama,
      photoURL: avatar,
    })
      .then(() => {
        const auth = getAuth();
        updateEmail(auth.currentUser, email)
          .then(() => {
            alert("Email berhasil di update");
          })
          .catch((error) => {
            alert("Email gagal di update :(");
          });
      })
      .then(() => {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .update({
            avatarUrl: avatar,
            namaLengkap: nama,
            email: email,
            tglLahir: moment(input.date).format("DD-MMMM-YYYY"),
          });
        alert("Data berhasil di ubah.");
        navigation.navigate("Home");
      })
      .catch((error) => {
        console.log(error);
      });
  }
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
      _deleteOldImage();

      if (!pickerResult.canceled) {
        const uploadUrl = await uploadImageAsync(pickerResult.uri);
        setAvatar(uploadUrl);
      }
    } catch (e) {
      console.log(e);
      alert("Upload gagal! :(");
    } finally {
      setUploading(false);
    }
  };

  async function _deleteOldImage() {
    const storage = getStorage();
    const docRef = ref(storage, avatar);
    deleteObject(docRef);
    // .then(() => {})
    // .catch((err) => {});
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
    const docRef = ref(storage, "avatar");

    const fileRef = ref(docRef, uuid.v4());
    const result = await uploadBytes(fileRef, blob);

    // We're done with the blob, close and release it
    blob.close();

    return await getDownloadURL(fileRef);
  }
  return (
    <View style={styles.mainView}>
      <View style={styles.formContainer}>
        <View style={styles.avatarView}>
          <TouchableOpacity onPress={_pickImage}>
            <Image
              style={styles.avatar}
              source={{ uri: avatar ? avatar : PLACEHOLDER_IMG }}
            ></Image>
          </TouchableOpacity>
        </View>
        <TextInput style={styles.hideInput} value={avatar} />
        <TextInput
          mode="outlined"
          label={"Nama Lengkap"}
          activeOutlineColor="green"
          onChangeText={(val) => setNama(val)}
          defaultValue={nama}
        />
        <TextInput
          mode="outlined"
          label="E-mail"
          activeOutlineColor="green"
          onChangeText={(val) => setEmail(val)}
          defaultValue={email}
        />
        <TextInput
          mode="outlined"
          label="Kelas"
          activeOutlineColor="green"
          onChangeText={(val) => setKelas(val)}
          defaultValue={kelas}
        />
        <TouchableOpacity onPress={input.showDatepicker}>
          <TextInput
            mode="outlined"
            label={"Tanggal Lahir*"}
            editable={false}
            value={moment(input.date).format("DD-MMMM-YYYY")}
          />
          {input.show && (
            <DateTimePickerAndroid
              testID="dateTimePicker"
              value={input.date}
              mode={input.mode}
              is24Hour={true}
              display="default"
              onChange={input.onChange}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={update}>
          <Text style={styles.buttonText}>Simpan Perubahan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditProfile;

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
    backgroundColor: "green",
    alignItems: "center",
    paddingVertical: 13,
    borderRadius: 20,
    marginTop: 20,
    shadowColor: "green",
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
  avatarView: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
  },
});
