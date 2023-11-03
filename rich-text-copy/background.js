function isValidUrl(url) {
  return url.startsWith('http://') || url.startsWith('https://');
}

const createContextMenuItem = (id, title) => {
  chrome.contextMenus.create({
    id: id,
    title: title,
    contexts: ['selection'],
  });
};

chrome.runtime.onInstalled.addListener(() => {
  createContextMenuItem('copy-as-rich-text', 'Copy as Rich Text');
  createContextMenuItem('copy-as-markdown-link', 'Copy as markdown link');
});

const handleCopy = (info, tab) => {
  const text = info?.selectionText;
  const url = tab.url;

  if (!(isValidUrl(url) && text)) return;

  let formattedContent;
  if (info.menuItemId === 'copy-as-rich-text') {
    formattedContent = `<a href="${url}">${text}</a>`;
  } else if (info.menuItemId === 'copy-as-markdown-link') {
    formattedContent = `[${text}](${url})`;
  }

  if (formattedContent) {
    copyToClipboard(formattedContent, text, tab.id);
  }
};

const copyToClipboard = (content, plainText, tabId) => {
  chrome.scripting.executeScript(
    {
      target: { tabId: tabId },
      files: ['content.js'],
    },
    () => {
      chrome.tabs.sendMessage(tabId, {
        action: 'copyToClipboard',
        html: content,
        plainText: plainText,
      });
    },
  );
};

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === 'selectedText') {
    handleCopy(
      { selectionText: message.data, menuItemId: 'copy-as-rich-text' },
      sender.tab,
    );
  }
});

chrome.action.onClicked.addListener((tab) => {
  if (isValidUrl(tab.url)) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['getSelection.js'],
    });
  }
});

chrome.contextMenus.onClicked.addListener(handleCopy);
