import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import moment from "moment";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
import { firebase } from "../Firebase/firebase";
import FormError from "../Components/FormError";
import { FontAwesome5 } from "@expo/vector-icons";
import FormSuccess from "../Components/FormSuccess";
import { getAuth, sendEmailVerification } from "firebase/auth";
import DateTimePickerAndroid from "@react-native-community/datetimepicker";
import { TextInput } from "react-native-paper";

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
  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [tglLahir, setTglLahir] = useState();
  const [kelas, setKelas] = useState();
  const [password, setPassword] = useState();
  const [konPassword, setKonPassword] = useState();
  const [displayFormError, setDisplayFormError] = useState(false);
  const input = useInput(new Date());

  const [errMessage, setErrMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function createUser() {
    setIsLoading(true);
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        setIsLoading(false);
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
            tglLahir: moment(input.date).format("DD-MMMM-YYYY"),
          });
      })
      .then(() => {
        const auth = getAuth();
        sendEmailVerification(auth.currentUser).then(() => {
          alert("Email verified has been sent");
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

    var password_match = password == konPassword;

    // if (form_inputs.includes("") || form_inputs.includes(undefined)) {
    //   setErrMessage("Daftar akun gagal, mohon isi semua baris");
    //   return setDisplayFormError(true);
    // }

    if (!password_match) {
      setErrMessage("Password tidak cocok");
      return setDisplayFormError(true);
    }

    if (password_match) createUser();
  };

  //DateTimePicker
  // const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  // const showDatePicker = () => {
  //   setDatePickerVisibility(true);
  // };
  // const hideDatePicker = () => {
  //   setDatePickerVisibility(false);
  // };
  // const handleConfirm = (date) => {
  //   // console.warn("A date has been picked: ", date);
  //   setDate(date);
  //   const tgl = moment(date).format("DD-MM-YYYY");
  //   setTglLahir(tgl);
  //   hideDatePicker();
  // };

  // const getDate = () => {
  //   let tempDate = date.toString().split(" ");
  //   return date !== ""
  //     ? `${tempDate[0]} ${tempDate[1]} ${tempDate[2]} ${tempDate[3]}`
  //     : "";
  // };

  //   registerUser = async (email, password, fullName, kelas, tglLahir) => {
  //     await firebase
  //       .auth()
  //       .createUserWithEmailAndPassword(email, password)
  //       .then(() => {
  //         firebase
  //           .auth()
  //           .currentUser.sendEmailVerification({
  //             handleCodeInApp: true,
  //             url: "https://perpus-ea96f.firebaseapp.com",
  //           })
  //           .then(() => {
  //             alert("Please activate your e-mail");
  //             const user = userCredential.user;
  //             console.log(user);
  //           })
  //           .catch((error) => {
  //             alert(error.message);
  //           })
  //           .then(() => {
  //             firebase
  //               .firestore()
  //               .collection("users")
  //               .doc(firebase.auth().currentUser.uid)
  //               .set({
  //                 email,
  //                 fullName,
  //                 kelas,
  //                 tglLahir,
  //               });
  //           })
  //           .catch((error) => {
  //             alert(error.message);
  //           });
  //       })
  //       .catch((error) => {
  //         alert(error.message);
  //       });
  //   };

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
      {/* <View style={styles.FormView}>
        <TextInput
          mode="outlined"
          label="Nama Lengkap"
          activeOutlineColor="green"
          onChangeText={(val) => setFullName(val)}
        />
      </View>
      <TouchableOpacity onPress={input.showDatepicker} style={styles.FormView}>
        <TextInput
          style={styles.TextInput}
          editable={false}
          placeholderText="Tanggal Lahir"
          value={input.date.toLocaleDateString()}
        />
        <View>
          <FontAwesome5
            name="calendar-alt"
            size={24}
            color="black"
            style={{ marginRight: 20 }}
          /> */}

      {/* </View>
      </TouchableOpacity>
      <View style={styles.FormView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Kelas*"
          onChangeText={(val) => setKelas(val)}
          value={kelas}
        />
      </View>
      <View style={styles.FormView}>
        <TextInput
          style={styles.TextInput}
          placeholder="E-mail*"
          keyboardType="email-address"
          onChangeText={(val) => setEmail(val)}
          value={email}
        />
      </View>
      <View style={styles.FormView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password*"
          secureTextEntry={true}
          value={password}
          onChangeText={(password) => setPassword(password)}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <View style={styles.FormView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Confirm Password*"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={(confirmPassword) =>
            setConfirmPassword(confirmPassword)
          }
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View> */}
      <TouchableOpacity style={styles.Button} onPress={validateForm}>
        <Text style={styles.btnText}>Daftar</Text>
      </TouchableOpacity>

      {displayFormError == true ? (
        <FormError hideErrOverlay={setDisplayFormError} err={errMessage} />
      ) : null}

      {isLoading == true ? (
        <FormSuccess />
      ) : successMessage == "Akun berhasil dibuat, silahkan login" ? (
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
