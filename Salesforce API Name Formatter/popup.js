// Function to update button labels with the current replacement character
function updateButtonLabels() {
    chrome.storage.sync.get(['replacementChar1', 'replacementChar2'], function(data) {
      const replacementChar1 = data.replacementChar1 !== undefined ? data.replacementChar1 : '_';
      const replacementChar2 = data.replacementChar2 !== undefined ? data.replacementChar2 : '';
  
      document.getElementById('macro1').innerText = `Macro 1 (${replacementChar1 || 'Nothing'})`;
      document.getElementById('macro2').innerText = `Macro 2 (${replacementChar2 || 'Nothing'})`;
    });
  }
  
  // Run the macro for Macro 1
  document.getElementById('macro1').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const tabId = tabs[0].id;
      chrome.storage.sync.get('replacementChar1', function(data) {
        chrome.runtime.sendMessage({ type: 'runMacro', tabId: tabId, replacementChar: data.replacementChar1 !== undefined ? data.replacementChar1 : '_' });
      });
    });
  });
  
  // Run the macro for Macro 2
  document.getElementById('macro2').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const tabId = tabs[0].id;
      chrome.storage.sync.get('replacementChar2', function(data) {
        chrome.runtime.sendMessage({ type: 'runMacro', tabId: tabId, replacementChar: data.replacementChar2 !== undefined ? data.replacementChar2 : '_' });
      });
    });
  });
  
  // Update button labels when the popup loads
  document.addEventListener('DOMContentLoaded', updateButtonLabels);
  
// Open the options page when the settings icon is clicked
document.getElementById('settingsIcon').addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  });


  // Display the version number in the bottom-left corner
document.addEventListener('DOMContentLoaded', function() {
    const manifestData = chrome.runtime.getManifest();
    document.getElementById('version').textContent = `v${manifestData.version}`;
  });