chrome.runtime.onInstalled.addListener(() => {
  // Clear any existing menu items first to avoid duplicate ID errors on reload
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "gttSimple",
      title: "Ask Google to check grammar on this snippet",
      contexts: ["selection"]
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "gttSimple" && info.selectionText) {
    const rawText = info.selectionText.trim();
    const searchTerms = `English grammar and usage check please: ${rawText}`;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerms)}`;
    const config = {
      url: searchUrl
    };
    // Safely place the new tab directly next to the active tab if available
    if (tab && typeof tab.index === "number") {
      config.index = tab.index + 1;
    }
    chrome.tabs.create(config);
  }
});