import browser from "webextension-polyfill";
browser.runtime.onMessage.addListener((request) => {

    if (request.type == "remove_script") {

        
        exit(undefined);
        return Promise.resolve(true);

    }
});

function exit( status ) {
    var i;

    if (typeof status === 'string') {
        alert(status);
    }

    window.addEventListener('error', function (e) {e.preventDefault();e.stopPropagation();}, false);

    var handlers = [
        'copy', 'cut', 'paste',
        'beforeunload', 'blur', 'change', 'click', 'contextmenu', 'dblclick', 'focus', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll',
        'DOMNodeInserted', 'DOMNodeRemoved', 'DOMNodeRemovedFromDocument', 'DOMNodeInsertedIntoDocument', 'DOMAttrModified', 'DOMCharacterDataModified', 'DOMElementNameChanged', 'DOMAttributeNameChanged', 'DOMActivate', 'DOMFocusIn', 'DOMFocusOut', 'online', 'offline', 'textInput',
        'abort', 'close', 'dragdrop', 'load', 'paint', 'reset', 'select', 'submit', 'unload'
    ];

    function stopPropagation (e) {
        e.stopPropagation();
        // e.preventDefault(); // Stop for the form controls, etc., too?
    }
    for (i=0; i < handlers.length; i++) {
        window.addEventListener(handlers[i], function (e) {stopPropagation(e);}, true);
    }

    if (window.stop) {
        window.stop();
    }

    throw '';
}
var user_data  : {token: String, user: Object} | null  = null;

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

async function enable() {
     
    const request_user_data = await fetch("https://spworlds.ru/api/auth/refresh_token",{headers:{Origin:"https://spworlds.ru"},   method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors"}).then((response ) =>response.json());

    if(request_user_data.token != undefined )user_data = request_user_data;
    
    const targetNode = document.getElementById("content");
    targetNode.children[0].innerHTML = '';
    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };
    
    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.attributeName === "class") {
             exit(undefined);
             observer.disconnect();
        } 
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);


    var test = await fetch("https://spworlds.ru/api/sp/posts?sptweaks=true", { headers: { Authorization: "Bearer " + user_data.token}}).then((response ) =>response.json());
    console.log(test);

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