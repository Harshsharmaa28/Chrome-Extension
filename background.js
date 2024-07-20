
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message && message.type === 'QUERY') {
        fetch(`https://api.gemini.com/v1/your-endpoint`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query: message.query })
        })
        .then(response => response.json())
        .then(data => sendResponse(data))
        .catch(error => console.error('Error:', error));
        return true; // Keeps the message channel open for async sendResponse
      }
    });
    