
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(changeInfo.status == "complete"){

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
    
}); 
