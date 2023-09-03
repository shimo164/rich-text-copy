chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'rich-text-style',
    title: 'Copy as Rich Text',
    contexts: ['selection'],
  });
});

const copySelectedText = (info, tab) => {
  const text = info?.selectionText;
  const url = tab.url;

  if (!text) return;

  if (info.menuItemId === 'rich-text-style' || !info) {
    // The !info check will handle the case when invoked by the extension icon
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
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'selectedText') {
    const text = message.data;
    copySelectedText(
      { selectionText: text, menuItemId: 'rich-text-style' },
      sender.tab,
    );
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['getSelection.js'],
  });
});

chrome.contextMenus.onClicked.addListener(copySelectedText);
