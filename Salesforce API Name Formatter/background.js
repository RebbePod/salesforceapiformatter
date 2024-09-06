function runMacro(tabId, replacementChar) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: (replacementChar) => {
        function getActiveInputField() {
          var el = document.activeElement;
          while (el.shadowRoot) {
            el = el.shadowRoot.activeElement;
          }
          return el;
        }
  
        var el = getActiveInputField();
        if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
          if (replacementChar === '') {
            el.value = el.value.trim()
              .replace(/[^a-zA-Z0-9_]/g, '')  // Remove non-alphanumeric characters
              .replace(/\s+/g, '');  // Remove all spaces
          } else {
            el.value = el.value.trim()
              .replace(/[^a-zA-Z0-9_]/g, replacementChar)  // Replace non-alphanumeric characters with the chosen replacement character
              .replace(new RegExp(replacementChar + '+', 'g'), replacementChar)  // Replace multiple replacement characters with a single one
              .replace(new RegExp('^' + replacementChar + '+|' + replacementChar + '+$', 'g'), '');  // Remove leading or trailing replacement characters
          }
  
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
          alert('Please place the cursor inside a text field or textarea.');
        }
      },
      args: [replacementChar]
    });
  }
  
  // Handle macro shortcuts
  chrome.commands.onCommand.addListener(function(command) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const tabId = tabs[0].id;
      if (command === 'macro1') {
        chrome.storage.sync.get('replacementChar1', function(data) {
          runMacro(tabId, (data.replacementChar1 !== undefined) ? data.replacementChar1 : '_');
        });
      } else if (command === 'macro2') {
        chrome.storage.sync.get('replacementChar2', function(data) {
          runMacro(tabId, (data.replacementChar2 !== undefined) ? data.replacementChar2 : '');
        });
      }
    });
  });

  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'runMacro') {
      runMacro(request.tabId, request.replacementChar);
    }
  });
  