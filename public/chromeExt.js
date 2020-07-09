function getword(info, tab) {
  console.log("Word " + info.selectionText + " was clicked.");
  chrome.tabs.create({
    //url: "https://www.oxfordlearnersdictionaries.com/definition/english/" + info.selectionText
    url: "https://www.ldoceonline.com/dictionary/" + info.selectionText
  });
}

chrome.contextMenus.create({
  title: "Longman: %s",
  contexts: ["selection"],
  onclick: getword
});