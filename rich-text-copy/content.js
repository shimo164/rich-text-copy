function copyToClipboard(html, plain) {
  function listener(e) {
    if (html) {
      e.clipboardData.setData('text/html', html);
    }
    if (plain) {
      e.clipboardData.setData('text/plain', plain);
    }
    e.preventDefault();
  }

  document.addEventListener('copy', listener);
  document.execCommand('copy');
  document.removeEventListener('copy', listener);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'copyToClipboard') {
    copyToClipboard(request.html, request.plainText);
  }
});
