const isValidUrl = (url) => {
  return url.startsWith('http://') || url.startsWith('https://');
};

const createContextMenuItem = (id, title) => {
  chrome.contextMenus.create({
    id: id,
    title: title,
    contexts: ['selection'],
  });
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['richText', 'markdownLink'], function (items) {
    if (items.richText !== false) {
      createContextMenuItem('copy-as-rich-text', 'Copy as Rich Text');
    }
    if (items.markdownLink === true) {
      createContextMenuItem('copy-as-markdown-link', 'Copy as Markdown Link');
    }
  });
});

const copySelectedText = (info, tab) => {
  const text = info.selectionText;
  const url = tab.url;

  if (!isValidUrl(url) || !text) return;

  if (info.menuItemId === 'copy-as-rich-text') {
    const html = `<a href="${url}">${text}</a>`;
    sendToClipboard(html, text, tab.id);
  } else if (info.menuItemId === 'copy-as-markdown-link') {
    const markdown = `[${text}](${url})`;
    sendToClipboard(markdown, text, tab.id);
  }
};

const sendToClipboard = (content, plainText, tabId) => {
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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'selectedText') {
    const text = message.data;
    copySelectedText(
      { selectionText: text, menuItemId: 'copy-as-rich-text' },
      sender.tab,
    );
  } else if (message.action === 'updateContextMenu') {
    chrome.contextMenus.removeAll(() => {
      chrome.storage.local.get(['richText', 'markdownLink'], function (items) {
        if (items.richText !== false) {
          createContextMenuItem('copy-as-rich-text', 'Copy as Rich Text');
        }
        if (items.markdownLink === true) {
          createContextMenuItem(
            'copy-as-markdown-link',
            'Copy as Markdown Link',
          );
        }
      });
    });
  }
});

chrome.action.onClicked.addListener((tab) => {
  const url = tab.url;
  if (!isValidUrl(url)) return;
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['getSelection.js'],
  });
});

chrome.contextMenus.onClicked.addListener(copySelectedText);
