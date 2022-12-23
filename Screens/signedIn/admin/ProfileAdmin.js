import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { firebase } from "../../../Firebase/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../Firebase/firebase-config";
import { FontAwesome5 } from "@expo/vector-icons";

const ProfileAdmin = ({ navigation, route }) => {
  const [user, setUser] = useState([]);

  const signOut = () => {
    firebase.auth().signOut();
  };

  useEffect(() => {
    async function fetchUser() {
      const email = firebase.auth().currentUser.email;
      const q = query(collection(db, "users"), where("email", "==", email));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const user = [];
        querySnapshot.forEach((doc) => {
          const { namaLengkap, tglLahir, kelas, email, noAnggota, avatarUrl } =
            doc.data();
          user.push({
            namaLengkap,
            tglLahir,
            kelas,
            email,
            noAnggota,
            avatarUrl,
            id: doc.id,
          });
        });
        setUser(user);
      });
    }
    fetchUser();
  }, []);

  return (
    <View style={styles.mainView}>
      <FlatList
        data={user}
        keyExtractor={(item, index) => {
          return item.id;
        }}
        renderItem={({ item }) => (
          <View>
            <View style={styles.avatarView}>
              <Image
                style={styles.avatar}
                source={{ uri: item.avatarUrl }}
              ></Image>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("editProfile", { data: item })
                }
              >
                <Text style={styles.txtProfil}>Ubah Foto Profil</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.infoView}>
              <Text style={styles.infotxt}>Info Profil</Text>
              <View style={styles.mainCol}>
                <View style={styles.column1}>
                  <Text style={styles.txtCol1}>Nama Lengkap</Text>
                  <Text style={styles.txtCol1}>E-mail</Text>
                </View>
                <View style={styles.column2}>
                  <Text style={styles.txtCol2}>: {item.namaLengkap}</Text>
                  <Text style={styles.txtCol2}>: {item.email}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      ></FlatList>
      <View style={styles.btnsignOut}>
        <TouchableOpacity onPress={signOut}>
          <Text style={styles.signout}>
            Sign Out
            <FontAwesome5 name="sign-out-alt" size={24} color="red" />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileAdmin;

const styles = StyleSheet.create({
  mainView: {},
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
  infoView: {
    marginTop: 50,
    marginLeft: 60,
  },
  infotxt: {
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 30,
  },
  txt: {
    fontSize: 14,
    lineHeight: 30,
  },
  Button: {
    backgroundColor: "#808080",
    width: "80%",
    padding: 8,
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
  buttonView: {
    alignItems: "center",
    marginTop: 50,
  },
  btnsignOut: {
    alignItems: "flex-end",
    marginRight: 40,
    marginTop: 50,
  },
  signout: {
    fontSize: 18,
    color: "red",
  },
  txtProfil: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: "bold",
    color: "green",
  },
  mainCol: {
    // flex: 1,
    flexDirection: "row",
  },
  column1: {
    width: "35%",
  },
  column2: {
    width: "65%",
  },
  txtCol1: {
    fontSize: 15,
    lineHeight: 30,
    color: "#83888E",
  },
  txtCol2: {
    fontSize: 15,
    lineHeight: 30,
  },
});
