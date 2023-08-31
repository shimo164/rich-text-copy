function copyToClipboard(html, plainText) {
  function listener(e) {
    e.clipboardData.setData('text/html', html);
    e.clipboardData.setData('text/plain', plainText);
    e.preventDefault();
  }

  document.addEventListener('copy', listener);
  document.execCommand('copy');
  document.removeEventListener('copy', listener);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'copyToClipboard') {
    copyToClipboard(request.html, request.plainText);
    sendResponse({ status: 'copied' });
  }
});
