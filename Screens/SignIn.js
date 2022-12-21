import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import FormError from "../Components/FormError";
import FormSuccess from "../Components/FormSuccess";
import { firebase } from "../Firebase/firebase";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState();
  const [errMessage, setErrMessage] = useState("");
  const [displayFormError, setDisplayFormError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function navigate() {
    navigation.navigate("signUp");
  }

  const validateInput = () => {
    var form_inputs = [email, password];
    if (form_inputs.includes("") || form_inputs.includes(undefined)) {
      setErrMessage("Login gagal, mohon isi semua baris");
      return setDisplayFormError(true);
    }
    setIsLoading(true);

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const uid = auth().user.uid;
        const email = auth().user.email;
        setIsLoading(false);
      })
      .catch((err) => {
        setErrMessage(err.errMessage);
        console.log(err.errMessage);
        return setDisplayFormError(true);
      });
    // firebase
    //   .auth()
    //   .signInWithEmailAndPassword(email, password)
    //   .then(() => {
    //     setIsLoading(false);
    //   })
    //   .catch((err) => {
    //     setErrMessage(err.errMessage);
    //     return setDisplayFormError(true);
    //   });
  };

  return (
    <View style={styles.mainView}>
      <Image style={styles.ImageStyle} source={require("../assets/logo.png")} />

      <View style={styles.FormView}>
        <Ionicons name="mail-outline" size={30} style={styles.icon}></Ionicons>
        <TextInput
          style={styles.TextInput}
          placeholder="E-mail"
          value={email}
          onChangeText={(val) => setEmail(val)}
        />
      </View>
      <View style={styles.FormView}>
        <Ionicons
          name="lock-closed-outline"
          size={30}
          style={styles.icon}
        ></Ionicons>
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={(val) => setPassword(val)}
        />
      </View>
      <TouchableOpacity style={styles.Button} onPress={validateInput}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("lupaPassword")}>
        <Text style={styles.btnLupa}>Lupa password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigate}>
        <Text style={{ marginTop: 10 }}>
          Belum memiliki akun?{" "}
          <Text style={styles.btnDaftar}>Daftar disini</Text>
        </Text>
      </TouchableOpacity>
      {displayFormError == true ? (
        <FormError hideErrOverlay={setDisplayFormError} err={errMessage} />
      ) : null}
      {isLoading == true ? <FormSuccess /> : null}
    </View>
  );
};

export default SignIn;

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
