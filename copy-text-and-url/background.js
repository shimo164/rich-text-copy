chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'parent',
    title: 'Copy Text URL',
    contexts: ['selection'],
  });

  chrome.contextMenus.create({
    id: 'rich-text-style',
    title: 'Rich text',
    parentId: 'parent',
    contexts: ['selection'],
  });

  chrome.contextMenus.create({
    id: 'markdown',
    title: 'Markdown',
    parentId: 'parent',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const text = info.selectionText;
  const url = tab.url;

  // Check if the URL is restricted
  if (url.startsWith('chrome://')) {
    console.log('Cannot operate on chrome:// URLs');
    return;
  }

  let html;
  let plainText = text;

  if (info.menuItemId === 'rich-text-style') {
    html = `<a href="${url}">${text}</a>`;
  } else if (info.menuItemId === 'markdown') {
    html = plainText = `[${text}](${url})`;
  }

  if (html) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ['content.js'],
      },
      () => {
        chrome.tabs.sendMessage(
          tab.id,
          {
            action: 'copyToClipboard',
            html: html,
            plainText: plainText,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
              return;
            }
            if (response && response.status === 'copied') {
              console.log('Successfully copied to clipboard.');
            } else {
              console.error('Failed to copy to clipboard.');
            }
          },
        );
      },
    );
  }
});
