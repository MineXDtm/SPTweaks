
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(changeInfo.status == "complete"){
        
        if(tab.url.includes("https://spworlds.ru") &&  tab.url.includes("lawsuits")  &&  !tab.url.includes("lawsuits/")){
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
        else if(tab.url.includes("https://spworlds.ru") &&  tab.url.includes("lawsuits/") && !tab.url.includes("/new") ){
            chrome.tabs.query(
                {
                 lastFocusedWindow: true,
                 active: true
                },
                function (tabs)
                {
                    chrome.tabs.executeScript({
                        file: 'delo.js'
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

        if( tab.url.includes("https://spworlds.ru") &&  tab.url.includes("settings")){

            chrome.tabs.query(
                {
                lastFocusedWindow: true,
                active: true
                },
                function (tabs)
                {
                    chrome.tabs.executeScript({
                        file: 'options.js'
                    }); 
                });
        }
    }
    
};})
