function copyToClipboard(text) {
  function listener(e) {
    e.clipboardData.setData('text/plain', text);
    e.preventDefault();
  }

  document.addEventListener('copy', listener);
  document.execCommand('copy');
  document.removeEventListener('copy', listener);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'copyToClipboard') {
    copyToClipboard(request.html || request.text);
  }
});
