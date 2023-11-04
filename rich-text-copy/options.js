document.addEventListener('DOMContentLoaded', function () {
  const richTextToggle = document.getElementById('rich-text-toggle');
  const markdownLinkToggle = document.getElementById('markdown-link-toggle');
  const saveMessage = document.getElementById('saveMessage');

  // Load saved settings
  chrome.storage.local.get(['richText', 'markdownLink'], function (items) {
    richTextToggle.checked = items.richText !== false;
    markdownLinkToggle.checked = items.markdownLink === true;
  });

  // Save the settings
  document.getElementById('saveOptions').addEventListener('click', function () {
    chrome.storage.local.set(
      {
        richText: richTextToggle.checked,
        markdownLink: markdownLinkToggle.checked,
      },
      function () {
        saveMessage.innerHTML = `Saved at ${new Date().toLocaleString()}`;
        chrome.runtime.sendMessage({ action: 'updateContextMenu' });
      },
    );
  });
});
