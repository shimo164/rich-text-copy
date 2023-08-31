chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'rich-text-style',
    title: 'Copy as Rich Text',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const text = info.selectionText;
  const url = tab.url;

  if (info.menuItemId === 'rich-text-style') {
    const html = `<a href="${url}">${text}</a>`;

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ['content.js'],
      },
      () => {
        chrome.tabs.sendMessage(tab.id, {
          action: 'copyToClipboard',
          html: html,
          plainText: text,
        });
      },
    );
  }
});
