// Listen for changes to the problem title
const titleObserver = new MutationObserver(() => {
  // Get the problem title
  const titleElement = document.querySelector(".css-v3d350");
  if (!titleElement) return;
  const title = titleElement.textContent.trim();

  // Get the problem ID
  const idMatch = window.location.pathname.match(/\/problems\/(.+)\//);
  if (!idMatch) return;
  const id = idMatch[1];

  // Get the hint for the problem from Firestore
  chrome.runtime.sendMessage(
    { type: "getHint", problemId: id, problemTitle: title },
    (hint) => {
      // Insert the hint after the problem description
      const descriptionElement = document.querySelector(".description__24sA");
      if (!descriptionElement) return;
      const hintElement = document.createElement("div");
      hintElement.className = "hint__24sA";
      hintElement.innerHTML = `<h4>Hint</h4><p>${hint || "No hint found."}</p>`;
      descriptionElement.parentNode.insertBefore(
        hintElement,
        descriptionElement.nextSibling
      );
    }
  );
});

// Start observing the problem title
titleObserver.observe(document.body, { childList: true });
