import { View, Text } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUp from "./Screens/SignUp";
import SignIn from "./Screens/SignIn";
import Home from "./Screens/signedIn/Home";
import Profile from "./Screens/signedIn/Profile";
import ProfileAdmin from "./Screens/signedIn/admin/ProfileAdmin";
import BukuDipinjamList from "./Screens/signedIn/dipinjam/BukuDipinjamList";
import BukuDipinjamTab from "./Screens/signedIn/dipinjam/BukuDipinjamTab";
import DetailDipinjamHome from "./Screens/signedIn/dipinjam/DetailDipinjamHome";
import Peminjaman from "./Screens/signedIn/proses/Peminjaman";
import Pengembalian from "./Screens/signedIn/proses/Pengembalian";
import BukuTerbaruList from "./Screens/signedIn/BukuTerbaruList";
import Details from "./Screens/signedIn/Details";
import KartuDigital from "./Screens/signedIn/KartuDigital";
import ProsesTab from "./Screens/signedIn/proses/ProsesTab";
import Pembatalan from "./Screens/signedIn/proses/Pembatalan";
import AddBuku from "./Screens/signedIn/admin/AddBuku";
import HomeAdmin from "./Screens/signedIn/admin/HomeAdmin";
import UbahBuku from "./Screens/signedIn/admin/UbahBuku";
import EditProfile from "./Screens/signedIn/EditProfile";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DetailBukuAdmin from "./Screens/signedIn/admin/DetailBukuAdmin";
import ProsesAdmin from "./Screens/signedIn/admin/ProsesAdmin";
import Konfirmasi from "./Screens/signedIn/admin/Konfirmasi";
import CekUser from "./Screens/signedIn/admin/CekUser";
import LupaPassword from "./Screens/LupaPassword";

const App = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createMaterialBottomTabNavigator();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      const email = "april.yadi03@gmail.com";
      if (user) {
        setIsSignedIn(true);
        if (user.email == email) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsSignedIn(false);
      }
      console.log(user);
    });
  }, []);

  function HomeTabs() {
    return (
      <Tab.Navigator
        initialRouteName="home"
        activeColor="black"
        inactiveColor="white"
        barStyle={{ backgroundColor: "#1AC000" }}
      >
        {isAdmin == false ? (
          <>
            <Tab.Screen
              name="home"
              component={Home}
              options={{
                tabBarLabel: "Home",
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="home" color={color} size={26} />
                ),
              }}
            />
            <Tab.Screen
              name="bukuDipinjamTab"
              component={BukuDipinjamTab}
              options={{
                tabBarLabel: "Buku Dipinjam",
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons
                    name="book-open-variant"
                    color={color}
                    size={26}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="prosesTab"
              component={ProsesTab}
              options={{
                tabBarLabel: "Proses",
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons
                    name="book-sync"
                    color={color}
                    size={26}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="akun"
              component={Profile}
              options={{
                tabBarLabel: "Akun",
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons
                    name="account-circle"
                    color={color}
                    size={26}
                  />
                ),
              }}
            />
          </>
        ) : null}

        {isAdmin == true ? (
          <>
            <Tab.Screen
              name="homeAdmin"
              component={HomeAdmin}
              options={{
                tabBarLabel: "Home",
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="home" color={color} size={26} />
                ),
              }}
            />
            <Tab.Screen
              name="addBuku"
              component={AddBuku}
              options={{
                tabBarLabel: "Tambah Buku",
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons
                    name="plus-box"
                    size={28}
                    color={color}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="prosesAdmin"
              component={ProsesAdmin}
              options={{
                tabBarLabel: "Proses",
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons
                    name="book-sync"
                    color={color}
                    size={26}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="akunAdmin"
              component={ProfileAdmin}
              options={{
                tabBarLabel: "Akun",
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons
                    name="account-circle"
                    color={color}
                    size={26}
                  />
                ),
              }}
            />
          </>
        ) : null}
      </Tab.Navigator>
    );
  }

  if (isSignedIn == true) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          {isAdmin == true ? (
            <>
              <Stack.Screen
                name="detailBukuAdmin"
                component={DetailBukuAdmin}
                options={{
                  headerTransparent: true,
                  headerTitle: "",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="ubahBuku"
                component={UbahBuku}
                options={{
                  headerTransparent: true,
                  headerTitle: "",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="konfirmasi"
                component={Konfirmasi}
                options={{
                  headerTransparent: true,
                  headerTitle: "",
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="cekUser"
                component={CekUser}
                options={{
                  headerTransparent: true,
                  headerTitle: "",
                  headerShown: true,
                }}
              />
            </>
          ) : null}
          <Stack.Screen
            name="Home"
            component={HomeTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="bukuTerbaruList"
            component={BukuTerbaruList}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="bukuDipinjamList"
            component={BukuDipinjamList}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="kartuDigital"
            component={KartuDigital}
            options={{
              orientation: "landscape",
              headerTransparent: true,
              headerTitle: "",
            }}
          />
          <Stack.Screen
            name="details"
            component={Details}
            options={{
              headerTransparent: true,
              headerTitle: "",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="peminjaman"
            component={Peminjaman}
            options={{
              headerTransparent: true,
              headerTitle: "",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="pengembalian"
            component={Pengembalian}
            options={{
              headerTransparent: true,
              headerTitle: "",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="pembatalan"
            component={Pembatalan}
            options={{
              headerTransparent: true,
              headerTitle: "",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="detailDipinjamHome"
            component={DetailDipinjamHome}
            options={{
              headerTransparent: true,
              headerTitle: "",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="editProfile"
            component={EditProfile}
            options={{
              headerTransparent: true,
              headerTitle: "",
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer initialRouteName="signUp">
        <Stack.Navigator>
          <Stack.Screen
            name="signIn"
            component={SignIn}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="signUp"
            component={SignUp}
            options={{ headerTransparent: true, headerTitle: "Daftar Akun" }}
          />
          <Stack.Screen
            name="lupaPassword"
            component={LupaPassword}
            options={{ headerTransparent: true, headerTitle: "Lupa Password" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};

export default App;
