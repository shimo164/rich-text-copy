const selectedText = window.getSelection().toString();
chrome.runtime.sendMessage({ action: 'selectedText', data: selectedText });
