
import browser from "webextension-polyfill";



const tabs_urls = []
browser.webRequest.onBeforeRequest.addListener(
  function (details) {
    if(details.type == "main_frame"){
      tabs_urls[details.tabId]=details.url;
    }
    // console.log("TEST2");
    // const tabUrl = tab.url;
    if(tabs_urls[details.tabId] == undefined)return{cancel:false};
    if(!tabs_urls[details.tabId].includes("https://spworlds.ru/sptweaks"))return{cancel:false};
  
    //console.log(details);
    // if (details.url.includes("https://spworlds.ru/api/sp/posts") && !details.url.includes("sptweaks=true")) {
    //   return { cancel: true }
    // }
    // if (details.url.includes("https://spworlds.ru/sptweaks") && !details.url.includes("sptweaks=true")) {
    //   return { "responseHeaders":{}}
    // }
    
    if(details.url.includes("app")){
      return { cancel: true }
    }
  },
  { urls: ["*://spworlds.ru/*"] },
  ["blocking"]
);



function getinfo(url) {
  var h = new Headers();
  return fetch(url)
    .then(response => response)
    .then(data => data);
}
browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  if (request.type == "CORS_HTTPREQUEST") {

    var info = getinfo(request.url).then(async (response) => {

      if (response.status === 404) {
        sendResponse(undefined);

      }
      else {
        var json = await response.json();
        sendResponse(json);
      }
    });
  }
  return true;
});

async function check_script(tabid,script_name) {
  return new Promise(async (resolve, reject) => {

    var r = await browser.tabs.sendMessage(tabid, { type: "contains_script" ,script_name:script_name}).then(results => {

      if (results) {

        resolve(results);
      } else {
        resolve(false)

      }
    }).catch((error) => {

      resolve(false)
    });

  });
}


browser.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {

  if (changeInfo.status === undefined || changeInfo.status !== undefined && changeInfo.status !== "loading") return;

  //if (!tab.url.includes("https://spworlds.ru") || tab.url.includes("https://spworlds.ru") && tab.url.includes("spb/")) return;
  if (!tab.url.includes("https://spworlds.ru/sptweaks") ) {
    await browser.tabs.sendMessage(tabId, { type: "exit_client" });
    return;
  };

  var tabs = await browser.tabs.query(
    {
      lastFocusedWindow: true,
      active: true
    });
  var script_s = await check_script(tabId,"sptweaks_client");

  if (!script_s) {

    browser.tabs.executeScript({
      file: 'src/sptweaks_client.js',
    });



  }
  // if(tab.url.includes("https://spworlds.ru") && tab.url.includes("users/")){
  //     browser.tabs.update(tabId, {url: tab.url});
  // }

  // if (tab.url.includes("/feed")) {
  //   browser.tabs.executeScript({
  //     file: 'src/feed.js'
  //   });

  // }
  // else if (tab.url.includes("lawsuits/") && !tab.url.includes("/new")) {
  //   browser.tabs.query(
  //     {
  //       lastFocusedWindow: true,
  //       active: true
  //     },
  //     function (tabs) {
  //       browser.tabs.executeScript({
  //         file: 'delo.js'
  //       });
  //     });
  // }

  // if (tab.url.includes("about")) {

  //   browser.tabs.query(
  //     {
  //       lastFocusedWindow: true,
  //       active: true
  //     },
  //     function (tabs) {
  //       browser.tabs.executeScript({
  //         file: 'about.js'
  //       });
  //     });

  // }


});

