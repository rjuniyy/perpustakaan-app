import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../Firebase/firebase-config";

const BukuTerbaruList = ({ navigation }) => {
  const [buku, setBuku] = useState([]);

  useEffect(() => {
    async function getBuku() {
      const q = query(
        collection(db, "buku"),
        where("status", "==", "Tersedia"),
        orderBy("date", "desc")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const buku = [];
        querySnapshot.forEach((doc) => {
          const {
            judul,
            pengarang,
            penerbit,
            status,
            gambar,
            deskripsi,
            halaman,
            isbn,
            tglTerbit,
          } = doc.data();
          buku.push({
            id: doc.id,
            penerbit,
            judul,
            pengarang,
            status,
            gambar,
            deskripsi,
            halaman,
            isbn,
            tglTerbit,
          });
        });
        setBuku(buku);
      });
    }
    getBuku();
  }, []);

  return (
    <View style={styles.mainView}>
      <FlatList
        numColumns={2}
        data={buku}
        keyExtractor={(item) => {
          return item.id;
        }}
        renderItem={({ item }) => (
          <View style={styles.itemView}>
            <TouchableOpacity
              onPress={() => navigation.navigate("details", { data: item })}
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
      />
    </View>
  );
};

export default BukuTerbaruList;

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
