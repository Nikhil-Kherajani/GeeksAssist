import firebase from "firebase/app";
import "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDyxGC9d2Q-sVJz8Qq7k6hOmF4ldR-dckQ",
  authDomain: "GeeksAssist.firebaseapp.com",
  projectId: "GeeksAssist",
  storageBucket: "GeeksAssist.appspot.com",
  messagingSenderId: "622279187411",
  appId: "1:622279187411:web:d519eff4eec1ed75132d26",
  measurementId: "G-1H3ZK4ZSS8",
};

firebase.initializeApp(firebaseConfig);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getHints") {
    // Get the current question number
    const questionNumber = request.questionNumber;

    // Retrieve the hints from Firestore
    firebase
      .firestore()
      .collection("hints")
      .doc(questionNumber)
      .get()
      .then((doc) => {
        // Check if hints were retrieved successfully
        if (doc.exists) {
          const hints = doc.data().text;
          sendResponse({ hints });
        } else {
          sendResponse({});
        }
      });

    // Return true to indicate that the response is async
    return true;
  }
});

// import firebase from "firebase/app";
// import "firebase/database";

// // Initialize Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyDyxGC9d2Q-sVJz8Qq7k6hOmF4ldR-dckQ",
//   authDomain: "GeeksAssist.firebaseapp.com",
//   projectId: "GeeksAssist",
//   storageBucket: "GeeksAssist.appspot.com",
//   messagingSenderId: "622279187411",
//   appId: "1:622279187411:web:d519eff4eec1ed75132d26",
//   measurementId: "G-1H3ZK4ZSS8",
// };

// firebase.initializeApp(firebaseConfig);

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === "getHints") {
//     // Get the current question number
//     const questionNumber = request.questionNumber;

//     // Retrieve the hints from Firebase
//     firebase
//       .database()
//       .ref(`/hints/${questionNumber}`)
//       .once("value")
//       .then((snapshot) => {
//         // Check if hints were retrieved successfully
//         if (snapshot.exists()) {
//           const hints = snapshot.val().text;
//           sendResponse({ hints });
//         } else {
//           sendResponse({});
//         }
//       });

//     // Return true to indicate that the response is async
//     return true;
//   }
// });

// // import * as firebase from "firebase/app";
// // import "firebase/database";

// // // Initialize the Firebase app
// // var firebaseConfig = {
// //   apiKey: "AIzaSyDyxGC9d2Q-sVJz8Qq7k6hOmF4ldR-dckQ",
// //   authDomain: "GeeksAssist.firebaseapp.com",
// //   projectId: "GeeksAssist",
// //   storageBucket: "GeeksAssist.appspot.com",
// //   messagingSenderId: "622279187411",
// //   appId: "1:622279187411:web:d519eff4eec1ed75132d26",
// //   measurementId: "G-1H3ZK4ZSS8",
// // };
// // firebase.initializeApp(firebaseConfig);

// // // // Initialize Firebase
// // // firebase.initializeApp({
// // //   apiKey: "AIzaSyDyxGC9d2Q-sVJz8Qq7k6hOmF4ldR-dckQ",
// // //   authDomain: "GeeksAssist.firebaseapp.com",
// // //   projectId: "GeeksAssist",
// // // });

// // // Listen for messages from the content script
// // chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
// //   if (request.type === "requestHint") {
// //     var questionId = request.questionId;
// //     var documentId = request.documentId;
// //     var hintRef = firebase
// //       .database()
// //       .ref("/hints/" + questionId + "/documentId");
// //     hintRef.once("value", function (snapshot) {
// //       if (snapshot.exists() && snapshot.val().documentId === documentId) {
// //         // display hint
// //         var hint = snapshot.val().text;
// //         alert(hint);
// //       } else {
// //         // show "suggest a hint" popup
// //         alert("Suggest a hint for this question!");
// //       }
// //     });
// //   }
// // });
