
tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    
    if(changeInfo.status == "complete"){
        
        if(tab.url.includes("https://spworlds.ru") &&  tab.url.includes("lawsuits")  &&  !tab.url.includes("lawsuits/")){
            tabs.query(
            {
             lastFocusedWindow: true,
             active: true
            },
            function (tabs)
            {
                tabs.executeScript({
                    file: 'sude_plus.js'
                  }); 
            });
        
            
        }
        else if(tab.url.includes("https://spworlds.ru") &&  tab.url.includes("lawsuits/") && !tab.url.includes("/new") ){
            tabs.query(
                {
                 lastFocusedWindow: true,
                 active: true
                },
                function (tabs)
                {
                    tabs.executeScript({
                        file: 'delo.js'
                      }); 
            });
        }
        if( tab.url.includes("https://spworlds.ru") &&  tab.url.includes("about")){

            tabs.query(
                {
                lastFocusedWindow: true,
                active: true
                },
                function (tabs)
                {
                    tabs.executeScript({
                        file: 'about.js'
                    }); 
                });
        }
    }
    
}); 
