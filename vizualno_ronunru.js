



function getinfo(url) {
    var h = new Headers();
    return fetch(url)
    .then(response => response)
    .then(data => data);
  }

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("test")
    if (request.type == "CORS_HTTPREQUEST"){
        var info =  getinfo(request.url).then(async (response) =>  {
          
            if(response.status === 404){
              sendResponse(undefined);
            }
            else{
              var  json = await response.json();
              sendResponse(json);
            }
          });
    }
  return true;
});
function check_script(tabid) {
  return new Promise((resolve, reject) => {
    browser.tabs.sendMessage(tabid,{ type: "contains_script" }, response => {
          if (response) {

              resolve(response);
          } else {
              resolve(false)
              console.log("no response")

          }
      });
  });
}
browser.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    if(  tab.url.includes("https://spworlds.ru") &&  !tab.url.includes("/spb")){
        var script_s = await check_script(tabId);
        if(!script_s){
            console.log("Tesst")
            browser.tabs.query(
                {
                 lastFocusedWindow: true,
                 active: true
                },
                async function (tabs)
                {
                    
                     browser.tabs.executeScript({
                        file: 'three.js',
                      });
                      browser.tabs.executeScript({
                        file: 'three.js-master/examples/js/loaders/GLTFLoader.js',
                      });
                    
                      browser.tabs.executeScript({
                        file: 'stickers.js',
                      }); 
            
                });
           
        }
        
      
       
    }
  
   
    if(changeInfo.status !== undefined && changeInfo.status === "complete" && tab.url.includes("https://spworlds.ru") &&  !tab.url.includes("/spb")){
        
        // if(tab.url.includes("https://spworlds.ru") && tab.url.includes("users/")){
        //     browser.tabs.update(tabId, {url: tab.url});
        // }
        if(tab.url.includes("https://spworlds.ru") &&  tab.url.includes("lawsuits")  &&  !tab.url.includes("lawsuits/")){
            browser.tabs.query(
            {
             lastFocusedWindow: true,
             active: true
            },
            async function (tabs)
            {
             
   
                browser.tabs.executeScript({
                    file: 'sude_plus.js'
                  }); 
            });
        
            
        }
        else if(tab.url.includes("https://spworlds.ru") &&  tab.url.includes("lawsuits/") && !tab.url.includes("/new") ){
            browser.tabs.query(
                {
                 lastFocusedWindow: true,
                 active: true
                },
                function (tabs)
                {
                    browser.tabs.executeScript({
                        file: 'delo.js'
                      }); 
            });
        }
        
        if( tab.url.includes("https://spworlds.ru") &&  tab.url.includes("about")){

            browser.tabs.query(
                {
                lastFocusedWindow: true,
                active: true
                },
                function (tabs)
                {
                    browser.tabs.executeScript({
                        file: 'about.js'
                    }); 
                });

        }
    }
    
}); 

