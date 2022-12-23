import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
} from "react-native";
import { firebase } from "../../Firebase/firebase";
import {
  collection,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../Firebase/firebase-config";
import React, { useEffect, useState } from "react";
import Barcode from "@kichiyaki/react-native-barcode-generator";

const KartuDigital = () => {
  const [user, setUser] = useState([]);

  useEffect(() => {
    async function getUser() {
      const uid = firebase.auth().currentUser.uid;
      const q = query(collection(db, "users"), where("uid", "==", uid));
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
    getUser();
  }, []);

  return (
    <View style={styles.mainView}>
      <View style={styles.imageWrapper}>
        <ImageBackground
          style={styles.theImage}
          source={require("../../assets/card.png")}
        >
          <FlatList
            style={{ flex: 1 }}
            data={user}
            renderItem={({ item }) => (
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Image
                  style={{
                    height: 120,
                    width: 120,
                    marginTop: 120,
                    marginLeft: 40,
                    borderRadius: 5,
                  }}
                  source={{ uri: item.avatarUrl }}
                ></Image>
                <View
                  style={{
                    justifyContent: "center",
                    marginLeft: 80,
                    marginTop: 120,
                  }}
                >
                  <Text style={styles.text}>
                    Nama&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;
                    {item.namaLengkap}
                  </Text>
                  <Text style={styles.text}>
                    Kelas
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;
                    {item.kelas}
                  </Text>
                  <Text style={styles.text}>
                    No. Anggota&nbsp;: {item.noAnggota}
                  </Text>
                  <Barcode
                    format="CODE39"
                    value={item.noAnggota}
                    style={{
                      marginBottom: 40,
                      marginTop: 50,
                      height: 0,
                    }}
                  ></Barcode>
                </View>
              </View>
            )}
          ></FlatList>
        </ImageBackground>
      </View>
    </View>
  );
};

export default KartuDigital;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  imageWrapper: {
    height: 360,
    width: 600,
    overflow: "hidden",
  },
  theImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    flex: 1,
  },
  avatar: {
    height: 120,
    width: 120,
    marginLeft: 50,
    marginVertical: 130,
  },
  text: {
    lineHeight: 30,
    fontSize: 20,
  },
});
