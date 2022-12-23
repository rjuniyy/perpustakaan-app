import moment from "moment";
import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import { firebase } from "../Firebase/firebase";
import FormError from "../Components/FormError";
import FormSuccess from "../Components/FormSuccess";
import { getAuth, sendEmailVerification } from "firebase/auth";
import DateTimePickerAndroid from "@react-native-community/datetimepicker";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

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

const SignUp = () => {
  const PLACEHOLDER_AVATAR =
    "https://firebasestorage.googleapis.com/v0/b/perpus-ea96f.appspot.com/o/avatar%2Fuser.png?alt=media&token=7a8d3cbf-a6a4-4c2b-a704-ecb673642ee1";
  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [tglLahir, setTglLahir] = useState();
  const [kelas, setKelas] = useState();
  const [password, setPassword] = useState();
  const [konPassword, setKonPassword] = useState();
  const [displayFormError, setDisplayFormError] = useState(false);
  const input = useInput(new Date());
  const avatar = PLACEHOLDER_AVATAR;

  const [errMessage, setErrMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState();
  const [isLoading, setIsLoading] = useState(false);

  function createUser() {
    setIsLoading(true);
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        setIsLoading(true);
        setSuccessMessage("Akun berhasil dibuat, silahkan login");
      })
      .catch((err) => {
        setIsLoading(false);
        setErrMessage(err.message);
        setDisplayFormError(true);
      })
      .then(() => {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .set({
            email,
            namaLengkap,
            kelas,
            uid: firebase.auth().currentUser.uid,
            tglLahir: moment(input.date).format("DD-MMMM-YYYY"),
            avatarUrl: avatar,
            noAnggota: "00000",
          });
      })
      .then(() => {
        const auth = getAuth();
        sendEmailVerification(auth.currentUser).then(() => {
          setIsLoading(false);
          setSuccessMessage("Email telah dikirim!");
        });
      });
  }

  const validateForm = () => {
    var form_inputs = [
      namaLengkap,
      email,
      kelas,
      tglLahir,
      password,
      konPassword,
    ];
    console.log(form_inputs);
    if (form_inputs.includes("")) {
      setErrMessage("Daftar gagal, mohon isi semua baris");
      return setDisplayFormError(true);
    }

    var password_match = password == konPassword;

    if (!password_match) {
      setErrMessage("Password tidak cocok");
      return setDisplayFormError(true);
    }

    if (password_match) createUser();
  };

  return (
    <View style={styles.mainView}>
      <Image style={styles.ImageStyle} source={require("../assets/logo.png")} />
      <View style={styles.FormView}>
        <TextInput
          mode="outlined"
          activeOutlineColor="green"
          activeUnderlineColor="red"
          label={"Nama Lengkap*"}
          value={namaLengkap}
          onChangeText={(val) => setNamaLengkap(val)}
        />

        <TextInput
          mode="outlined"
          activeOutlineColor="green"
          activeUnderlineColor="red"
          label={"Kelas*"}
          value={kelas}
          onChangeText={(val) => setKelas(val)}
        />
        <TextInput
          mode="outlined"
          activeOutlineColor="green"
          activeUnderlineColor="red"
          label={"E-mail*"}
          value={email}
          onChangeText={(val) => setEmail(val)}
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
        <TextInput
          mode="outlined"
          activeOutlineColor="green"
          activeUnderlineColor="red"
          secureTextEntry={true}
          label={"Password*"}
          value={password}
          onChangeText={(val) => setPassword(val)}
        />
        <TextInput
          mode="outlined"
          activeOutlineColor="green"
          activeUnderlineColor="red"
          secureTextEntry={true}
          label={"Konfirmasi Password*"}
          value={konPassword}
          onChangeText={(val) => setKonPassword(val)}
        />
      </View>

      <TouchableOpacity style={styles.Button} onPress={validateForm}>
        <Text style={styles.btnText}>Daftar</Text>
      </TouchableOpacity>
      {displayFormError == true ? (
        <FormError hideErrOverlay={setDisplayFormError} err={errMessage} />
      ) : null}

      {isLoading == true ? (
        <FormSuccess />
      ) : successMessage == "Email telah dikirim!" ? (
        <FormSuccess
          successMessage={successMessage}
          close={setSuccessMessage}
        />
      ) : null}
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  mainView: {
    marginTop: 40,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ImageStyle: {
    width: "80%",
    height: "30%",
    resizeMode: "contain",
  },
  FormView: {
    width: "85%",
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
  },
  btnText: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
  },
  btnLupa: {
    marginTop: 10,
    marginLeft: 200,
    color: "blue",
  },
  btnDaftar: {
    color: "blue",
  },
  icon: {
    margin: 5,
    height: 30,
    width: 30,
    resizeMode: "stretch",
    alignItems: "center",
  },
});
