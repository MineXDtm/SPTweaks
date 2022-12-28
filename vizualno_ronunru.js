
import browser from "webextension-polyfill";




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
async function check_script(tabid) {
  return new Promise(async (resolve, reject) => {

    var r = await browser.tabs.sendMessage(tabid, { type: "contains_script" }).then(results => {

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



  if (changeInfo.status !== undefined && changeInfo.status === "complete" && tab.url.includes("https://spworlds.ru") && !tab.url.includes("/spb")) {
    if ( !tab.url.includes("/spb")) {

      var script_s = await check_script(tabId);

      if (!script_s) {
        var tabs = await browser.tabs.query(
          {
            lastFocusedWindow: true,
            active: true
          });

        browser.tabs.executeScript({
          file: 'src/assets/three.js',
        });
        browser.tabs.executeScript({
          file: 'src/assets/three.js-master/examples/js/loaders/GLTFLoader.js',
        });

        browser.tabs.executeScript({
          file: 'src/stickers.js',
        });

        

      }



    }
    // if(tab.url.includes("https://spworlds.ru") && tab.url.includes("users/")){
    //     browser.tabs.update(tabId, {url: tab.url});
    // }
    if (tab.url.includes("lawsuits") && !tab.url.includes("lawsuits/")) {
      browser.tabs.query(
        {
          lastFocusedWindow: true,
          active: true
        },
        async function (tabs) {


          browser.tabs.executeScript({
            file: 'sude_plus.js'
          });
        });


    }
    else if (tab.url.includes("lawsuits/") && !tab.url.includes("/new")) {
      browser.tabs.query(
        {
          lastFocusedWindow: true,
          active: true
        },
        function (tabs) {
          browser.tabs.executeScript({
            file: 'delo.js'
          });
        });
    }

    if (tab.url.includes("about")) {

      browser.tabs.query(
        {
          lastFocusedWindow: true,
          active: true
        },
        function (tabs) {
          browser.tabs.executeScript({
            file: 'about.js'
          });
        });

    }
  }

});

