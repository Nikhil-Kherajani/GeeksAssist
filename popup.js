const firebaseConfig = {
  apiKey: "AIzaSyC7xzgLwOrLmYc48B2pbWQ_yqi9GSu0p3o",
  authDomain: "geeksassist-60130.firebaseapp.com",
  projectId: "geeksassist-60130",
  // Add other Firebase config options as needed
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
let hintupdownbuttondisable = false,
  prerequisiteupdownbuttondisable = false;

const heading = document.getElementById("heading");
const loginButton = document.getElementById("loginButton");
// for Prerequisites
const getPrerequisitesButton = document.getElementById(
  "getPrerequisitesButton"
);
const prerequisitesContainer = document.getElementById(
  "prerequisitesContainer"
);
const addPrerequisitesButton = document.getElementById(
  "addPrerequisitesButton"
);
const paragraph_Prerequisites = document.getElementById(
  "paragraph_Prerequisites"
);

// for hints
const getHintButton = document.getElementById("getHintButton");
const hintContainer = document.getElementById("hintContainer");
const addHintButton = document.getElementById("addHintButton");
const paragraph = document.getElementById("paragraph");

function hideElements() {
  loginButton.style.display = "none";
  getHintButton.style.display = "none";
  hintContainer.style.display = "none";
  addHintButton.style.display = "none";
  getPrerequisitesButton.style.display = "none";
  prerequisitesContainer.style.display = "none";
  addPrerequisitesButton.style.display = "none";
  paragraph_Prerequisites.style.display = "none";
}

function showLogin() {
  hideElements();
  heading.textContent = "GeeksAssist";
  paragraph.textContent =
    "Please login to use this extension, Don't worry it is just an anonymous login we don't ask for any info.";

  loginButton.style.display = "block";
}

function showGetHint() {
  // hideElements();
  loginButton.style.display = "none";
  addHintButton.style.display = "none";

  heading.textContent = "GeeksAssist";
  hintContainer.style.display = "block";
  getHintButton.style.display = "block";
  paragraph.textContent = "Click the 'Get Hint' button to view hints";
  hintContainer.textContent = "";
}

function showGetPrerequisite() {
  // hideElements();
  loginButton.style.display = "none";
  addPrerequisitesButton.style.display = "none";
  paragraph_Prerequisites.style.display = "block";

  heading.textContent = "GeeksAssist";
  prerequisitesContainer.style.display = "block";
  getPrerequisitesButton.style.display = "block";
  paragraph_Prerequisites.textContent =
    "Click the 'Get Prerequisites' button to view Prerequisites Questions";
  prerequisitesContainer.textContent = "";
}

function showHint(hints) {
  // hideElements();
  loginButton.style.display = "none";
  getHintButton.style.display = "none";

  heading.textContent = "GeeksAssist";
  hintContainer.style.display = "block";
  addHintButton.style.display = "block";
  paragraph.textContent =
    "If you would like to contribute, you can add a hint.";
  if (hints && hints.length > 0) {
    hints.forEach((hint, index) => {
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
      upButton.classList.add("hint-up-button");
      upButton.textContent = "⬆️";
      upButton.addEventListener("click", () => {
        hintupdownbuttondisable = updateHintScore(
          hint,
          parseInt(hint.score) + 1,
          hintScore
        );
      });

      const downButton = document.createElement("button");
      downButton.classList.add("hint-down-button");
      downButton.textContent = "⬇️";
      downButton.addEventListener("click", () => {
        hintupdownbuttondisable = updateHintScore(
          hint,
          parseInt(hint.score) - 1,
          hintScore
        );
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

function showPrerequisite(prerequisites) {
  // hideElements();
  loginButton.style.display = "none";
  getPrerequisitesButton.style.display = "none";

  heading.textContent = "GeeksAssist";
  prerequisitesContainer.style.display = "block";
  addPrerequisitesButton.style.display = "block";
  paragraph_Prerequisites.textContent =
    "If you would like to contribute, you can add a Prerequisite Ques.";
  if (prerequisites && prerequisites.length > 0) {
    prerequisites.forEach((Prerequisite, index) => {
      const prerequisitediv = document.createElement("div");
      prerequisitediv.classList.add("prerequisite");

      const prerequisiteNumber = document.createElement("span");
      prerequisiteNumber.classList.add("prerequisite-number");
      prerequisiteNumber.textContent = `${index + 1}.`;

      const prerequisiteText = document.createElement("span");
      prerequisiteText.classList.add("prerequisite-text");
      prerequisiteText.textContent = Prerequisite.text;

      const prerequisiteScore = document.createElement("span");
      prerequisiteScore.classList.add("prerequisite-score");
      prerequisiteScore.textContent = Prerequisite.score;

      const upButton = document.createElement("button");
      upButton.classList.add("prerequisite-up-button");
      upButton.textContent = "↑";
      upButton.addEventListener("click", () => {
        prerequisiteupdownbuttondisable = updatePrerequisiteScore(
          Prerequisite,
          parseInt(Prerequisite.score) + 1,
          prerequisiteScore
        );
      });

      const downButton = document.createElement("button");
      downButton.classList.add("prerequisite-down-button");
      downButton.textContent = "↓";
      downButton.addEventListener("click", () => {
        prerequisiteupdownbuttondisable = updatePrerequisiteScore(
          Prerequisite,
          parseInt(Prerequisite.score) - 1,
          prerequisiteScore
        );
      });

      prerequisitediv.appendChild(prerequisiteNumber);
      prerequisitediv.appendChild(prerequisiteText);
      prerequisitediv.appendChild(prerequisiteScore);
      prerequisitediv.appendChild(upButton);
      prerequisitediv.appendChild(downButton);

      prerequisitesContainer.appendChild(prerequisitediv);
    });
  } else {
    prerequisitesContainer.textContent = "Sorry, no Prerequisite available.";
  }
}

function updatePrerequisiteScore(prerequisite, newScore, button) {
  const userId = auth.currentUser.uid;
  const tabsQuery = { active: true, currentWindow: true };
  chrome.tabs.query(tabsQuery, (tabs) => {
    const url = tabs[0].url;

    const regex = /\/problems\/([-\w]+)\//;
    const match = url.match(regex);
    const problemId = match ? match[1] : null;

    const prerequisiteRef = db.collection("prerequisites").doc(problemId);

    // Retrieve the userids array from the Firestore document
    prerequisiteRef.get().then((doc) => {
      if (doc.exists) {
        const userids = doc.data().userIds || [];

        // Check if the prerequisite's userid matches any of the values in the userids array
        if (userids.includes(userId)) {
          alert("You have already voted");
          return true;
        }

        // Update the score for the prerequisite
        const updatedprerequisites = prerequisiteRef
          .update({
            prerequisites:
              firebase.firestore.FieldValue.arrayRemove(prerequisite),
          })
          .then(() => {
            prerequisite.score = newScore;
            const updatedprerequisites = prerequisiteRef.update({
              prerequisites:
                firebase.firestore.FieldValue.arrayUnion(prerequisite),
              userIds: firebase.firestore.FieldValue.arrayUnion(userId), // Add the hint's userid to the userids array
            });
            button.textContent = newScore;
            return false;
          });
      }
    });
  });
}

function updateHintScore(hint, newScore, button) {
  const userId = auth.currentUser.uid;
  const tabsQuery = { active: true, currentWindow: true };
  chrome.tabs.query(tabsQuery, (tabs) => {
    const url = tabs[0].url;

    const regex = /\/problems\/([-\w]+)\//;
    const match = url.match(regex);
    const problemId = match ? match[1] : null;

    const hintRef = db.collection("hints").doc(problemId);

    // Retrieve the userids array from the Firestore document
    hintRef.get().then((doc) => {
      if (doc.exists) {
        const userids = doc.data().userIds || [];

        // Check if the hint's userid matches any of the values in the userids array
        if (userids.includes(userId)) {
          alert("You have already voted");
          return true;
        }

        // Update the score for the hint
        const updatedHints = hintRef
          .update({
            hints: firebase.firestore.FieldValue.arrayRemove(hint),
          })
          .then(() => {
            hint.score = newScore;
            const updatedHints = hintRef.update({
              hints: firebase.firestore.FieldValue.arrayUnion(hint),
              userIds: firebase.firestore.FieldValue.arrayUnion(userId), // Add the hint's userid to the userids array
            });

            button.textContent = newScore;
            return false;
          });
      }
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

      const regex = /\/problems\/([-\w]+)\//;
      const match = url.match(regex);
      const problemId = match ? match[1] : null;
      const hintRef = db.collection("hints").doc(problemId);
      hintRef.get().then((doc) => {
        if (doc.exists) {
          const hints = doc.data().hints;
          if (hints && hints.length > 0) {
            const existingUserIds = hints.map((hint) => hint.userId);
            if (existingUserIds.includes(userId)) {
              alert(
                "It is not possible to include an additional hint, as you have already added contributed for this question. Thank you!"
              );
            } else {
              hintRef
                .update({
                  hints: firebase.firestore.FieldValue.arrayUnion(hint),
                })
                .then(() => {
                  alert(
                    "Hint added successfully! Thank you for your contribution :)"
                  );
                })
                .catch((error) => {
                  console.error("Error adding hint:", error);
                });
            }
          } else {
            hintRef
              .set({ hints: [hint] })
              .then(() => {
                alert(
                  "Hint added successfully! Thank you for your contribution :)"
                );
              })
              .catch((error) => {
                console.error("Error adding hint:", error);
              });
          }
        } else {
          hintRef
            .set({ hints: [hint] })
            .then(() => {
              alert(
                "Hint added successfully! Thank you for your contribution :)"
              );
            })
            .catch((error) => {
              console.error("Error adding hint:", error);
            });
        }
      });
    });
  }
}

function addPrerequisite() {
  const prerequisiteText = prompt("Enter prerequisite:");
  if (prerequisiteText) {
    const userId = auth.currentUser.uid;
    const prerequisite = {
      text: prerequisiteText,
      score: 0,
      userId: userId,
    };

    const tabsQuery = { active: true, currentWindow: true };
    chrome.tabs.query(tabsQuery, (tabs) => {
      const url = tabs[0].url;

      const regex = /\/problems\/([-\w]+)\//;
      const match = url.match(regex);
      const problemId = match ? match[1] : null;
      const hintRef = db.collection("prerequisites").doc(problemId);
      hintRef.get().then((doc) => {
        if (doc.exists) {
          const prerequisites = doc.data().prerequisites;
          if (prerequisites && prerequisites.length > 0) {
            const existingUserIds = prerequisites.map(
              (prerequisite) => prerequisite.userId
            );
            if (existingUserIds.includes(userId)) {
              alert(
                "It is not possible to include an additional prerequisite, as you have already added contributed for this question. Thank you!"
              );
            } else {
              hintRef
                .update({
                  prerequisites:
                    firebase.firestore.FieldValue.arrayUnion(prerequisite),
                })
                .then(() => {
                  alert(
                    "prerequisite added successfully! Thank you for your contribution :)"
                  );
                })
                .catch((error) => {
                  console.error("Error adding prerequisite:", error);
                });
            }
          } else {
            hintRef
              .set({ prerequisites: [prerequisite] })
              .then(() => {
                alert(
                  "prerequisite added successfully! Thank you for your contribution :)"
                );
              })
              .catch((error) => {
                console.error("Error adding prerequisite:", error);
              });
          }
        } else {
          hintRef
            .set({ prerequisites: [prerequisite] })
            .then(() => {
              alert(
                "prerequisite added successfully! Thank you for your contribution :)"
              );
            })
            .catch((error) => {
              console.error("Error adding prerequisite:", error);
            });
        }
      });
    });
  }
}

function getProblemIdFromUrl() {
  const tabsQuery = { active: true, currentWindow: true };
  chrome.tabs.query(tabsQuery, (tabs) => {
    const url = tabs[0].url;

    const regex = /\/problems\/([-\w]+)\//;
    const match = url.match(regex);
    const problemId = match ? match[1] : null;
    return problemId;
  });
}

auth.onAuthStateChanged((user) => {
  if (user) {
    showGetHint();
    showGetPrerequisite();

    getHintButton.addEventListener("click", () => {
      // const problemId = getProblemIdFromUrl();
      const tabsQuery = { active: true, currentWindow: true };
      chrome.tabs.query(tabsQuery, (tabs) => {
        const url = tabs[0].url;

        const regex = /\/problems\/([-\w]+)\//;
        const match = url.match(regex);
        const problemId = match ? match[1] : null;
        // return problemId;
        if (problemId) {
          const hintRef = db.collection("hints").doc(problemId);
          hintRef
            .get()
            .then((doc) => {
              if (doc.exists) {
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
            "Please navigate to a GeeksforGeeks problem page to use this extension.";
        }
      });
    });

    addHintButton.addEventListener("click", () => {
      addHint();
    });

    getPrerequisitesButton.addEventListener("click", () => {
      // const problemId = getProblemIdFromUrl();
      const tabsQuery = { active: true, currentWindow: true };
      chrome.tabs.query(tabsQuery, (tabs) => {
        const url = tabs[0].url;

        const regex = /\/problems\/([-\w]+)\//;
        const match = url.match(regex);
        const problemId = match ? match[1] : null;
        // return problemId;
        if (problemId) {
          const hintRef = db.collection("prerequisites").doc(problemId);
          hintRef
            .get()
            .then((doc) => {
              if (doc.exists) {
                const prerequisites = doc.data().prerequisites;
                showPrerequisite(prerequisites);
              } else {
                showPrerequisite(null);
              }
            })
            .catch((error) => {
              console.error("Error getting hint:", error);
            });
        } else {
          prerequisitesContainer.innerHTML =
            "Please navigate to a GeeksforGeeks problem page to use this extension.";
        }
      });
    });

    addPrerequisitesButton.addEventListener("click", () => {
      addPrerequisite();
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
