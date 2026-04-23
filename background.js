chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (
    !tab.url ||
    !tab.url.includes("moxfield.com/decks") ||
    tab.url.includes("moxfield.com/decks/personal")
  ) {
    return null;
  }

  const noUrl = tab.url.substring(tab.url.indexOf("moxfield.com/decks/") + 19);
  const id = noUrl.substring(noUrl.indexOf("?") + 1);
  chrome.tabs.sendMessage(tabId, {
    type: "NEW",
    id,
  });
});
