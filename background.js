chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "gttParent",
      title: "GTT",
      contexts: ["selection"]
    });

    chrome.contextMenus.create({
      id: "gttPhraseCheck",
      parentId: "gttParent",
      title: "Check if phrase is ungrammatical or rare usage",
      contexts: ["selection"]
    });

    chrome.contextMenus.create({
      id: "gttBatchCheck",
      parentId: "gttParent",
      title: "Analyze selection of snippets for common errors & false positives",
      contexts: ["selection"]
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!info.selectionText) return;
  
  const rawText = info.selectionText.trim();
  let searchTerms = "";

  if (info.menuItemId === "gttPhraseCheck") {
    searchTerms = `English grammar and usage check please: "${rawText}"`;
  } else if (info.menuItemId === "gttBatchCheck") {
    searchTerms = `Please analyse these snippets for any repeated grammar or usage errors - and also if there are false positives/edge cases:\n\n${rawText}`;
  }

  if (searchTerms) {
    const searchUrl = `https://www.google.com/search?udm=50&q=${encodeURIComponent(searchTerms)}`;
    const config = { url: searchUrl };
    
    if (tab && typeof tab.index === "number") {
      config.index = tab.index + 1;
    }
    chrome.tabs.create(config);
  }
});
