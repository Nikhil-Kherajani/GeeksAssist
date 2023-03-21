const firebaseConfig = {
  apiKey: "AIzaSyDyxGC9d2Q-sVJz8Qq7k6hOmF4ldR-dckQ",
  authDomain: "leetassist.firebaseapp.com",
  projectId: "leetassist",
  // Add other Firebase config options as needed
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const heading = document.getElementById("heading");
const loginButton = document.getElementById("loginButton");
const getHintButton = document.getElementById("getHintButton");
const hintContainer = document.getElementById("hintContainer");
const addHintButton = document.getElementById("addHintButton");
const paragraph = document.getElementById("paragraph");

function hideElements() {
  loginButton.style.display = "none";
  getHintButton.style.display = "none";
  hintContainer.style.display = "none";
  addHintButton.style.display = "none";
}

function showLogin() {
  hideElements();
  heading.textContent = "LeetAssist";
  paragraph.textContent =
    "Please login to use this extension, Don't worry it is just an anonymous login we don't ask for any info.";

  loginButton.style.display = "block";
}

function showGetHint() {
  hideElements();
  heading.textContent = "LeetAssist";
  hintContainer.style.display = "block";
  getHintButton.style.display = "block";
  paragraph.textContent = "Click the 'Get Hint' button to view hints";
  // hintContainer.textContent = "Click on Get Hint button to get hints.";
  hintContainer.textContent = "";
}

// function showHint(hints) {
//   hideElements();
//   heading.textContent = "LeetAssist";
//   hintContainer.style.display = "block";
//   addHintButton.style.display = "block";
//   paragraph.textContent =
//     "If you would like to contribute, you can add a hint.";
//   console.log(hints);
//   if (hints && hints.length > 0) {
//     hints.forEach((hint, index) => {
//       const hintDiv = document.createElement("div");
//       hintDiv.classList.add("hint");
//       const hintNumber = document.createElement("span");
//       hintNumber.classList.add("hint-number");
//       hintNumber.textContent = `${index + 1}.`;
//       const hintText = document.createElement("span");
//       hintText.classList.add("hint-text");
//       hintText.textContent = hint.text;
//       const hintScore = document.createElement("span");
//       hintScore.classList.add("hint-score");
//       hintScore.textContent = hint.score;
//       hintDiv.appendChild(hintNumber);
//       hintDiv.appendChild(hintText);
//       hintDiv.appendChild(hintScore);
//       hintContainer.appendChild(hintDiv);
//     });
//   } else {
//     hintContainer.textContent = "Sorry, no hint available.";
//   }
// }

function showHint(hints) {
  hideElements();
  heading.textContent = "LeetAssist";
  hintContainer.style.display = "block";
  addHintButton.style.display = "block";
  paragraph.textContent =
    "If you would like to contribute, you can add a hint.";
  console.log(hints);
  if (hints && hints.length > 0) {
    hints.forEach((hint, index) => {
      let oneup = false,
        onedown = false;
      const hintDiv = document.createElement("div");
      hintDiv.classList.add("hint");

      const hintNumber = document.createElement("span");
      hintNumber.classList.add("hint-number");
      hintNumber.textContent = `${index + 1}.`;

      const hintText = document.createElement("span");
      hintText.classList.add("hint-text");
      hintText.textContent = hint.text;

      const hintScore = document.createElement("span");
      hintScore.classList.add("hint-score");
      hintScore.textContent = hint.score;

      const upButton = document.createElement("button");
      // upButton.style = "margin : 10px";
      upButton.classList.add("hint-up-button");
      upButton.textContent = "+";
      upButton.addEventListener("click", () => {
        updateHintScore(hint, parseInt(hint.score) + 1);
        if (!oneup) {
          hintScore.textContent = parseInt(hint.score) + 1;
          upButton.disabled = true;
          oneup = true;
        }
      });

      const downButton = document.createElement("button");
      downButton.classList.add("hint-down-button");
      downButton.textContent = "-";
      downButton.addEventListener("click", () => {
        updateHintScore(hint, parseInt(hint.score) - 1);
        if (!onedown) {
          hintScore.textContent = parseInt(hint.score) - 1;
          downButton.disabled = true;
          onedown = true;
        }
      });

      hintDiv.appendChild(hintNumber);
      hintDiv.appendChild(hintText);
      hintDiv.appendChild(hintScore);
      hintDiv.appendChild(upButton);
      hintDiv.appendChild(downButton);

      hintContainer.appendChild(hintDiv);
    });
  } else {
    hintContainer.textContent = "Sorry, no hint available.";
  }
}

function updateHintScore(hint, newScore) {
  const tabsQuery = { active: true, currentWindow: true };
  chrome.tabs.query(tabsQuery, (tabs) => {
    const url = tabs[0].url;
    console.log(url);

    const regex = /\/problems\/(.+)\//;
    const match = url.match(regex);
    const problemId = match ? match[1] : null;
    console.log(problemId);

    const hintRef = db.collection("hints").doc(problemId);
    const updatedHints = hintRef
      .update({
        hints: firebase.firestore.FieldValue.arrayRemove(hint),
      })
      .then(() => {
        hint.score = newScore;
        const updatedHints = hintRef.update({
          hints: firebase.firestore.FieldValue.arrayUnion(hint),
        });
        console.log(updatedHints);
        // showHint(hint);
        // const problemId = getProblemIdFromUrl();
        // const tabsQuery = { active: true, currentWindow: true };
        // chrome.tabs.query(tabsQuery, (tabs) => {
        //   const url = tabs[0].url;
        //   console.log(url);

        //   const regex = /\/problems\/(.+)\//;
        //   const match = url.match(regex);
        //   const problemId = match ? match[1] : null;
        //   console.log(problemId);
        //   // return problemId;
        //   if (problemId) {
        //     const hintRef = db.collection("hints").doc(problemId);
        //     console.log(problemId);
        //     hintRef
        //       .get()
        //       .then((doc) => {
        //         console.log(doc);
        //         if (doc.exists) {
        //           console.log(doc);
        //           const hints = doc.data().hints;
        //           showHint(hints);
        //         } else {
        //           showHint(null);
        //         }
        //       })
        //       .catch((error) => {
        //         console.error("Error getting hint:", error);
        //       });
        //   } else {
        //     hintContainer.innerHTML =
        //       "Please navigate to a LeetCode problem page to use this extension.";
        //   }
        // });

        //
      });
  });
}

function addHint() {
  const hintText = prompt("Enter hint:");
  if (hintText) {
    const userId = auth.currentUser.uid;
    const hint = {
      text: hintText,
      score: 0,
      userId: userId,
    };

    const tabsQuery = { active: true, currentWindow: true };
    chrome.tabs.query(tabsQuery, (tabs) => {
      const url = tabs[0].url;
      console.log(url);

      const regex = /\/problems\/(.+)\//;
      const match = url.match(regex);
      const problemId = match ? match[1] : null;
      console.log(problemId);
      const hintRef = db.collection("hints").doc(problemId);
      hintRef
        .update({
          hints: firebase.firestore.FieldValue.arrayUnion(hint),
        })
        .then(() => {
          alert("Hint added successfully!");
        })
        .catch((error) => {
          console.error("Error adding hint:", error);
        });
      // return problemId;
    });
    // const problemId = getProblemIdFromUrl();
  }
}

function getProblemIdFromUrl() {
  const tabsQuery = { active: true, currentWindow: true };
  chrome.tabs.query(tabsQuery, (tabs) => {
    const url = tabs[0].url;
    console.log(url);

    const regex = /\/problems\/(.+)\//;
    const match = url.match(regex);
    const problemId = match ? match[1] : null;
    console.log(problemId);
    return problemId;
  });
}

auth.onAuthStateChanged((user) => {
  if (user) {
    showGetHint();

    getHintButton.addEventListener("click", () => {
      // const problemId = getProblemIdFromUrl();
      const tabsQuery = { active: true, currentWindow: true };
      chrome.tabs.query(tabsQuery, (tabs) => {
        const url = tabs[0].url;
        console.log(url);

        const regex = /\/problems\/(.+)\//;
        const match = url.match(regex);
        const problemId = match ? match[1] : null;
        console.log(problemId);
        // return problemId;
        if (problemId) {
          const hintRef = db.collection("hints").doc(problemId);
          console.log(problemId);
          hintRef
            .get()
            .then((doc) => {
              console.log(doc);
              if (doc.exists) {
                console.log(doc);
                const hints = doc.data().hints;
                showHint(hints);
              } else {
                showHint(null);
              }
            })
            .catch((error) => {
              console.error("Error getting hint:", error);
            });
        } else {
          hintContainer.innerHTML =
            "Please navigate to a LeetCode problem page to use this extension.";
        }
      });
    });

    addHintButton.addEventListener("click", () => {
      addHint();
    });
  } else {
    showLogin();
  }
});

loginButton.addEventListener("click", () => {
  auth
    .signInAnonymously()
    .then(() => {
      console.log("Logged in anonymously");
      // Remove login button from DOM once user logs in
      // loginButton.remove();
      // showGetHint();
    })
    .catch((error) => {
      console.error("Error logging in:", error);
    });
});

// const firebaseConfig = {
//   apiKey: "AIzaSyDyxGC9d2Q-sVJz8Qq7k6hOmF4ldR-dckQ",
//   authDomain: "leetassist.firebaseapp.com",
//   projectId: "leetassist",
// };
// firebase.initializeApp(firebaseConfig);

// const auth = firebase.auth();
// const getHintButton = document.getElementById("getHintButton");
// const loginButton = document.getElementById("loginButton");
// const hintContainer = document.getElementById("hintContainer");

// chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//   const url = tabs[0].url;
//   console.log(url);

//   const regex = /\/problems\/(.+)\//;
//   const match = url.match(regex);
//   const problemId = match ? match[1] : null;
//   console.log(url);
//   console.log(problemId);

//   if (problemId) {
//     // Add event listener to "Get Hint" button
//     getHintButton.addEventListener("click", () => {
//       // Check if user is logged in
//       if (auth.currentUser) {
//         const hintRef = firebase.firestore().collection("hints").doc(problemId);
//         hintRef
//           .get()
//           .then((doc) => {
//             if (doc.exists) {
//               const hints = doc.data().hints;
//               hintContainer.innerHTML = "";
//               hints.forEach((hint, index) => {
//                 const hintDiv = document.createElement("div");
//                 hintDiv.classList.add("hint");
//                 const hintNumber = document.createElement("span");
//                 hintNumber.classList.add("hint-number");
//                 hintNumber.textContent = `${index + 1}.`;
//                 const hintText = document.createElement("span");
//                 hintText.classList.add("hint-text");
//                 hintText.textContent = hint.text;
//                 const hintScore = document.createElement("span");
//                 hintScore.classList.add("hint-score");
//                 hintScore.textContent = hint.score;
//                 hintDiv.appendChild(hintNumber);
//                 hintDiv.appendChild(hintText);
//                 hintDiv.appendChild(hintScore);

//                 hintContainer.appendChild(hintDiv);
//               });
//             } else {
//               // Hint does not exist, ask user to add hint
//               const addHint = confirm(
//                 "No hint available for this problem. Do you want to add a hint?"
//               );
//               if (addHint) {
//                 const hint = prompt("Enter hint:");
//                 // Check if hint is not empty
//                 if (hint) {
//                   // Add hint to Firestore
//                   hintRef
//                     .set({
//                       hints: [{ text: hint, score: 0 }],
//                     })
//                     .then(() => {
//                       const hintDiv = document.createElement("div");
//                       hintDiv.classList.add("hint");
//                       const hintNumber = document.createElement("span");
//                       hintNumber.classList.add("hint-number");
//                       hintNumber.textContent = "1. ";
//                       const hintText = document.createElement("span");
//                       hintText.classList.add("hint-text");
//                       hintText.textContent = hint;
//                       hintDiv.appendChild(hintNumber);
//                       hintDiv.appendChild(hintText);
//                       hintContainer.appendChild(hintDiv);
//                     })
//                     .catch((error) => {
//                       console.error("Error adding hint:", error);
//                     });
//                 }
//               }
//             }
//           })
//           .catch((error) => {
//             console.error("Error retrieving hint:", error);
//           });
//       } else {
//         // Display login button if user is not logged in
//         hintContainer.innerHTML = "";
//         hintContainer.appendChild(loginButton);
//       }
//     });

//     loginButton.addEventListener("click", () => {
//       auth
//         .signInAnonymously()
//         .then(() => {
//           console.log("Logged in anonymously");
//           // Remove login button from DOM once user logs in
//           loginButton.remove();
//         })
//         .catch((error) => {
//           console.error("Error logging in:", error);
//         });
//     });
//   } else {
//     hintContainer.innerHTML =
//       "Please navigate to a LeetCode problem page to use this extension.";
//   }
// });

// firebase.initializeApp({
//   apiKey: "AIzaSyDyxGC9d2Q-sVJz8Qq7k6hOmF4ldR-dckQ",
//   authDomain: "leetassist.firebaseapp.com",
//   projectId: "leetassist",
// });
// const auth = firebase.auth();
// const getHintButton = document.getElementById("getHintButton");
// const loginButton = document.getElementById("loginButton");
// const hintContainer = document.getElementById("hintContainer");

// chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//   const url = tabs[0].url;
//   console.log(url);

//   const regex = /\/problems\/(.+)\//;
//   const match = url.match(regex);
//   const problemId = match ? match[1] : null;
//   console.log(url);
//   console.log(problemId);

//   if (problemId) {
//     // Add event listener to "Get Hint" button
//     getHintButton.addEventListener("click", () => {
//       // Check if user is logged in
//       if (auth.currentUser) {
//         const hintRef = firebase.firestore().collection("hints").doc(problemId);
//         hintRef
//           .get()
//           .then((doc) => {
//             if (doc.exists) {
//               const hints = doc.data().hints;
//               const newHint = { text: "New hint", score: 0 };
//               // Add new hint object to the existing hints array
//               hints.push(newHint);
//               // Update the hints array in Firestore
//               hintRef.update({ hints: hints })
//                 .then(() => {
//                   hintContainer.innerHTML = newHint.text;
//               hintContainer.innerHTML = hints[0].text;

//                 })
//                 .catch((error) => {
//                   console.error("Error updating hint:", error);
//                 });

//             } else {
//               // Hint does not exist, ask user to add hint
//               const addHint = confirm(
//                 "No hint available for this problem. Do you want to add a hint?"
//               );
//               if (addHint) {
//                 const hint = prompt("Enter hint:");
//                 // Check if hint is not empty
//                 if (hint) {
//                   // Add hint to Firestore
//                   hintRef
//                     .set({
//                       hints: [
//                         { text: hint, score: 0, userId: auth.currentUser.uid },
//                       ],
//                     })
//                     .then(() => {
//                       hintContainer.innerHTML = hint;
//                     })
//                     .catch((error) => {
//                       console.error("Error adding hint:", error);
//                     });
//                 }
//               }
//             }
//           })
//           .catch((error) => {
//             console.error("Error retrieving hint:", error);
//           });
//       } else {
//         // Display login button if user is not logged in
//         hintContainer.innerHTML = "";
//         hintContainer.appendChild(loginButton);
//       }
//     });
//     loginButton.addEventListener("click", () => {
//       auth
//         .signInAnonymously()
//         .then(() => {
//           console.log("Logged in anonymously");
//           // Remove login button from DOM once user logs in
//           loginButton.remove();
//         })
//         .catch((error) => {
//           console.error("Error logging in:", error);
//         });
//     });
//   } else {
//     hintContainer.innerHTML =
//       "Please navigate to a LeetCode problem page to use this extension.";
//   }
// });
