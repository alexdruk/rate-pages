document.addEventListener('DOMContentLoaded', () => {
  console.log("Popup DOM fully loaded and parsed");
  
  document.getElementById('good').addEventListener('click', () => ratePage(1));
  document.getElementById('bad').addEventListener('click', () => ratePage(0));
  document.getElementById('export').addEventListener('click', exportRatings);

  checkExportEligibility();
});

function ratePage(rating) {
  console.log(`Rating action initiated with rating: ${rating}`);
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    const currentTab = tabs[0];
    console.log(`Sending ratePage message for ${currentTab.url}`);
    chrome.runtime.sendMessage({
      action: "ratePage",
      url: currentTab.url,
      rating
    }, (response) => {
      console.log("Received response from ratePage action:", response);
    });
  });
}

function exportRatings() {
    chrome.runtime.sendMessage({action: "exportRatings"}, (response) => {
        if (response && response.data) {
            const blob = new Blob([response.data], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'pageRatings.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url); // Clean up the URL object
        } else {
            console.error('Failed to receive data for download.');
        }
    });
}

function checkExportEligibility() {
  console.log("Checking export eligibility");
  chrome.runtime.sendMessage({action: "checkExportEligibility"}, (response) => {
    console.log("Received response from checkExportEligibility action:", response);
    if (response && response.eligibleForExport) {
      document.getElementById('export').disabled = false;
    } else {
      document.getElementById('export').disabled = true;
    }
  });
}
