import React, { useEffect, useState } from "react";
import { db } from "../../../Firebase/firebase-config";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
} from "firebase/firestore";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import SearchBar from "react-native-dynamic-search-bar";

const HomeAdmin = ({ navigation }) => {
  const [buku, setBuku] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function getBuku() {
      const q = query(collection(db, "buku"), orderBy("date", "desc"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const buku = [];
        querySnapshot.forEach((doc) => {
          const {
            judul,
            pengarang,
            status,
            gambar,
            penerbit,
            detail,
            halaman,
            isbn,
            tglTerbit,
            stok,
            deskripsi,
          } = doc.data();
          buku.push({
            id: doc.id,
            judul,
            pengarang,
            status,
            gambar,
            penerbit,
            detail,
            halaman,
            isbn,
            tglTerbit,
            stok,
            deskripsi,
          });
        });
        setBuku(buku);
      });
    }
    getBuku();
  }, []);

  return (
    <View style={styles.mainView}>
      <SearchBar
        fontColor="#c6c6c6"
        iconColor="#c6c6c6"
        shadowColor="#282828"
        cancelIconColor="#c6c6c6"
        placeholder="Cari disini..."
        onChangeText={(text) => setSearch(text)}
        onSearchPress={() => console.log("Search Icon is pressed")}
        onPress={() => alert("onPress")}
        shadowStyle={styles.searchBarShadow}
      />
      <View></View>
      <FlatList
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => {
          return item.id;
        }}
        data={buku}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate("detailBukuAdmin", { data: item })
            }
            style={styles.card}
          >
            <Image
              style={{
                width: "25%",
              }}
              source={{ uri: item.gambar }}
            ></Image>
            <View
              style={{
                flex: 1,
                justifyContent: "space-between",
                padding: 15,
              }}
            >
              <Text>{item.pengarang}</Text>
              <Text style={styles.itemJudul}>{item.judul}</Text>
              <View>
                <Text style={styles.itemstatus}>Status: {item.status}</Text>
              </View>
            </View>
          </Pressable>
        )}
      ></FlatList>
    </View>
  );
};

export default HomeAdmin;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    height: hp("100%"),
    width: wp("100%"),
    marginTop: 50,
  },
  card: {
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
    height: hp("20%"),
    elevation: 5,
  },
  searchBarShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
});
