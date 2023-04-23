import browser from "webextension-polyfill";


import { default_check ,exit,setbuffer,getbuffer} from "./SPTCore/utilities";
import App from "./app.svelte";

browser.runtime.onMessage.addListener((request) => {
    if(request.type == "exit_client"){
        exit(undefined);
        return;
    }
    return default_check(request,"sptweaks_client");
    
});


var user_data  : {token: String, user: Object} | null  = null;
 
function http_spworlds(url){
    return new Promise(async (resolve,reject)=>{
        const response = await fetch(url,{headers:{'Authorization': 'Bearer '+user_data.token,'SPTweaks':'true'}})
            .then(response => response)
            .then(data => data.json());
        resolve(response);
    })
}



async function enable() {
    
    const request_user_data = await fetch("https://spworlds.ru/api/auth/refresh_token",{method: "POST"}).then((response ) =>response.json());
    // window.addEventListener('beforeunload', function(event) {
    //     event.preventDefault();  // prevent the default behavior of the event
    //     event.returnValue = '';  // specify an empty string for modern browsers
    //   });
    if(request_user_data.token != undefined )user_data = request_user_data;
     
    document.head.innerHTML = "";
    document.body.innerHTML = "";
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    link.href = browser.runtime.getURL("src/assets/logo/icon.png");
    document.head.appendChild(link);
    const meta = document.createElement("meta");
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1";
    document.head.appendChild(meta);

    var css = document.createElement("link");
    css.href = browser.runtime.getURL("sptweaks.css");
    css.type = "text/css";
    css.rel = "stylesheet";
    document.head.appendChild(css);
    //window.history.pushState({"pageTitle":"СП Домашняя Страничка"},"", "home");
    const app = new App({target:document.body,props: {
		// assuming App.svelte contains something like
		// `export let answer`:
		http_spworlds,
        setbuffer,
        getbuffer

	}});
    
    //var p = new Mostpopular({target:targetNode.children[0]});
    //var test = await fetch("https://spworlds.ru/api/sp/posts?sptweaks=true", { headers: { Authorization: "Bearer " + user_data.token}}).then((response ) =>response.json());
    // console.log(test);

    document.addEventListener('DOMNodeInserted', async function (event) {

   
        var element = event.target as any;
        //console.log("test");

    })
}
enable();