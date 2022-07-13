
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(changeInfo.status == "complete" && tab.url == "https://spworlds.ru/sp/lawsuits"){

        chrome.tabs.query(
            {
             lastFocusedWindow: true,
             active: true
            },
            function (tabs)
            {
                chrome.tabs.executeScript({
                    file: 'sude_plus.js'
                  }); 
            });
    }
    if(changeInfo.status == "complete" && tab.url == "https://spworlds.ru/sp/about"){

        chrome.tabs.query(
            {
             lastFocusedWindow: true,
             active: true
            },
            function (tabs)
            {
                chrome.tabs.executeScript({
                    file: 'about.js'
                  }); 
            });
    }
}); 
