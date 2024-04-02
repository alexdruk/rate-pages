chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "parseAndDownload") {
      try {
        // Parse the document with Readability
        const article = new Readability(document.cloneNode(true), {
          debug: true,
          charThreshold: 1000
        }).parse();
  
        // Prepare the parsed data for download
        initiateDownload({
          id: Date.now(),
          rating: message.rating,
          url: document.location.href,
          ...article
        });
  
        sendResponse({ success: true });
      } catch (error) {
        console.error("Error parsing page with Readability:", error);
        sendResponse({ success: false, error: error.toString() });
      }
    }
    return true; // Enable asynchronous response
  });
  
  function initiateDownload(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const filename = `pageRatings-${data.id}.json`;
  
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  