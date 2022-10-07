


var init = false;
function getinfo(url) {
    var h = new Headers();
    return fetch(url)
    .then(response => response)
    .then(data => data);
  }

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == "CORS_HTTPREQUEST"){
        var info =  getinfo(request.url).then(async (response) =>  {
          
            if(response.status === 404){
              sendResponse(undefined);
            }
            else{
              var  json = await response.json();
              console.log(json)
              sendResponse(json);
            }
          });
    }
  return true;
});
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  
    if(tab.url.includes("https://spworlds.ru")){
      
        if(changeInfo.title !== undefined && changeInfo.title.includes("https://") || init == false){
            init = true;
            
            chrome.tabs.query(
                {
                 lastFocusedWindow: true,
                 active: true
                },
                async function (tabs)
                {
                    
                     chrome.tabs.executeScript({
                        file: 'three.js',
                      });
                      chrome.tabs.executeScript({
                        file: 'three.js-master/examples/js/loaders/GLTFLoader.js',
                      });
                    
                      chrome.tabs.executeScript({
                        file: 'stickers.js',
                      }); 
            
                });
           
        }
        
      
       
    }
   
    if(changeInfo.status !== undefined && changeInfo.status === "complete"){
        
        // if(tab.url.includes("https://spworlds.ru") && tab.url.includes("users/")){
        //     chrome.tabs.update(tabId, {url: tab.url});
        // }
        if(tab.url.includes("https://spworlds.ru") &&  tab.url.includes("lawsuits")  &&  !tab.url.includes("lawsuits/")){
            chrome.tabs.query(
            {
             lastFocusedWindow: true,
             active: true
            },
            async function (tabs)
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

        }
    }
    
}); 

