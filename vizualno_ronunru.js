
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(changeInfo.status == "complete"){

        if(tab.url.includes("https://spworlds.ru") &&  tab.url.includes("lawsuits") && tab.url.length == tab.url.indexOf("lawsuits")+8){
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
    if( tab.url.includes("https://spworlds.ru") &&  tab.url.includes("about")){

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
    }
    
}); 
