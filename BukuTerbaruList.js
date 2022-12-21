// import {
//   StyleSheet,
//   Text,
//   View,
//   Pressable,
//   Image,
//   Dimensions,
//   TouchableOpacity,
//   FlatList,
// } from "react-native";
// import React, { useEffect, useRef, useState } from "react";
// import { db } from "../../Firebase/firebase-config";
// import {
//   getDocs,
//   orderBy,
//   where,
//   query,
//   collection,
//   onSnapshot,
// } from "firebase/firestore";
// import { useScrollToTop } from "@react-navigation/native";

// const BukuTerbaruList = ({ navigation }) => {
//   const [buku, setBuku] = useState([]);

//   // const ref = useRef(null);
//   // useScrollToTop(ref);

//   useEffect(() => {
//     async function fetchBukuTerbaru() {
//       const q = query(
//         collection(db, "buku"),
//         where("status", "==", "Tersedia"),
//         orderBy("date", "desc")
//       );
//       const unsubscribe = onSnapshot(q, (querySnapshot) => {
//         const buku = [];
//         querySnapshot.forEach((doc) => {
//           const {
//             judul,
//             pengarang,
//             status,
//             gambar,
//             penerbit,
//             deskripsi,
//             halaman,
//             isbn,
//             tglTerbit,
//           } = doc.data();
//           buku.push({
//             id: doc.id,
//             judul,
//             pengarang,
//             status,
//             gambar,
//             penerbit,
//             deskripsi,
//             halaman,
//             isbn,
//             tglTerbit,
//           });
//         });
//       });
//       setBuku(buku);
//     }
//     fetchBukuTerbaru();
//   }, []);

//   return (
//     <View style={styles.mainView}>
//       {/* <FlatList
//         // ref={ref}
//         numColumns={2}
//         key={2}
//         columnWrapperStyle={{ justifyContent: "space-between" }}
//         data={buku}
//         keyExtractor={(item, index) => {
//           return item.id;
//         }}
//         renderItem={({ item, index }) => (
//           <View style={styles.itemView}>
//             <Pressable
//               key={item}
//               onPress={() => navigation.navigate("details", { data: item })}
//             >
//               <Image style={styles.image} source={{ uri: item.gambar }}></Image>
//               <Text style={styles.txtpengarang}>{item.pengarang}</Text>
//               <Text numberOfLines={2} style={styles.txtjudul}>
//                 {item.judul}
//               </Text>
//               <Text style={styles.txtpenerbit}>{item.penerbit}</Text>
//             </Pressable>
//           </View>
//         )}
//       ></FlatList> */}
//       <FlatList
//         data={buku}
//         renderItem={({ item }) => (
//           <View>
//             <Text>Hai</Text>
//           </View>
//         )}
//       ></FlatList>
//     </View>
//   );
// };

// export default BukuTerbaruList;

// const styles = StyleSheet.create({
//   mainView: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "center",
//     padding: 10,
//   },
//   itemView: {
//     maxWidth: "100%" / 2,
//     flex: 1,
//     backgroundColor: "#fff",
//     marginBottom: 10,
//     borderRadius: 15,
//     padding: 10,
//     marginLeft: 5,
//     marginRight: 5,
//     justifyContent: "space-between",
//   },
//   image: {
//     height: 180,
//     width: "70%",
//     alignSelf: "center",
//   },
//   txtpengarang: {
//     marginTop: 10,
//     color: "grey",
//   },
//   txtjudul: {
//     marginTop: 5,
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   txtpenerbit: {
//     marginTop: 5,
//     color: "grey",
//   },
// });
