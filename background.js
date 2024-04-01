chrome.runtime.onInstalled.addListener(() => {
  console.log('Service Worker installed.');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message:", message);

  if (message.action === "ratePage") {
    chrome.storage.local.get({pages: {}, count: 0}, function(data) {
      console.log("Current data before update:", data);
      data.pages[message.url] = message.rating;
      data.count += 1;
      chrome.storage.local.set({pages: data.pages, count: data.count}, () => {
        console.log("Rating updated and saved:", data);
        sendResponse({status: "Rating saved"});
      });
    });
    return true;
  } else if (message.action === "exportRatings") {
    chrome.storage.local.get({pages: {}}, function(data) {
        // Convert data to a string and send it back
        const dataStr = JSON.stringify(data.pages, null, 4);
        sendResponse({data: dataStr}); // Send raw data instead of URL
        chrome.storage.local.set({pages: {}, count: 0}); // Reset the data
    });
    return true; // Indicates asynchronous response is pending
  } else if (message.action === "checkExportEligibility") {
    chrome.storage.local.get({count: 0}, data => {
      console.log("Checking export eligibility. Current count:", data.count);
      sendResponse({eligibleForExport: data.count >= 100});
    });
    return true;
  }
});
