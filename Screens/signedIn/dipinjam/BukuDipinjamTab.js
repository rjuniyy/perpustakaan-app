import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  query,
  where,
  getDocs,
  collectionGroup,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../../Firebase/firebase-config";
import { firebase } from "../../../Firebase/firebase";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import moment from "moment/moment";

const BukuDipinjamUser = ({ navigation }) => {
  const [buku, setBuku] = useState([]);
  const userID = firebase.auth().currentUser.uid;

  useEffect(() => {
    async function fetchData() {
      const q = query(
        collection(db, "users", userID, "pinjamBuku"),
        where("status", "==", "Dipinjam")
      );
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
            parentId,
          });
        });
        setBuku(buku);
      });
    }
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ height: hp("100%"), flexDirection: "row" }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ height: "100%", marginRight: 3 }}
          data={buku}
          keyExtractor={(item, index) => {
            return item.id;
          }}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() =>
                navigation.navigate("pengembalian", { data: item })
              }
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
              }}
            >
              <Image
                style={{
                  flex: 1,
                  width: "20%",
                  height: 220,
                }}
                source={{ uri: item.gambar }}
              ></Image>
              <View
                style={{
                  flex: 1,
                  marginTop: 20,
                  padding: 15,
                }}
              >
                <Text
                  style={{
                    position: "absolute",
                    top: 0,
                    marginLeft: 15,
                    color: "grey",
                  }}
                >
                  {item.pengarang}
                </Text>
                <Text style={styles.itemJudul} numberOfLines={2}>
                  {item.judul}
                </Text>
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    padding: 15,
                  }}
                >
                  <Text style={styles.itemstatus}>Status: {item.status}</Text>
                  <Text style={styles.itemstatus}>
                    Pinjam: {item.tglPinjam}
                  </Text>
                  <Text style={styles.itemstatus}>
                    Kembali:<Text>{item.tglKembali}</Text>
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
        ></FlatList>
      </View>
    </View>
  );
};

export default BukuDipinjamUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  itemJudul: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 15,
  },
  itempengarang: {
    marginTop: 10,
    fontSize: 12,
    flexDirection: "row",
    alignContent: "flex-start",
    color: "gray",
  },
  itemstatus: {
    color: "grey",
    fontSize: 13,
  },
});
