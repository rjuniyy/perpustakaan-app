import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  getDocs,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  startAt,
  endAt,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../Firebase/firebase-config";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import SearchBar from "react-native-dynamic-search-bar";
import AutocompleteInput from "react-native-autocomplete-input";

const Home = ({ navigation }) => {
  const [buku, setBuku] = useState([]);
  const [judul, setJudul] = useState([]);
  const [searchInput, setSearchInput] = useState();
  const [searching, setSearching] = useState(false);
  const [bukuPinjam, setBukuDipinjam] = useState([]);

  function navigateTerbaru() {
    navigation.navigate("bukuTerbaruList");
  }
  function navigateDipinjam() {
    navigation.navigate("bukuDipinjamList");
  }
  function onClearPress() {
    setSearchInput("");
    setSearching(false);
  }

  async function onSearch() {
    setSearching(true);
    const q = query(
      collection(db, "buku"),
      orderBy("judul"),
      startAt(searchInput),
      endAt(searchInput + "\uf8ff")
    );
    const bukuJudul = [];
    const querySnapshot = await getDocs(q);
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
      bukuJudul.push({
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
    setJudul(bukuJudul);
  }

  useEffect(() => {
    async function fetchData() {
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
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchDataPinjam() {
      const q = query(
        collection(db, "buku"),
        where("status", "==", "Dipinjam")
      );
      const bukuPinjam = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        const {
          judul,
          pengarang,
          gambar,
          status,
          penerbit,
          deskripsi,
          halaman,
          isbn,
          tglTerbit,
        } = doc.data();
        bukuPinjam.push({
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
        setBukuDipinjam(bukuPinjam);
      });
    }
    fetchDataPinjam();
  }, []);

  return (
    <View style={styles.Container}>
      <SearchBar
        fontColor="#c6c6c6"
        iconColor="#c6c6c6"
        shadowColor="#282828"
        cancelIconColor="#c6c6c6"
        placeholder="Cari judul buku disini..."
        onChangeText={(text) => setSearchInput(text)}
        onSearchPress={onSearch}
        onClearPress={onClearPress}
        textInputStyle={{ height: 35 }}
        clearIconImageStyle={{ height: 20, width: 40 }}
        onSubmitEditing={onSearch}
      />
      {searching && (
        <View style={{ alignItems: "center" }}>
          <FlatList
            data={judul}
            keyExtractor={(item) => {
              return item.judul;
            }}
            renderItem={({ item }) => (
              <View style={{ justifyContent: "center" }}>
                <TouchableOpacity
                  style={styles.dropdownSearch}
                  onPress={() => navigation.navigate("details", { data: item })}
                >
                  <Text>{item.judul}</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
      <View>
        <Text style={styles.txtKategori}>Buku-Buku Terbaru</Text>
        <TouchableOpacity style={styles.TouchLihat} onPress={navigateTerbaru}>
          <Text style={{ color: "blue" }}>Lihat semua</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: hp("40%") }}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          keyExtractor={(item, index) => {
            return item.id;
          }}
          data={buku}
          renderItem={({ item }) => (
            <Pressable
              style={styles.container}
              onPress={() => navigation.navigate("details", { data: item })}
            >
              <Image style={styles.Image} source={{ uri: item.gambar }}></Image>
              <View style={styles.innerContainer}>
                <Text style={styles.itempengarang}>{item.pengarang}</Text>
                <Text numberOfLines={2} style={styles.itemJudul}>
                  {item.judul}
                </Text>
                <View style={styles.bottomView}>
                  {/* <Text>Stok: {item.stok}</Text> */}
                  <Text style={styles.itemstatus}>Status: {item.status}</Text>
                </View>
              </View>
            </Pressable>
          )}
        ></FlatList>
      </View>
      <View style={{}}>
        <Text style={styles.txtKategori}>Buku-Buku dipinjam</Text>
        <TouchableOpacity
          style={{ position: "absolute", right: 30, marginTop: 15 }}
          onPress={navigateDipinjam}
        >
          <Text style={{ color: "blue" }}>Lihat semua</Text>
        </TouchableOpacity>
      </View>
      {/* View Buku Dipinjam */}
      <View style={{ height: hp("45%"), padding: 10 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => {
            return item.id;
          }}
          data={bukuPinjam}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigation.navigate("detailDipinjamHome", { data: item })
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
                  height: 250,
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
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    alignItems: "center",
  },
  Container: {
    height: hp("100%"),
    width: wp("100%"),
  },
  txtKategori: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
    padding: 10,
  },
  TouchLihat: {
    position: "absolute",
    right: 30,
    marginTop: 15,
  },
  container: {
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
  },
  innerContainer: {
    marginTop: 10,
    width: 140,
    flex: 1,
    justifyContent: "space-between",
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
    fontSize: 12,
  },
  Image: {
    alignSelf: "center",
    width: 150,
    height: "60%",
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
  },
  imagePinjam: {
    width: "20%",
    height: 100,
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1,
  },
  emptyListStyle: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 350,
  },
  dropdownSearch: {
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
    width: wp("90%"),
  },
});
