// var admin = require("firebase-admin");
// const { getAuth } = require("firebase/auth");

// var serviceAccount = require("./ServiceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });
// const db = admin.firestore();
// const uid = "6VGA5S9VTBRUO2hyuK5roJw2xFg";
// const additionalClaims = {
//   admin: true,
// };

// admin
//   .auth()
//   .createCustomToken(uid, additionalClaims)
//   .then((customToken) => {
//     console.log(customToken, additionalClaims);
//   })
//   .catch((error) => {
//     console.log("Error creating custom tokens:", error);
//   });

// admin
//   .auth()
//   .verifyIdToken(customToken)
//   .then((claims) => {
//     if (claims.admin === true) {
//       // Allow access to requested admin resource.
//     }
//   });
// // getAuth()
// //   .setCustomUserClaims(uid, { admin: true })
// //   .then(() => {
// //     console.log(claims);
// //   });
// // admin.auth().setCustomUserClaims(uid, {admin: true})
// // .then(()=>{
// // })
