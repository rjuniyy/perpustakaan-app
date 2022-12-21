import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  collection,
  collectionGroup,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../Firebase/firebase-config";
import { firebase } from "../../../Firebase/firebase";
import { FontAwesome5 } from "@expo/vector-icons";

const ProsesAdmin = ({ navigation, route }) => {
  const [buku, setBuku] = useState([]);
  const userID = firebase.auth().currentUser.uid;

  useEffect(() => {
    async function getBuku() {
      const q = query(collectionGroup(db, "pinjamBuku"));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const buku = [];
        querySnapshot.forEach((doc) => {
          const {
            judul,
            pengarang,
            gambar,
            status,
            tglPinjam,
            tglKembali,
            deskripsi,
            halaman,
            penerbit,
            isbn,
            tglTerbit,
            peminjam,
            uid,
            parentId,
          } = doc.data();
          buku.push({
            id: doc.id,
            judul,
            pengarang,
            gambar,
            status,
            tglPinjam,
            tglKembali,
            deskripsi,
            halaman,
            penerbit,
            isbn,
            tglTerbit,
            peminjam,
            uid,
            parentId,
          });
        });
        setBuku(buku);
      });
    }
    getBuku();
  }, []);
  return (
    <View style={{ height: hp("100%"), flexDirection: "row" }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ height: hp("100%`"), marginRight: 3 }}
        data={buku}
        keyExtractor={(item, index) => {
          return item.id;
        }}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => navigation.navigate("konfirmasi", { data: item })}
            style={{
              flex: 1,
              flexDirection: "row",
              backgroundColor: "#fff",
              padding: 15,
              borderRadius: 20,
              margin: 5,
              marginHorizontal: 5,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
              height: hp("35%"),
            }}
          >
            <Image
              style={{
                flex: 1,
                width: "50%",
                height: "100%",
              }}
              source={{ uri: item.gambar }}
            ></Image>
            <View
              style={{
                flex: 1,
                padding: 10,
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  color: "grey",
                }}
              >
                {item.pengarang}
              </Text>
              <Text style={styles.itemJudul} numberOfLines={4}>
                {item.judul}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <View style={{ width: "40%" }}>
                  <Text style={styles.itemstatus}>Status</Text>
                  <Text style={styles.itemstatus}>Pinjam</Text>
                  <Text style={styles.itemstatus}>Kembali</Text>
                </View>
                <View style={{ width: "60%" }}>
                  <Text>:{item.status}</Text>
                  <Text>:{item.tglPinjam}</Text>
                  <Text>:{item.tglKembali}</Text>
                </View>
              </View>
            </View>
          </Pressable>
        )}
      ></FlatList>
    </View>
  );
};

export default ProsesAdmin;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  itemJudul: {
    fontWeight: "bold",
    fontSize: 16,
  },
  itempengarang: {
    fontSize: 12,
    color: "gray",
  },
  itemstatus: {
    color: "grey",
    fontSize: 13,
  },
});
