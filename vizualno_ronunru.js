
browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    
    if(changeInfo.status == "complete"){
        
        if(tab.url.includes("https://spworlds.ru") &&  tab.url.includes("lawsuits")  &&  !tab.url.includes("lawsuits/")){
            console.log(browser.tabs);
            browser.tabs.executeScript({
                file: 'sude_plus.js'
                
              }); 
            
        }
        else if(tab.url.includes("https://spworlds.ru") &&  tab.url.includes("lawsuits/") && !tab.url.includes("/new") ){
            browser.tabs.executeScript({
                        file: 'delo.js'
                      }); 
            
        }
        if( tab.url.includes("https://spworlds.ru") &&  tab.url.includes("about")){

            browser.tabs.executeScript({
                        file: 'about.js'
                    }); 
            
        }
    }
    
}); 
