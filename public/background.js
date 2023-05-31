// background.js

function handleSubmitAbTest(input) {
    const parts = input.trim().split(' '); // Split the input by space
    if (parts.length === 2) {
      const [abTestId, abTestGroup] = parts;
  
      // Construct the URL parameters
      const params = new URLSearchParams();
      params.set('abtest', abTestId);
      params.set('group', abTestGroup);
  
      // Get the active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs.length > 0) {
          const tab = tabs[0];
  
          // Modify the URL of the active tab
          const url = new URL(tab.url);
          url.search += (url.search ? '&' : '') + params.toString();
  
          // Update the URL of the active tab
          chrome.tabs.update(tab.id, { url: url.href });
        }
      });
    } else {
      // Handle invalid input
      console.log('Invalid input format');
    }
  }
  
  chrome.runtime.onMessage.addListener((request) => {
    if (request.type === 'handleSubmitAbTest') {
      handleSubmitAbTest(request.input);
    }
  });
  