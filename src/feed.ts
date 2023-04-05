import browser from "webextension-polyfill";
import Mostpopular from "./components/feed/most_popular.svelte";
import { default_check ,exit,sendcors, waitForElm} from "./SPTCore/utilities";
browser.runtime.onMessage.addListener((request) => {
    return default_check(request,"feed")
});


var user_data  : {token: String, user: Object} | null  = null;



async function enable() {
     
    const request_user_data = await fetch("https://spworlds.ru/api/auth/refresh_token",{method: "POST"}).then((response ) =>response.json());

    if(request_user_data.token != undefined )user_data = request_user_data;
    
    const targetNode = document.getElementById("content");
    targetNode.children[0].innerHTML = '';
    targetNode.children[0].className = "";
    
    const config = { attributes: true, childList: true, subtree: true };

    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.attributeName === "class") {
             exit(undefined);
             observer.disconnect();
        } 
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode.children[0], config);

    var p = new Mostpopular({target:targetNode.children[0]});
    //var test = await fetch("https://spworlds.ru/api/sp/posts?sptweaks=true", { headers: { Authorization: "Bearer " + user_data.token}}).then((response ) =>response.json());
    // console.log(test);

    document.addEventListener('DOMNodeInserted', async function (event) {

   
        var element = event.target as any;
        console.log("test");

    })
}

if (document.getElementById("content") != undefined) {
    enable()

}
else {
    waitForElm('#content').then(async (elm) => {

        enable()




    });
}