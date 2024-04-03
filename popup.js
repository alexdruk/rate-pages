document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("good")
    .addEventListener("click", () => triggerContentScript(1));
  document
    .getElementById("bad")
    .addEventListener("click", () => triggerContentScript(0));
});

async function triggerContentScript(rating) {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  try {
    // Inject Readability.js first
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["Readability.js"],
    });

    // Then inject your content script
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["contentScript.js"],
    });
  } catch (error) {
    console.error("Script injection failed:", error);
  }

  // After both scripts are injected, send a message to the content script
  chrome.tabs.sendMessage(tab.id, {
    action: "parseAndDownload",
    rating: rating,
  });
}
