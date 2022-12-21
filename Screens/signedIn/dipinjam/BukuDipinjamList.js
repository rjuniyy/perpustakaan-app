import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "../../../Firebase/firebase-config";
import {
  getDocs,
  orderBy,
  where,
  query,
  collection,
  onSnapshot,
} from "firebase/firestore";

const BukuDipinjamList = ({ navigation, route }) => {
  const [buku, setBuku] = useState([]);

  useEffect(() => {
    async function fetchBukuTerbaru() {
      const q = query(
        collection(db, "buku"),
        where("status", "==", "Dipinjam"),
        orderBy("date", "desc")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const buku = [];
        querySnapshot.forEach((doc) => {
          const {
            judul,
            pengarang,
            status,
            gambar,
            penerbit,
            deskripsi,
            halaman,
            isbn,
            tglTerbit,
          } = doc.data();
          buku.push({
            id: doc.id,
            judul,
            pengarang,
            status,
            gambar,
            penerbit,
            deskripsi,
            halaman,
            isbn,
            tglTerbit,
          });
        });
        setBuku(buku);
      });
      // const querySnapshot = await getDocs(q);
    }
    fetchBukuTerbaru();
  }, []);

  return (
    <View style={styles.mainView}>
      <FlatList
        numColumns={2}
        data={buku}
        keyExtractor={(item) => {
          return item.id;
        }}
        renderItem={({ item, index }) => (
          <View style={styles.itemView}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("detailDipinjamHome", { data: item })
              }
            >
              <Image style={styles.image} source={{ uri: item.gambar }}></Image>
              <Text style={styles.txtpengarang}>{item.pengarang}</Text>
              <Text numberOfLines={2} style={styles.txtjudul}>
                {item.judul}
              </Text>
              <Text style={styles.txtpenerbit}>{item.penerbit}</Text>
            </TouchableOpacity>
          </View>
        )}
      ></FlatList>
    </View>
  );
};

export default BukuDipinjamList;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
  },
  itemView: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 15,
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  image: {
    height: 180,
    width: "70%",
    alignSelf: "center",
  },
  txtpengarang: {
    marginTop: 10,
    color: "grey",
  },
  txtjudul: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: "bold",
  },
  txtpenerbit: {
    marginTop: 5,
    color: "grey",
  },
});
