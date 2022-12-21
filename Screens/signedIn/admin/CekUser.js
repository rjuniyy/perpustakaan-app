import { FlatList, StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../Firebase/firebase-config";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Divider } from "@rneui/base";

const CekUser = ({ route, navigation }) => {
  const [uid, setUid] = useState(route.params.data);
  const [user, setUser] = useState([]);

  useEffect(() => {
    async function getUser() {
      const q = query(collection(db, "users"), where("uid", "==", uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const user = [];
        querySnapshot.forEach((doc) => {
          const {
            uid,
            fullName,
            avatarUrl,
            kelas,
            noAnggota,
            email,
            tglLahir,
          } = doc.data();
          user.push({
            uid,
            fullName,
            avatarUrl,
            kelas,
            noAnggota,
            email,
            tglLahir,
          });
        });
        setUser(user);
      });
    }
    getUser();
  }, []);

  return (
    <View style={styles.mainView}>
      <FlatList
        style={{}}
        data={user}
        renderItem={({ item }) => (
          <View>
            <View style={styles.avatarView}>
              <Image
                style={styles.avatar}
                source={{ uri: item.avatarUrl }}
              ></Image>
            </View>
            <View style={{ marginTop: 50, marginHorizontal: 20 }}>
              <Divider width={2} />
            </View>
            <View style={styles.columnView}>
              <View style={styles.column1}>
                <Text style={styles.txtInfo}>Info Siswa/i</Text>
                <Text style={styles.txtColumn1}>Nama Lengkap</Text>
                <Text style={styles.txtColumn1}>E-mail</Text>
                <Text style={styles.txtColumn1}>Kelas</Text>
                <Text style={styles.txtColumn1}>Tanggal Lahir</Text>
                <Text style={styles.txtColumn1}>No. Anggota</Text>
              </View>
              <View style={styles.column2}>
                <Text></Text>
                <Text style={styles.txtColumn2}>: {item.fullName}</Text>
                <Text style={styles.txtColumn2}>: {item.email}</Text>
                <Text style={styles.txtColumn2}>: {item.kelas}</Text>
                <Text style={styles.txtColumn2}>: {item.tglLahir}</Text>
                <Text style={styles.txtColumn2}>: {item.noAnggota}</Text>
              </View>
            </View>
            <View style={{ marginTop: 50, marginHorizontal: 20 }}>
              <Divider width={2} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default CekUser;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    height: hp("100%"),
    width: wp("100%"),
  },
  avatarView: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
  },
  columnView: {
    flex: 1,
    flexDirection: "row",
    marginTop: 50,
  },
  column1: {
    width: wp("30%"),
    marginHorizontal: 30,
  },
  column2: {
    width: wp("50%"),
  },
  txtColumn1: {
    color: "#83888E",
    lineHeight: 30,
  },
  txtColumn2: {
    lineHeight: 30,
  },
  txtInfo: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
