document.getElementById('saveButton').addEventListener('click', function() {
    const replacementChar1 = document.getElementById('replacementChar1').value;
    const replacementChar2 = document.getElementById('replacementChar2').value;
    
    chrome.storage.sync.set({ replacementChar1: replacementChar1, replacementChar2: replacementChar2 }, function() {
      // Show subtle "Saved!" message
      const savedMessage = document.getElementById('savedMessage');
      savedMessage.style.display = 'block';  // Show the saved message
      
      // Hide the message after 2 seconds
      setTimeout(function() {
        savedMessage.style.display = 'none';
      }, 2000);
    });
  });
  
  // Retrieve and show the saved replacement characters on page load
  document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get(['replacementChar1', 'replacementChar2'], function(data) {
      // Set Macro 1 Replacement to _ if no value is saved yet
      document.getElementById('replacementChar1').value = data.replacementChar1 !== undefined ? data.replacementChar1 : '_';
      document.getElementById('replacementChar2').value = data.replacementChar2 !== undefined ? data.replacementChar2 : '';
    });
  
    // Helper function to display shortcut keys in separate boxes
    function displayShortcut(command, elementId) {
      const shortcut = command.shortcut || 'Not Set';
      const keys = shortcut.split('+');
      const ul = document.getElementById(elementId);
      ul.innerHTML = '';  // Clear existing items
  
      if (shortcut === 'Not Set') {
        ul.innerHTML = '<li class="shortcut-box">Not Set</li>';
      } else {
        keys.forEach(function(key) {
          const li = document.createElement('li');
          li.className = 'shortcut-box';
          li.innerText = key;
          ul.appendChild(li);
        });
      }
    }
  
    // Retrieve and display the current keyboard shortcuts
    chrome.commands.getAll(function(commands) {
      commands.forEach(function(command) {
        if (command.name === 'macro1') {
          displayShortcut(command, 'shortcut1');
        } else if (command.name === 'macro2') {
          displayShortcut(command, 'shortcut2');
        }
      });
    });
  });
  
  // Open the shortcuts page when the link is clicked
  document.getElementById('openShortcuts').addEventListener('click', function() {
    chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
  });
  