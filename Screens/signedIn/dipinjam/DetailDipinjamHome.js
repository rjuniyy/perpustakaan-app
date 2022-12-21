import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { collection, query } from "firebase/firestore";
import { db } from "../../../Firebase/firebase-config";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ReadMore from "@fawazahmed/react-native-read-more";

const DetailDipinjam = ({ navigation, route }) => {
  const [bukuData, setBukuData] = useState(route.params.data);

  return (
    <ScrollView style={styles.mainView}>
      <View style={styles.imgView}>
        <Image style={styles.img} source={{ uri: bukuData.gambar }}></Image>
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "flex-start",
          padding: 10,
        }}
      >
        <View style={{ width: "50%" }}>
          <Text style={styles.txtpengarang}>{bukuData.pengarang}</Text>
        </View>
        <View style={{ width: "50%", alignItems: "flex-end" }}>
          <Text>Status: {bukuData.status}</Text>
        </View>
        <Text style={styles.textjudul}>{bukuData.judul}</Text>
      </View>
      <View style={styles.hairline} />
      <View style={styles.subView}>
        <Text style={styles.txtsubTitle}>Deskripsi Buku</Text>
        <ReadMore
          seeMoreStyle={{ color: "blue", fontWeight: "bold" }}
          seeLessStyle={{ color: "blue", fontWeight: "bold" }}
          numberOfLines={4}
        >
          {bukuData.deskripsi}
        </ReadMore>
      </View>
      <View style={styles.hairline} />
      <View style={styles.subView}>
        <Text style={styles.txtsubTitle}>Detail Buku</Text>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          flexWrap: "wrap",
          padding: 10,
        }}
      >
        <View style={{ width: "50%" }}>
          <Text style={styles.txtsubDetail}>Jumlah Halaman</Text>
          <Text>{bukuData.halaman}</Text>
          <Text style={styles.txtsubDetail}>Tanggal Terbit</Text>
          <Text>{bukuData.tglTerbit}</Text>
        </View>
        <View style={{ width: "50%" }}>
          <Text style={styles.txtsubDetail}>Penerbit</Text>
          <Text>{bukuData.penerbit}</Text>
          <Text style={styles.txtsubDetail}>ISBN</Text>
          <Text>{bukuData.isbn}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default DetailDipinjam;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imgView: {
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 10,
  },
  img: {
    width: wp("95%"),
    height: hp("50%"),
    resizeMode: "contain",
  },
  hairline: {
    backgroundColor: "#A2A2A2",
    height: 2,
    width: wp("90%"),
    alignSelf: "center",
    borderRadius: 5,
  },
  textjudul: {
    fontSize: 18,
    fontWeight: "bold",
  },
  txtpengarang: {
    color: "grey",
  },
  txtsubTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  subView: {
    padding: 10,
  },
  txtsubDetail: {
    color: "grey",
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
    alignSelf: "center",
    marginBottom: 10,
  },
  btnText: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
  },
});
